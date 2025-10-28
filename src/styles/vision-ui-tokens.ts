/**
 * Vision UI Dashboard Design Tokens
 * Extracted from Figma: Vision UI Dashboard React - MUI Dashboard (Free Version)
 * Node ID: 580-3777
 */

export const visionUITokens = {
  colors: {
    // Primary Brand Colors
    primary: {
      500: '#4318FF', // Primary Purple Blue
      400: '#7551FF', // Secondary Purple Blue
    },
    
    // Status Colors
    success: '#01B574', // Green 500
    error: '#E31A1A', // Red 500
    
    // Gray Scale
    gray: {
      300: '#CBD5E0',
      400: '#A0AEC0',
      500: '#718096',
      700: '#2D3748',
    },
    
    // Accent Colors
    blue: {
      400: '#4299E1',
      500: '#0075FF', // Used for icons and accents
    },
    teal: {
      300: '#4FD1C5',
    },
    orange: {
      300: '#F6AD55',
    },
    
    // Base Colors
    white: '#FFFFFF',
    
    // Background Colors
    background: {
      dark: '#0F1535', // Input backgrounds, main dark bg
      card: '#1A1F37', // Card backgrounds (used with backdrop-blur)
      cardGlass: 'rgba(26, 31, 55, 0.7)', // Card with transparency for glassmorphism
    },
    
    // Border Colors
    border: {
      light: 'rgba(226, 232, 240, 0.3)', // Light border for inputs
    },
  },
  
  typography: {
    fontFamily: {
      primary: '"Plus Jakarta Display", sans-serif',
      fallback: 'system-ui, -apple-system, sans-serif',
    },
    fontWeight: {
      regular: 400,
      medium: 500,
      bold: 700,
    },
    fontSize: {
      xs: '10px',
      sm: '12px',
      base: '14px',
      lg: '18px',
    },
    lineHeight: {
      none: '1',
      tight: '1.4',
      normal: '1.5',
    },
    letterSpacing: {
      logo: '2.52px', // Used for "VISION UI FREE" logo
    },
  },
  
  spacing: {
    borderRadius: {
      card: '20px',
      button: '12px',
      input: '15px',
      icon: '12px',
    },
    blur: {
      card: '60px', // backdrop-blur for glassmorphism effect
      button: '5px',
    },
    shadows: {
      card: '0px 3.5px 5.5px 0px rgba(0, 0, 0, 0.02)',
    },
  },
  
  layout: {
    sidebar: {
      width: '264px',
      padding: '10px',
    },
    card: {
      analytics: {
        width: '382px',
        height: '80px',
      },
      icon: {
        size: '45px',
      },
    },
  },
} as const

// Type exports for TypeScript
export type VisionUIColors = typeof visionUITokens.colors
export type VisionUITypography = typeof visionUITokens.typography
export type VisionUISpacing = typeof visionUITokens.spacing
export type VisionUILayout = typeof visionUITokens.layout

