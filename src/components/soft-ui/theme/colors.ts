/**
 * Soft UI Dashboard Color System
 * Adapted from Soft UI Dashboard React for Next.js/TypeScript
 */

export const softUIColors = {
  background: {
    default: "#f8f9fa",
  },

  text: {
    main: "#67748e",
    focus: "#67748e",
  },

  transparent: {
    main: "transparent",
  },

  white: {
    main: "#ffffff",
    focus: "#ffffff",
  },

  black: {
    light: "#141414",
    main: "#000000",
    focus: "#000000",
  },

  primary: {
    main: "#cb0c9f",
    focus: "#ad0a87",
  },

  secondary: {
    main: "#8392ab",
    focus: "#96a2b8",
  },

  info: {
    main: "#17c1e8",
    focus: "#3acaeb",
  },

  success: {
    main: "#82d616",
    focus: "#95dc39",
  },

  warning: {
    main: "#fbcf33",
    focus: "#fcd652",
  },

  error: {
    main: "#ea0606",
    focus: "#c70505",
  },

  light: {
    main: "#e9ecef",
    focus: "#e9ecef",
  },

  dark: {
    main: "#344767",
    focus: "#344767",
  },

  grey: {
    100: "#f8f9fa",
    200: "#e9ecef",
    300: "#dee2e6",
    400: "#ced4da",
    500: "#adb5bd",
    600: "#6c757d",
    700: "#495057",
    800: "#343a40",
    900: "#212529",
  },

  gradients: {
    primary: {
      main: "#7928ca",
      state: "#ff0080",
      angle: 310,
    },

    secondary: {
      main: "#627594",
      state: "#a8b8d8",
      angle: 310,
    },

    info: {
      main: "#2152ff",
      state: "#21d4fd",
      angle: 310,
    },

    success: {
      main: "#17ad37",
      state: "#98ec2d",
      angle: 310,
    },

    warning: {
      main: "#f53939",
      state: "#fbcf33",
      angle: 310,
    },

    error: {
      main: "#ea0606",
      state: "#ff667c",
      angle: 310,
    },

    light: {
      main: "#ced4da",
      state: "#ebeff4",
      angle: 310,
    },

    dark: {
      main: "#141727",
      state: "#3a416f",
      angle: 310,
    },
  },

  badgeColors: {
    primary: {
      background: "#f883dd",
      text: "#a3017e",
    },

    secondary: {
      background: "#e4e8ed",
      text: "#5974a2",
    },

    info: {
      background: "#abe9f7",
      text: "#08a1c4",
    },

    success: {
      background: "#cdf59b",
      text: "#67b108",
    },

    warning: {
      background: "#fef5d3",
      text: "#fbc400",
    },

    error: {
      background: "#fc9797",
      text: "#bd0000",
    },

    light: {
      background: "#ffffff",
      text: "#c7d3de",
    },

    dark: {
      background: "#8097bf",
      text: "#1e2e4a",
    },
  },
} as const

export type SoftUIColorKey = keyof typeof softUIColors
export type SoftUIGradientKey = keyof typeof softUIColors.gradients
export type SoftUIBadgeColorKey = keyof typeof softUIColors.badgeColors

// Helper function to create gradient CSS
export function createGradient(gradientKey: SoftUIGradientKey): string {
  const gradient = softUIColors.gradients[gradientKey]
  return `linear-gradient(${gradient.angle}deg, ${gradient.main}, ${gradient.state})`
}

// Helper function to get color value
export function getColor(colorKey: string, variant: 'main' | 'focus' = 'main'): string {
  const keys = colorKey.split('.')
  let value: any = softUIColors
  
  for (const key of keys) {
    value = value?.[key]
  }
  
  if (typeof value === 'object' && value !== null) {
    return value[variant] || value.main || '#000000'
  }
  
  return value || '#000000'
}

