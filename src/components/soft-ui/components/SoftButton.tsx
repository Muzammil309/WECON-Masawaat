"use client"

import React, { forwardRef, ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { softUITheme, SoftUIGradientKey } from '../theme'

export type SoftButtonColor = 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error' | 'light' | 'dark' | 'white'
export type SoftButtonVariant = 'text' | 'contained' | 'outlined' | 'gradient'
export type SoftButtonSize = 'small' | 'medium' | 'large'

export interface SoftButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  color?: SoftButtonColor
  variant?: SoftButtonVariant
  size?: SoftButtonSize
  circular?: boolean
  iconOnly?: boolean
  fullWidth?: boolean
  gradient?: SoftUIGradientKey
}

export const SoftButton = forwardRef<HTMLButtonElement, SoftButtonProps>(
  (
    {
      color = 'primary',
      variant = 'contained',
      size = 'medium',
      circular = false,
      iconOnly = false,
      fullWidth = false,
      gradient,
      className,
      children,
      style,
      ...rest
    },
    ref
  ) => {
    // Size classes
    const sizeClasses = {
      small: 'px-3 py-1.5 text-xs',
      medium: 'px-4 py-2 text-sm',
      large: 'px-6 py-3 text-base',
    }

    // Icon only size classes
    const iconOnlySizeClasses = {
      small: 'w-8 h-8 p-0',
      medium: 'w-10 h-10 p-0',
      large: 'w-12 h-12 p-0',
    }

    // Base classes
    const baseClasses = cn(
      'inline-flex items-center justify-center font-bold transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      circular ? 'rounded-full' : 'rounded-lg',
      fullWidth && 'w-full',
      iconOnly ? iconOnlySizeClasses[size] : sizeClasses[size]
    )

    // Variant and color specific styles
    const getVariantClasses = () => {
      if (variant === 'gradient') {
        return cn(
          'text-white shadow-md hover:shadow-lg',
          'focus:ring-offset-2',
          color === 'primary' && 'focus:ring-purple-500',
          color === 'info' && 'focus:ring-blue-500',
          color === 'success' && 'focus:ring-green-500',
          color === 'warning' && 'focus:ring-yellow-500',
          color === 'error' && 'focus:ring-red-500'
        )
      }

      if (variant === 'contained') {
        const colorMap = {
          primary: 'bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500',
          secondary: 'bg-gray-500 text-white hover:bg-gray-600 focus:ring-gray-500',
          info: 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500',
          success: 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-500',
          warning: 'bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-500',
          error: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
          light: 'bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-400',
          dark: 'bg-gray-800 text-white hover:bg-gray-900 focus:ring-gray-700',
          white: 'bg-white text-gray-800 hover:bg-gray-50 focus:ring-gray-400 shadow-md',
        }
        return cn('shadow-sm hover:shadow-md', colorMap[color])
      }

      if (variant === 'outlined') {
        const colorMap = {
          primary: 'border-2 border-purple-600 text-purple-600 hover:bg-purple-50 focus:ring-purple-500',
          secondary: 'border-2 border-gray-500 text-gray-500 hover:bg-gray-50 focus:ring-gray-500',
          info: 'border-2 border-blue-500 text-blue-500 hover:bg-blue-50 focus:ring-blue-500',
          success: 'border-2 border-green-500 text-green-500 hover:bg-green-50 focus:ring-green-500',
          warning: 'border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-50 focus:ring-yellow-500',
          error: 'border-2 border-red-500 text-red-500 hover:bg-red-50 focus:ring-red-500',
          light: 'border-2 border-gray-300 text-gray-600 hover:bg-gray-50 focus:ring-gray-400',
          dark: 'border-2 border-gray-800 text-gray-800 hover:bg-gray-50 focus:ring-gray-700',
          white: 'border-2 border-white text-white hover:bg-white/10 focus:ring-white',
        }
        return colorMap[color]
      }

      if (variant === 'text') {
        const colorMap = {
          primary: 'text-purple-600 hover:bg-purple-50 focus:ring-purple-500',
          secondary: 'text-gray-500 hover:bg-gray-50 focus:ring-gray-500',
          info: 'text-blue-500 hover:bg-blue-50 focus:ring-blue-500',
          success: 'text-green-500 hover:bg-green-50 focus:ring-green-500',
          warning: 'text-yellow-500 hover:bg-yellow-50 focus:ring-yellow-500',
          error: 'text-red-500 hover:bg-red-50 focus:ring-red-500',
          light: 'text-gray-600 hover:bg-gray-50 focus:ring-gray-400',
          dark: 'text-gray-800 hover:bg-gray-50 focus:ring-gray-700',
          white: 'text-white hover:bg-white/10 focus:ring-white',
        }
        return colorMap[color]
      }

      return ''
    }

    // Build inline styles for gradient
    const inlineStyles: React.CSSProperties = { ...style }
    if (variant === 'gradient') {
      const gradientKey = (gradient || color) as SoftUIGradientKey
      if (softUITheme.colors.gradients[gradientKey]) {
        inlineStyles.background = softUITheme.helpers.createGradient(gradientKey)
      }
    }

    return (
      <button
        ref={ref}
        className={cn(baseClasses, getVariantClasses(), className)}
        style={inlineStyles}
        {...rest}
      >
        {children}
      </button>
    )
  }
)

SoftButton.displayName = 'SoftButton'

export default SoftButton

