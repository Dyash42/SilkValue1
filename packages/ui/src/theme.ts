// ─── Silk Value — Design System Theme ────────────────────────────────────────
// Single source of truth for all design tokens.
// All values derived from the Industrial Brutalist login screen reference.
// Font: Inter (Google Fonts) — weights 400, 500, 700.
//
// CRITICAL: This design uses ZERO border radius on all interactive elements.
// The only rounded element is the logo icon container.

export const theme = {
  colors: {
    /** Screen background — pure white */
    background: "#FFFFFF",
    /** Card and input backgrounds — light gray */
    surface: "#F5F5F5",
    /** Primary button fill, borders, labels — pure black */
    primary: "#000000",
    /** Primary button label — white on black */
    primaryText: "#FFFFFF",
    /** Secondary button fill — transparent/white */
    secondary: "#FFFFFF",
    /** Secondary button label — black */
    secondaryText: "#000000",
    /** Default border color — black */
    border: "#000000",
    /** Prefix divider — black at 20% opacity */
    borderMuted: "rgba(0,0,0,0.2)",
    /** Main body text — black */
    textPrimary: "#000000",
    /** Supporting text — slate-500 */
    textSecondary: "#64748B",
    /** Captions, footers, placeholders — slate-400 */
    textMuted: "#94A3B8",
    /** Info card body text — slate-700 */
    textBody: "#334155",
    /** Error and destructive action */
    danger: "#DC2626",
    /** Confirmed and accepted state */
    success: "#16A34A",
    /** Pending and alert state */
    warning: "#D97706",

    // ── Home Dashboard tokens (02_home_route_updated) ─────────────────────
    /** Skipped card background — slate-50 */
    surfaceAlt: "#F8FAFC",
    /** Done badge background — slate-100 */
    surfaceMuted: "#F1F5F9",
    /** Progress bar track, Skipped badge bg — slate-200 */
    progressTrack: "#E2E8F0",
    /** Skipped elements text — slate-600 */
    textTertiary: "#475569",
    /** Inactive bottom nav tab icon and label */
    navInactive: "#AAAAAA",
    /** Light borders — top bar divider, card internal dividers — slate-200 */
    borderLight: "#E2E8F0",
    
    // Added for RouteMapScreen — Screen 03
    /** Map placeholder background */
    mapPlaceholder: "#E8E8E8",
    /** Drag handle colour (bottom sheet) */
    dragHandle: "#CBD5E1",
    /** GPS dot inner blue */
    gpsBlue: "#2563EB",
    /** GPS dot outer halo */
    gpsBlueHalo: "rgba(59,130,246,0.3)",
    /** Done badge background (10% black) */
    primaryMuted: "rgba(0,0,0,0.1)",
  },

  typography: {
    /** Captions, footer text (~10px) */
    fontSizeXS: 10,
    /** Labels, placeholders, button text (~13px) */
    fontSizeSM: 13,
    /** Stats labels, small body text (~14px) — Home Dashboard */
    fontSizeBase: 14,
    /** Base body text (~15px) */
    fontSizeMD: 15,
    /** Input text, subheadings (~18px) */
    fontSizeLG: 18,
    /** Screen titles, app name (~24px) */
    fontSizeXL: 24,
    /** Hero numbers, large display values (~32px) */
    fontSizeXXL: 32,
    /** OTP digit display (~20px) */
    fontSizeOtp: 20,

    fontWeightRegular: "400" as const,
    fontWeightMedium: "500" as const,
    fontWeightBold: "700" as const,

    /** Uppercase tracking for labels and buttons */
    letterSpacingWide: 1.5,
    /** Widest tracking for captions */
    letterSpacingWidest: 2.5,
    /** Tight tracking for titles */
    letterSpacingTight: -0.5,
  },

  spacing: {
    /** 4px */
    xs: 4,
    /** 8px */
    sm: 8,
    /** 16px */
    md: 16,
    /** 24px */
    lg: 24,
    /** 32px */
    xl: 32,
    /** 48px */
    xxl: 48,
  },

  borders: {
    /** Logo icon container only */
    radiusSM: 4,
    /** NOT used on interactive elements — Industrial Brutalist = 0 */
    radiusMD: 0,
    /** Logo icon container */
    radiusLG: 12,
    /** Circular elements — stop badges, sync dot — Home Dashboard */
    radiusFull: 9999,
    /** Card border radius — Home Dashboard */
    radiusCard: 8,
    /** Thin border (prefix divider) */
    widthThin: 1,
    /** Standard border (inputs, cards, OTP boxes) */
    widthDefault: 1,
    /** Thick/emphasized border */
    widthThick: 1.5,
    // Added for RouteMapScreen — Screen 03
    /** Top border radius for bottom sheet */
    radiusXL: 12,
    /** Active card border width */
    widthActive: 2,
  },

  layout: {
    /** Horizontal padding on all screens */
    screenPaddingHorizontal: 24,
    /** Vertical padding on all screens */
    screenPaddingVertical: 48,
    /** Bottom navigation bar height */
    bottomNavHeight: 60,
    /** Input field height */
    inputHeight: 56,
    /** Button height */
    buttonHeight: 56,
    /** OTP box size */
    otpBoxSize: 52,
    /** Logo icon container size */
    logoIconSize: 64,
    /** ProgressBarTrack height — Home Dashboard */
    progressBarHeight: 10,
    /** Stop number badge diameter — Home Dashboard */
    stopBadgeSize: 32,
    // Added for RouteMapScreen — Screen 03
    /** Stop badge size (route map variant) */
    stopBadgeSizeLG: 40,
    /** Drag handle height */
    dragHandleHeight: 4,
    /** Drag handle width */
    dragHandleWidth: 48,
  },
} as const;

/** Inferred type for the theme — enables full autocomplete in consumers */
export type Theme = typeof theme;
