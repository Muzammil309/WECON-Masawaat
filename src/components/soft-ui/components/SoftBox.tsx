"use client"

import React, { forwardRef, CSSProperties } from 'react'
import { cn } from '@/lib/utils'
import { softUITheme, SoftUIGradientKey, SoftUIBorderRadiusKey, SoftUIShadowKey } from '../theme'

export interface SoftBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'contained' | 'gradient'
  bgColor?: string
  color?: string
  opacity?: number
  borderRadius?: SoftUIBorderRadiusKey
  shadow?: SoftUIShadowKey | 'none'
  gradient?: SoftUIGradientKey
  p?: number
  px?: number
  py?: number
  pt?: number
  pb?: number
  pl?: number
  pr?: number
  m?: number
  mx?: number
  my?: number
  mt?: number
  mb?: number
  ml?: number
  mr?: number
  display?: CSSProperties['display']
  justifyContent?: CSSProperties['justifyContent']
  alignItems?: CSSProperties['alignItems']
  flexDirection?: CSSProperties['flexDirection']
  width?: CSSProperties['width']
  height?: CSSProperties['height']
  position?: CSSProperties['position']
  top?: CSSProperties['top']
  right?: CSSProperties['right']
  bottom?: CSSProperties['bottom']
  left?: CSSProperties['left']
  zIndex?: CSSProperties['zIndex']
  lineHeight?: CSSProperties['lineHeight']
}

export const SoftBox = forwardRef<HTMLDivElement, SoftBoxProps>(
  (
    {
      variant = 'contained',
      bgColor,
      color,
      opacity = 1,
      borderRadius = 'none',
      shadow = 'none',
      gradient,
      p,
      px,
      py,
      pt,
      pb,
      pl,
      pr,
      m,
      mx,
      my,
      mt,
      mb,
      ml,
      mr,
      display,
      justifyContent,
      alignItems,
      flexDirection,
      width,
      height,
      position,
      top,
      right,
      bottom,
      left,
      zIndex,
      lineHeight,
      className,
      style,
      children,
      ...rest
    },
    ref
  ) => {
    // Helper function to convert spacing to rem
    const toRem = (value: number) => `${value * 0.125}rem`

    // Build inline styles
    const inlineStyles: CSSProperties = {
      ...style,
      opacity,
      display,
      justifyContent,
      alignItems,
      flexDirection,
      width,
      height,
      position,
      top,
      right,
      bottom,
      left,
      zIndex,
      lineHeight,
    }

    // Handle padding
    if (p !== undefined) {
      inlineStyles.padding = toRem(p)
    }
    if (px !== undefined) {
      inlineStyles.paddingLeft = toRem(px)
      inlineStyles.paddingRight = toRem(px)
    }
    if (py !== undefined) {
      inlineStyles.paddingTop = toRem(py)
      inlineStyles.paddingBottom = toRem(py)
    }
    if (pt !== undefined) inlineStyles.paddingTop = toRem(pt)
    if (pb !== undefined) inlineStyles.paddingBottom = toRem(pb)
    if (pl !== undefined) inlineStyles.paddingLeft = toRem(pl)
    if (pr !== undefined) inlineStyles.paddingRight = toRem(pr)

    // Handle margin
    if (m !== undefined) {
      inlineStyles.margin = toRem(m)
    }
    if (mx !== undefined) {
      inlineStyles.marginLeft = toRem(mx)
      inlineStyles.marginRight = toRem(mx)
    }
    if (my !== undefined) {
      inlineStyles.marginTop = toRem(my)
      inlineStyles.marginBottom = toRem(my)
    }
    if (mt !== undefined) inlineStyles.marginTop = toRem(mt)
    if (mb !== undefined) inlineStyles.marginBottom = toRem(mb)
    if (ml !== undefined) inlineStyles.marginLeft = toRem(ml)
    if (mr !== undefined) inlineStyles.marginRight = toRem(mr)

    // Handle background color and gradient
    if (variant === 'gradient' && gradient) {
      inlineStyles.background = softUITheme.helpers.createGradient(gradient)
    } else if (bgColor) {
      inlineStyles.backgroundColor = softUITheme.helpers.getColor(bgColor)
    }

    // Handle text color
    if (color) {
      inlineStyles.color = softUITheme.helpers.getColor(color)
    }

    // Handle border radius
    if (borderRadius !== 'none') {
      inlineStyles.borderRadius = softUITheme.helpers.getBorderRadius(borderRadius)
    }

    // Handle shadow
    if (shadow !== 'none') {
      inlineStyles.boxShadow = softUITheme.helpers.getShadow(shadow)
    }

    return (
      <div
        ref={ref}
        className={cn('soft-box', className)}
        style={inlineStyles}
        {...rest}
      >
        {children}
      </div>
    )
  }
)

SoftBox.displayName = 'SoftBox'

export default SoftBox

