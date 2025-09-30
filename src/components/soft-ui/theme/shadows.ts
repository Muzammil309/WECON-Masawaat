/**
 * Soft UI Dashboard Shadow System
 * Adapted from Soft UI Dashboard React for Next.js/TypeScript
 */

export const softUIShadows = {
  xs: "0 2px 9px -5px rgba(0, 0, 0, 0.15)",
  sm: "0 0.3125rem 0.625rem 0 rgba(0, 0, 0, 0.12)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  lg: "0 8px 26px -4px rgba(0, 0, 0, 0.15), 0 8px 9px -5px rgba(0, 0, 0, 0.06)",
  xl: "0 20px 27px 0 rgba(0, 0, 0, 0.05)",
  xxl: "0 20px 27px 0 rgba(0, 0, 0, 0.05)",
  inset: "inset 0 1px 2px rgba(0, 0, 0, 0.075)",
  colored: {
    primary: "0 4px 20px 0 rgba(0, 0, 0, 0.14), 0 7px 10px -5px rgba(233, 30, 99, 0.4)",
    secondary: "0 4px 20px 0 rgba(0, 0, 0, 0.14), 0 7px 10px -5px rgba(131, 146, 171, 0.4)",
    info: "0 4px 20px 0 rgba(0, 0, 0, 0.14), 0 7px 10px -5px rgba(23, 193, 232, 0.4)",
    success: "0 4px 20px 0 rgba(0, 0, 0, 0.14), 0 7px 10px -5px rgba(130, 214, 22, 0.4)",
    warning: "0 4px 20px 0 rgba(0, 0, 0, 0.14), 0 7px 10px -5px rgba(251, 207, 51, 0.4)",
    error: "0 4px 20px 0 rgba(0, 0, 0, 0.14), 0 7px 10px -5px rgba(234, 6, 6, 0.4)",
    light: "0 4px 20px 0 rgba(0, 0, 0, 0.14), 0 7px 10px -5px rgba(233, 236, 239, 0.4)",
    dark: "0 4px 20px 0 rgba(0, 0, 0, 0.14), 0 7px 10px -5px rgba(52, 71, 103, 0.4)",
  },
  navbarBoxShadow: "0 0.3125rem 0.625rem 0 rgba(0, 0, 0, 0.12)",
  sliderBoxShadow: {
    thumb: "0 1px 13px 0 rgba(0, 0, 0, 0.2)",
  },
  tabsBoxShadow: {
    indicator: "0 1px 5px 1px rgba(0, 0, 0, 0.2)",
  },
} as const

export type SoftUIShadowKey = keyof typeof softUIShadows
export type SoftUIColoredShadowKey = keyof typeof softUIShadows.colored

// Helper function to get shadow value
export function getShadow(shadowKey: SoftUIShadowKey | `colored.${SoftUIColoredShadowKey}`): string {
  if (shadowKey.startsWith('colored.')) {
    const colorKey = shadowKey.split('.')[1] as SoftUIColoredShadowKey
    return softUIShadows.colored[colorKey]
  }
  
  return softUIShadows[shadowKey as SoftUIShadowKey] as string
}

