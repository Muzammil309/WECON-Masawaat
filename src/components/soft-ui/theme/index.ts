/**
 * Soft UI Dashboard Theme System
 * Main theme export file
 */

export * from './colors'
export * from './shadows'
export * from './borders'
export * from './typography'

import { softUIColors, createGradient, getColor } from './colors'
import { softUIShadows, getShadow } from './shadows'
import { softUIBorders, getBorderRadius, getBorderWidth } from './borders'
import { softUITypography, getFontSize } from './typography'

// Complete theme object
export const softUITheme = {
  colors: softUIColors,
  shadows: softUIShadows,
  borders: softUIBorders,
  typography: softUITypography,
  
  // Helper functions
  helpers: {
    createGradient,
    getColor,
    getShadow,
    getBorderRadius,
    getBorderWidth,
    getFontSize,
  },
} as const

export default softUITheme

