/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom theme primitives - Archival Editorial Palette
        canvas: '#EFECE6',
        headers: '#2B2D30',
        subtext: '#5A5D61',
        'card-surface': '#F7F5F0',
        highlight: '#EE5649',

        // The Matinee Gallery / Stitch design system colors
        'on-surface': '#1A1C1E',
        'on-surface-variant': '#4A4C50',
        outline: '#7A7C80',
        'outline-variant': '#D9D5CC',
        error: '#ba1a1a',
        'error-container': '#ffdad6',
        'on-error-container': '#93000a',
        'surface-container-lowest': '#FFFFFF',
        'surface-container-low': '#F7F5F0',
        'surface-container': '#EFECE6',
        'surface-container-high': '#E5E1D8',
        'surface-container-highest': '#DDD8CE',
        'primary-container': '#FDE8E5',
        'on-primary-container': '#C93B2E',

        // Standard shadcn variables
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
      },
      fontFamily: {
        serif: ["Instrument Serif", "Playfair Display", "serif"],
        sans: ["Plus Jakarta Sans", "Source Sans 3", "sans-serif"],
      }
    },
  },
  plugins: [],
}
