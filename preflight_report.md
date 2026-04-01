# System Pre-Flight Report
**Silk Value Collector App — PNPM Monorepo**
**Scan Date:** 2026-04-01

---

## \[Code Fixes Applied\]

### FIX 1 — `packages/shared-types/package.json` (CRITICAL)

**Problem:** `"main"` pointed to `./dist/index.js` — a **precompiled CommonJS** file. The TypeScript compiler (`module: "CommonJS"`) generates a `__exportStar` wrapper that uses the JavaScript `in` operator:

```js
// dist/index.js — line 5 & 14 (generated code)
if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable))
for (var p in m) if (p !== "default" ...) __createBinding(exports, m, p);
```

When Metro resolves this CJS file and the child module (`enums.js`) hasn't fully initialized due to evaluation ordering, the variable `m` is `undefined`. The expression `"get" in undefined` throws **exactly** `TypeError: right operand of 'in' is not an object`.

This is the **primary crash vector**. The other two workspace packages (`@silk-value/ui`, `@silk-value/supabase-client`) already have `"main": "./src/index.ts"` — Metro transpiles their raw TS directly and never encounters CJS `__exportStar`.

**Fix Applied:**
```diff
- "main": "./dist/index.js",
- "types": "./dist/index.d.ts",
+ "main": "./src/index.ts",
+ "types": "./src/index.ts",
```

> [!IMPORTANT]
> This was the smoking gun. Every WatermelonDB model file (`Profile.ts`, `Route.ts`, `Reeler.ts`, `RouteStop.ts`, `CollectionTicket.ts`) imports enums from `@silk-value/shared-types`. Those models are loaded at module-init time by `database.ts`. If any one of those enum imports resolves as `undefined` due to the CJS race, the entire model registry fails, which cascades into the navigation crash.

---

### FIX 2 — `packages/shared-types/src/index.ts` (CRITICAL)

**Problem:** The barrel file used wildcard `export *` re-exports:
```ts
export * from './enums';
export * from './database';
```

While this worked when Metro wasn't touching this file (because `main` pointed to `dist/`), now that FIX 1 routes Metro through the raw TS source, we must apply the same defensive pattern that already saved `@silk-value/ui` — strict named exports only.

**Fix Applied:** Replaced with 35 lines of explicit named exports covering all 10 enums and 12 type interfaces. No wildcards remain.

---

## \[Clearances\]

| System | File(s) Inspected | Verdict |
|---|---|---|
| **UI Package Barrel** | `packages/ui/src/index.ts` | ✅ PASS — All 14 component exports + 6 type exports are strict named. No wildcards. Previous fix holds. |
| **Supabase-Client Barrel** | `packages/supabase-client/src/index.ts` | ✅ PASS — 3 named function/type exports. No wildcards. `"main"` already points to `./src/index.ts`. |
| **Metro Config** | `apps/collector-app/metro.config.js` | ✅ PASS — `watchFolders` set to workspace root. `nodeModulesPaths` includes both local and hoisted `node_modules`. Standard Expo monorepo pattern. |
| **Babel Config** | `apps/collector-app/babel.config.js` | ✅ PASS — `babel-preset-expo` + `@babel/plugin-proposal-decorators` with `legacy: true`. Correct order (presets before plugins). WatermelonDB decorator requirement satisfied. |
| **Entry Point Chain** | `package.json` → `index.js` → `App.tsx` | ✅ PASS — `"main": "index.js"` matches the file that calls `registerRootComponent(App)`. `App.tsx` exports default, `index.js` imports and registers it. No double registration. |
| **Navigation Architecture** | `RootNavigator.tsx`, `AuthNavigator.tsx`, `AppNavigator.tsx` | ✅ PASS — Session state is `useState<Session \| null>(null)` (never `undefined`). `NavigationContainer` receives no custom theme (uses default). All `component={}` props reference properly exported named components. |
| **WatermelonDB Model Registry** | `data/models/index.ts` | ✅ PASS — Uses `export { default as X }` pattern. Each model file imports from `@nozbe/watermelondb` and `@silk-value/shared-types` only. No circular imports back to `database.ts` or `schema.ts`. |
| **Schema** | `data/schema.ts` | ✅ PASS — Imports only from `@nozbe/watermelondb`. No imports from models or database. No circular dependency. |
| **Database Init** | `data/database.ts` | ✅ PASS — Imports `schema` (no circular) and models via `./models` barrel (no circular back). Clean DAG: `schema` ← `database` → `models` → `shared-types`. |
| **Sync Service** | `services/sync.ts` | ✅ PASS — Imports `database` (singleton), `supabase` (singleton), and type-only imports from `@silk-value/shared-types`. No circular. All Supabase query results are null-coalesced (`?? []`). |
| **Queries** | `data/queries.ts` | ✅ PASS — Type-only model imports. No runtime circular references. |
| **PNPM Workspace** | `pnpm-workspace.yaml` | ✅ PASS — Standard `apps/*` + `packages/*` configuration. |
| **TypeScript Configs** | All 4 `tsconfig.json` files | ✅ PASS — `experimentalDecorators` enabled in collector-app. `isolatedModules: true` everywhere (required by Metro). |

---

## \[Warnings\]

### WARNING 1 — Dead Import in `App.tsx`
**File:** `apps/collector-app/App.tsx`, line 12
```ts
import { registerRootComponent } from 'expo';
```
This import is never used. The actual `registerRootComponent` call lives in `index.js`. Not a crash risk, but it adds an unnecessary module evaluation at boot and will trigger lint warnings.

### WARNING 2 — WatermelonDB JSI Mode on Expo
**File:** `apps/collector-app/src/data/database.ts`, line 22
```ts
jsi: true,
```
With `jsi: true`, WatermelonDB attempts to use the C++ native JSI bridge. If the custom Dev Client doesn't include the precompiled native module, WatermelonDB silently falls back to the async bridge and logs: `"JSI SQLiteAdapter not available... falling back to asynchronous operation"`. This is the source of that warning. **Not a crash risk** — the fallback is graceful — but it means you're running on the slower async bridge during development.

### WARNING 3 — `supabase-client` Stale `dist/` Artifacts
**File:** `packages/supabase-client/dist/index.js`
The `dist/` directory contains a previously compiled build. Since `package.json` now points `main` to `./src/index.ts`, this `dist/` is never resolved by Metro. However, the NestJS backend (if it imports `@silk-value/supabase-client`) **will** resolve `dist/` unless its bundler is also configured for raw TS. Keep `dist/` around if you have a Node.js consumer; delete it if everything goes through Metro.

### WARNING 4 — `shared-types` Stale `dist/` Artifacts
**File:** `packages/shared-types/dist/index.js`
Same as WARNING 3. The `dist/` directory is now orphaned after FIX 1. Metro will resolve `./src/index.ts` directly. If the NestJS backend imports `@silk-value/shared-types`, it still needs `dist/`. Otherwise, these compiled files are dead weight and a source of confusion.
