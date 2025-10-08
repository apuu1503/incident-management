/** @type {import('tailwindcss').Config} */
import forms from '@tailwindcss/forms'; // <-- 1. Import the plugin

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", 
  ],
  theme: {
    extend: {},
  },
  plugins: [
    forms, // <-- 2. Register the plugin here
  ],
}