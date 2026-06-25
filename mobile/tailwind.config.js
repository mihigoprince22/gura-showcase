/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        "gura-orange": "#FF5A1F",
        "savanna-gold": "#F5A623",
        "malachite": "#00A878",
        "midnight-ink": "#0F0E17",
        "warm-linen": "#FAF6F1",
        "slate": "#6B7080",
        "orange-tint": "#FFF2EB",
        "gold-tint": "#FEF3D9",
        "malachite-tint": "#E6F7F3",
        "slate-tint": "#E5E4E9",
      },
      fontFamily: {
        heading: ["PlusJakartaSans_800ExtraBold"],
        body: ["DMSans_400Regular"],
        "body-light": ["DMSans_300Light"],
        mono: ["SpaceMono_700Bold"],
      },
    },
  },
  plugins: [],
};
