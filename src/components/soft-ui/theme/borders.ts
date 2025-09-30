/**
 * Soft UI Dashboard Border System
 * Adapted from Soft UI Dashboard React for Next.js/TypeScript
 */

export const softUIBorders = {
  borderColor: "#dee2e6",
  borderWidth: {
    0: "0",
    1: "0.0625rem",
    2: "0.125rem",
    3: "0.1875rem",
    4: "0.25rem",
    5: "0.3125rem",
  },
  borderRadius: {
    none: "0",
    xs: "0.125rem",
    sm: "0.25rem",
    md: "0.375rem",
    lg: "0.5rem",
    xl: "0.75rem",
    xxl: "1rem",
    section: "10rem",
    full: "50%",
  },
} as const

export type SoftUIBorderWidthKey = keyof typeof softUIBorders.borderWidth
export type SoftUIBorderRadiusKey = keyof typeof softUIBorders.borderRadius

// Helper function to get border radius value
export function getBorderRadius(radiusKey: SoftUIBorderRadiusKey): string {
  return softUIBorders.borderRadius[radiusKey]
}

// Helper function to get border width value
export function getBorderWidth(widthKey: SoftUIBorderWidthKey): string {
  return softUIBorders.borderWidth[widthKey]
}

