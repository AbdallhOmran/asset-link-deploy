/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary
        primary: {
          DEFAULT: "#1A6CFF",
          sidebar: "#0F172A", 
          cyan: "#00A3FF",    
        },
        // Backgrounds
        page: "#F8FAFC",      
        card: "#FFFFFF",     

        // Text
        text: {
          DEFAULT: "#0F172A",
          muted: "#64748B",  
        },

        // Borders
        border: {
          DEFAULT: "#E2E8F0",
        },

        // Status colors
        success: {
          DEFAULT: "#10B981",
          bg: "#ECFDF5",
        },
        info: {
          DEFAULT: "#06B6D4",
          bg: "#ECFEFF",
        },
        warning: {
          DEFAULT: "#F59E0B",
          bg: "#FEF3C7",
        },
        danger: {
          DEFAULT: "#F43F5E",
          bg: "#FFF1F2",
        },

        // AI Panel / Tooltips
        panel: "#2A2A3D",
        upgrade: "#4F46E5",
      },
      borderRadius: {
        card: "12px",
      },
    },
  },
  plugins: [],
};
