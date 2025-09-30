"use client"

import React, { forwardRef, HTMLAttributes, ElementType } from 'react'
import { cn } from '@/lib/utils'
import { softUITheme, SoftUITypographyVariant, SoftUIFontSize } from '../theme'

export interface SoftTypographyProps extends HTMLAttributes<HTMLElement> {
  variant?: SoftUITypographyVariant
  color?: string
  fontWeight?: 'light' | 'regular' | 'medium' | 'bold'
  textTransform?: 'none' | 'capitalize' | 'uppercase' | 'lowercase'
  verticalAlign?: 'baseline' | 'sub' | 'super' | 'text-top' | 'text-bottom' | 'middle' | 'top' | 'bottom'
  textGradient?: boolean
  opacity?: number
  fontSize?: SoftUIFontSize
  component?: ElementType
}

export const SoftTypography = forwardRef<HTMLElement, SoftTypographyProps>(
  (
    {
      variant = 'body1',
      color,
      fontWeight,
      textTransform = 'none',
      verticalAlign,
      textGradient = false,
      opacity = 1,
      fontSize,
      component,
      className,
      style,
      children,
      ...rest
    },
    ref
  ) => {
    // Determine the HTML element to use
    const variantComponentMap: Record<SoftUITypographyVariant, ElementType> = {
      h1: 'h1',
      h2: 'h2',
      h3: 'h3',
      h4: 'h4',
      h5: 'h5',
      h6: 'h6',
      subtitle1: 'h6',
      subtitle2: 'h6',
      body1: 'p',
      body2: 'p',
      button: 'span',
      caption: 'span',
      overline: 'span',
    }

    const Component = component || variantComponentMap[variant]

    // Get typography styles from theme
    const variantStyles = softUITheme.typography[variant]

    // Font weight mapping
    const fontWeightMap = {
      light: softUITheme.typography.fontWeightLight,
      regular: softUITheme.typography.fontWeightRegular,
      medium: softUITheme.typography.fontWeightMedium,
      bold: softUITheme.typography.fontWeightBold,
    }

    // Build inline styles
    const inlineStyles: React.CSSProperties = {
      ...style,
      fontSize: fontSize ? softUITheme.helpers.getFontSize(fontSize) : variantStyles.fontSize,
      lineHeight: variantStyles.lineHeight,
      fontWeight: fontWeight ? fontWeightMap[fontWeight] : variantStyles.fontWeight,
      textTransform: textTransform as any,
      verticalAlign,
      opacity,
    }

    // Handle color
    if (color) {
      if (textGradient) {
        // For gradient text, we need to use background-clip
        // Check if color is a valid gradient key
        const validGradients = ['primary', 'secondary', 'info', 'success', 'warning', 'error', 'light', 'dark'] as const
        type GradientKey = typeof validGradients[number]

        if (validGradients.includes(color as GradientKey)) {
          inlineStyles.background = softUITheme.helpers.createGradient(color as GradientKey)
          inlineStyles.WebkitBackgroundClip = 'text'
          inlineStyles.WebkitTextFillColor = 'transparent'
          inlineStyles.backgroundClip = 'text'
        }
      } else {
        inlineStyles.color = softUITheme.helpers.getColor(color)
      }
    }

    // Base classes
    const baseClasses = cn(
      'soft-typography',
      variant === 'button' && 'uppercase',
      className
    )

    return (
      <Component
        ref={ref as any}
        className={baseClasses}
        style={inlineStyles}
        {...rest}
      >
        {children}
      </Component>
    )
  }
)

SoftTypography.displayName = 'SoftTypography'

export default SoftTypography

