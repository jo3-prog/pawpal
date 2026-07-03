/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./context/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#FBF3E1", // warm vellum background
        ink: "#1F2A24", // deep pine ink for text
        pine: {
          DEFAULT: "#2F5233",
          dark: "#203923",
          light: "#3E6B45",
        },
        marigold: {
          DEFAULT: "#E08E2C",
          light: "#F2AE5C",
        },
        coral: {
          DEFAULT: "#D1495B",
          dark: "#A8364A",
        },
        card: "#FFFDF7",
        line: "#C9BFA0",
      },
      fontFamily: {
        display: ["Fredoka", "ui-sans-serif", "system-ui", "sans-serif"],
        body: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        stamp: ['"Special Elite"', "ui-monospace", "monospace"],
      },
      boxShadow: {
        card: "0 1px 0 rgba(31,42,36,0.04), 0 8px 24px -12px rgba(31,42,36,0.25)",
        stamp: "0 0 0 2px rgba(209,73,91,0.15)",
      },
      backgroundImage: {
        "dot-grid":
          "radial-gradient(circle, rgba(31,42,36,0.08) 1px, transparent 1px)",
      },
      backgroundSize: {
        "dot-grid": "16px 16px",
      },
    },
  },
  plugins: [],
};
