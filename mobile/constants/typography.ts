export const FontFamilies = {
  heading: "PlusJakartaSans_800ExtraBold",
  body: "DMSans_400Regular",
  bodyLight: "DMSans_300Light",
  mono: "SpaceMono_700Bold",
} as const;

export const FontSizes = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  "2xl": 24,
  "3xl": 28,
  "4xl": 32,
  "5xl": 40,
} as const;

export const LetterSpacings = {
  heading1: -3,
  heading2: -2.5,
  heading3: -2,
  heading4: -1.5,
  eyebrow: 3,
  wordmark: -3,
} as const;

export const LineHeights = {
  paragraph: 1.7,
  ui: 1.3,
  heading: 1.1,
} as const;

export const HeadingSizes = {
  1: FontSizes["5xl"],
  2: FontSizes["4xl"],
  3: FontSizes["2xl"],
  4: FontSizes.xl,
} as const;

export const HeadingLetterSpacings = {
  1: LetterSpacings.heading1,
  2: LetterSpacings.heading2,
  3: LetterSpacings.heading3,
  4: LetterSpacings.heading4,
} as const;
