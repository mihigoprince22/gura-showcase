export const Colors = {
  guraOrange: "#FF5A1F",
  savannaGold: "#F5A623",
  malachite: "#00A878",
  midnightInk: "#0F0E17",
  warmLinen: "#FAF6F1",
  slate: "#6B7080",
  orangeTint: "#FFF2EB",
  goldTint: "#FEF3D9",
  malachiteTint: "#E6F7F3",
  slateTint: "#E5E4E9",
  danger: "#E53E3E",
  dangerTint: "#FEE2E2",
} as const;

export type ColorToken = keyof typeof Colors;
