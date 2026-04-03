# Design System Documentation: Factory Logistics

## 1. Overview & Creative North Star
**The Creative North Star: "Industrial Brutalism"**
This design system rejects the "softness" of modern consumer apps in favor of the raw, high-contrast utility found in physical factory environments. It is inspired by architectural blueprints, shipping manifests, and technical machinery interfaces. 

By utilizing a strict monochromatic palette and a rigid "ink-on-paper" aesthetic, we create a signature identity that feels authoritative and unbreakable. We break the standard "template" look by leveraging intentional whitespace (the "White Space as Structure" principle) and hyper-legible typographic scales. The goal is not just "minimalism," but "Functional Precision"—where every pixel serves a logistical purpose.

---

## 2. Colors
The color strategy is binary and uncompromising. It mimics the high-contrast visibility of safety signage and industrial labeling.

| Token | Hex | Role |
| :--- | :--- | :--- |
| `primary` | #000000 | Actionable elements, primary text, and structural borders. |
| `on_primary` | #FFFFFF | Text on primary buttons and high-contrast inversions. |
| `surface` | #FFFFFF | The primary canvas; represents the "floor" of the app. |
| `surface_container` | #F5F5F5 | Subtle grouping for secondary data or inactive zones. |
| `outline` | #000000 | Strict containment for inputs and cards. |
| `on_surface_variant` | #888888 | Captions, placeholders, and non-critical metadata. |
| `outline_variant` | #DDDDDD | Low-priority structural separation (dividers). |

**The "High-Contrast Surface" Rule:** 
Do not use shadows to create depth. Depth is binary: an object is either on the `surface` (#FFFFFF) or contained within a `surface_container` (#F5F5F5). Use the `outline` (#000000) token for all interactive containers to ensure they feel "stamped" onto the interface.

---

## 3. Typography
We utilize **Inter** for its neutral, neo-grotesque technicality. The system relies on weight and scale rather than color to define hierarchy.

*   **Display & Headlines:** Use `headline-lg` (2rem) and `headline-md` (1.75rem) in **Bold** for screen titles. These should feel like headers on a manifest.
*   **Titles:** Use `title-lg` (1.375rem) **Bold** for card headers and section titles.
*   **Body:** Use `body-lg` (1rem) **Regular** for standard reading. Line height must be generous (1.5x) to ensure legibility in high-vibration factory environments.
*   **Labels:** Use `label-md` (0.75rem) **Bold** for input labels and button text. This "all-caps" or "bold-small" approach mimics industrial tag labeling.

---

## 4. Elevation & Depth
In this system, elevation is achieved through **Stroke and Contrast**, not shadows.

*   **The Layering Principle:** Treat the UI as a series of technical drawings. To separate a card from the background, use a 1px `outline` (#000000). To group related data, place it on a `surface_container` (#F5F5F5) block without a border.
*   **The "Zero-Shadow" Mandate:** Shadows are strictly prohibited. They introduce "fuzziness" that contradicts the precision of a logistics tool. 
*   **Hard Boundaries:** All interactive elements (Inputs, Buttons, Cards) must have a clearly defined 1px boundary or a high-contrast fill. This ensures hit targets are unambiguous for users wearing gloves or working in low-light conditions.

---

## 5. Components

### Buttons
*   **Primary:** 52px height, `primary` (#000000) fill, `on_primary` (#FFFFFF) text, `sm` (4px) radius. Type: `label-md` Bold.
*   **Secondary:** 52px height, `surface` (#FFFFFF) fill, 1px `outline` (#000000) border, `primary` (#000000) text.

### Input Fields
*   **Structure:** Label (Bold) positioned above the field.
*   **Field:** 1px `outline` (#000000) border, `surface` (#FFFFFF) background, 8px padding-x.
*   **State:** Focused inputs should increase border-width to 2px for immediate visual feedback.

### Cards & Lists
*   **Cards:** 1px `outline` (#000000) border, `lg` (8px) radius, 16px (1.75rem) padding. No shadow.
*   **Lists:** Use vertical spacing (`spacing-4`) to separate items. Forbid the use of divider lines between list items unless the data density is extreme; prefer background shifts (`surface_container`) for row stripes.

### Bottom Navigation
*   **Dimensions:** 60px height.
*   **Style:** `surface` (#FFFFFF) background with a 1px `outline_variant` (#DDDDDD) top border. 
*   **Icons:** Use 24px stroke-based icons (2px weight) to match the border language of the system.

### Industrial-Specific Components
*   **Status Badges:** Solid Black (#000000) for "Active," Solid Grey (#888888) for "Pending." Do not use traffic light colors (Red/Green) unless it is a critical safety error; use text labels and heavy weights for status instead.
*   **Data Grids:** Use `surface_container_highest` (#E2E2E2) for header rows to create a "Table Head" feel that mimics ledger paper.

---

## 6. Do's and Don'ts

### Do
*   **DO** use strict 8px or 16px padding (Spacing `8` and `10`) to create a "Technical Grid" feel.
*   **DO** use bold typography for all data labels (e.g., **WEIGHT:** 500kg) to ensure information is scannable at a glance.
*   **DO** use the `sm` (4px) radius for buttons and `lg` (8px) for cards to maintain a slightly "engineered" corner.

### Don't
*   **DON'T** use gradients, blurs, or drop shadows.
*   **DON'T** use rounded "pill" buttons; they feel too consumer-focused and "soft."
*   **DON'T** introduce color accents for "beauty." If a color is used, it must be for a critical Error state (`error` #BA1A1A).
*   **DON'T** use 1px borders to separate everything. Use whitespace first; use `outline_variant` (#DDDDDD) only when the data structure breaks without it.