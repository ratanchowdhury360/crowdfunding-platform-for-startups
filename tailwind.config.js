/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#002C15",
        accent: "#C3F53C",
        white: "#FFFFFF",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "dark"],  // Using just light and dark themes
    darkTheme: "dark",          // Default dark theme
    base: true,                 // Basic styling
    styled: true,               // DaisyUI components
    utils: true,                // Extra utilities
  },
}

