/**
 * Soft UI Dashboard Typography System
 * Adapted from Soft UI Dashboard React for Next.js/TypeScript
 */

export const softUITypography = {
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightBold: 700,
  
  h1: {
    fontSize: "3rem",
    lineHeight: 1.25,
    fontWeight: 700,
  },
  
  h2: {
    fontSize: "2.25rem",
    lineHeight: 1.3,
    fontWeight: 700,
  },
  
  h3: {
    fontSize: "1.875rem",
    lineHeight: 1.375,
    fontWeight: 700,
  },
  
  h4: {
    fontSize: "1.5rem",
    lineHeight: 1.375,
    fontWeight: 700,
  },
  
  h5: {
    fontSize: "1.25rem",
    lineHeight: 1.375,
    fontWeight: 700,
  },
  
  h6: {
    fontSize: "1rem",
    lineHeight: 1.625,
    fontWeight: 700,
  },
  
  subtitle1: {
    fontSize: "1rem",
    lineHeight: 1.625,
    fontWeight: 400,
  },
  
  subtitle2: {
    fontSize: "0.875rem",
    lineHeight: 1.57,
    fontWeight: 400,
  },
  
  body1: {
    fontSize: "1rem",
    lineHeight: 1.625,
    fontWeight: 400,
  },
  
  body2: {
    fontSize: "0.875rem",
    lineHeight: 1.57,
    fontWeight: 400,
  },
  
  button: {
    fontSize: "0.75rem",
    lineHeight: 1.5,
    fontWeight: 700,
    textTransform: "uppercase" as const,
  },
  
  caption: {
    fontSize: "0.75rem",
    lineHeight: 1.25,
    fontWeight: 400,
  },
  
  overline: {
    fontSize: "0.75rem",
    lineHeight: 2.66,
    fontWeight: 400,
  },
  
  size: {
    xxs: "0.625rem",
    xs: "0.75rem",
    sm: "0.875rem",
    md: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
    "5xl": "3rem",
  },
} as const

export type SoftUITypographyVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'subtitle1' | 'subtitle2' | 'body1' | 'body2' | 'button' | 'caption' | 'overline'
export type SoftUIFontSize = keyof typeof softUITypography.size

// Helper function to get font size
export function getFontSize(sizeKey: SoftUIFontSize): string {
  return softUITypography.size[sizeKey]
}

