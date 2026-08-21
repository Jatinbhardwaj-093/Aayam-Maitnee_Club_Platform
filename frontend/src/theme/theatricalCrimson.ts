/**
 * Theatrical Crimson Theme Tokens & Palette Reference
 * 
 * Signature vintage theatre palette: rich terracotta-crimson accents,
 * velvety warm card surfaces, soft blush borders, and deep garnet primary controls.
 */

export const THEATRICAL_CRIMSON = {
  name: "Theatrical Crimson",
  description: "Aayam Theatrical Deep Crimson & Warm Terracotta Repertoire Theme",
  colors: {
    // Primary Accents
    primary: "#8C241E",         // Deep Theatrical Crimson (buttons, active pills, badges)
    primaryHover: "#731B16",    // Dark Velvet Wine
    primaryBorder: "#A6352F",   // Crimson Edge Accent
    accentLight: "#FFD0CC",     // Soft Crimson Highlight (icons, subtle text)
    vibrantAccent: "#B32D25",   // Vivid Stage Coral-Crimson

    // Surfaces & Card Washes
    surfaceBg: "#F2E5E0",       // Main Section Background
    cardBg: "#FAF2EE",          // Inner Card / Item Background
    modalBg: "#F5EAE6",         // Modal / Popup Surface
    metricGradientStart: "#F5EAE6",
    metricGradientEnd: "#EEDBD5",
    inputBg: "#E8D6CF",         // Form Controls / Inputs (with opacity)

    // Borders & Dividers
    borderStrong: "#DCBAB2",    // Container & Card Outlines
    borderSubtle: "#D8B4AE",    // Dividers & Secondary Borders
    borderLight: "#DEBEB7",     // Metric Card Borders

    // Typography
    textPrimary: "#2A1816",     // Dark Espresso-Crimson Header / Body Text
    textSecondary: "#5C3B37",   // Warm Muted Subtitle / Notes
    textMuted: "#6E4742",       // Metadata / Labels / Placeholders
    textContrast: "#FDF8F7",    // Ivory on Dark Crimson Buttons
  }
} as const;

export default THEATRICAL_CRIMSON;
