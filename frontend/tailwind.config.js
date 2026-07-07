/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom theme primitives
        canvas: '#fdf9f4',
        headers: '#635f41',
        subtext: '#466272',
        'card-surface': '#f7f3ee',
        highlight: '#8CC0EB',

        // Matinee Club Theme Colors
        'primary-container': '#fff9d2',
        'on-primary-container': '#767253',
        'surface-container-low': '#f7f3ee',
        'surface-container-high': '#ece7e3',
        'surface-container-highest': '#e6e2dd',
        'outline-variant': '#cac6b9',
        'on-surface-variant': '#49473d',
        'on-surface': '#1c1b19',
        'azure-blue': '#8CC0EB',
        'soft-peach': '#FFEBCC',
        'sky-blue': '#BFDDF0',

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
        serif: ["Playfair Display", "serif"],
        sans: ["Source Sans 3", "sans-serif"],
      }
    },
  },
  plugins: [],
}
