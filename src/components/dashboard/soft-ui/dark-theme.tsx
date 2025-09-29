"use client"

import React, { ReactNode } from "react"
import { cn } from "@/lib/utils"

// Dark Theme Color Palette
export const darkTheme = {
  background: {
    primary: "rgb(17, 24, 39)", // gray-900
    secondary: "rgb(31, 41, 55)", // gray-800
    tertiary: "rgb(55, 65, 81)", // gray-700
    card: "rgba(31, 41, 55, 0.8)", // gray-800 with opacity
    glass: "rgba(17, 24, 39, 0.8)", // glass effect
  },
  text: {
    primary: "rgb(243, 244, 246)", // gray-100
    secondary: "rgb(209, 213, 219)", // gray-300
    muted: "rgb(156, 163, 175)", // gray-400
    accent: "rgb(99, 102, 241)", // indigo-500
  },
  border: {
    primary: "rgba(75, 85, 99, 0.3)", // gray-600 with opacity
    secondary: "rgba(107, 114, 128, 0.2)", // gray-500 with opacity
    accent: "rgba(99, 102, 241, 0.3)", // indigo-500 with opacity
  },
  gradients: {
    primary: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    secondary: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    success: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    warning: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    danger: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    info: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    dark: "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)",
  }
}

interface DarkSoftCardProps {
  children: ReactNode
  className?: string
  variant?: "default" | "glass" | "gradient" | "elevated"
  gradient?: keyof typeof darkTheme.gradients
  id?: string
}

export function DarkSoftCard({ 
  children, 
  className, 
  variant = "default",
  gradient,
  id 
}: DarkSoftCardProps) {
  const baseClasses = "rounded-2xl p-6 transition-all duration-300"
  
  const variantClasses = {
    default: `bg-gray-800/80 border border-gray-700/30 backdrop-blur-xl`,
    glass: `bg-gray-900/60 border border-gray-600/20 backdrop-blur-2xl`,
    gradient: gradient ? "" : `bg-gradient-to-br from-gray-800/90 to-gray-900/90 border border-gray-600/30`,
    elevated: `bg-gray-800/90 border border-gray-600/40 shadow-2xl shadow-black/20`
  }

  const gradientStyle = gradient ? { background: darkTheme.gradients[gradient] } : {}

  return (
    <div
      id={id}
      className={cn(
        baseClasses,
        variantClasses[variant],
        "hover:shadow-2xl hover:shadow-black/30 hover:-translate-y-1",
        "hover:border-gray-600/50",
        className
      )}
      style={gradientStyle}
    >
      {children}
    </div>
  )
}

interface DarkSoftStatCardProps {
  title: string
  value: string | number
  change?: {
    value: string
    type: "increase" | "decrease" | "neutral"
  }
  icon: ReactNode
  iconGradient?: keyof typeof darkTheme.gradients
  className?: string
}

export function DarkSoftStatCard({
  title,
  value,
  change,
  icon,
  iconGradient = "primary",
  className
}: DarkSoftStatCardProps) {
  const changeColorClasses = {
    increase: "text-emerald-400",
    decrease: "text-red-400",
    neutral: "text-gray-400",
  }

  return (
    <DarkSoftCard variant="glass" className={cn("relative overflow-hidden", className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-300 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-100 mb-2">{value}</p>
          {change && (
            <p className={cn("text-sm font-medium", changeColorClasses[change.type])}>
              {change.value}
            </p>
          )}
        </div>
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg text-white"
          style={{ background: darkTheme.gradients[iconGradient] }}
        >
          {icon}
        </div>
      </div>
      
      {/* Subtle background pattern */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
        <div className="w-full h-full bg-gradient-to-br from-white to-transparent rounded-full transform translate-x-16 -translate-y-16" />
      </div>
    </DarkSoftCard>
  )
}

interface DarkSoftGradientCardProps {
  children: ReactNode
  gradient: keyof typeof darkTheme.gradients
  className?: string
}

export function DarkSoftGradientCard({ children, gradient, className }: DarkSoftGradientCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl p-6 text-white shadow-2xl transition-all duration-300",
        "hover:shadow-2xl hover:-translate-y-1 relative overflow-hidden",
        className
      )}
      style={{ background: darkTheme.gradients[gradient] }}
    >
      {children}
      
      {/* Animated background elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12" />
    </div>
  )
}

interface DarkSoftButtonProps {
  children: ReactNode
  variant?: "gradient" | "outlined" | "text" | "glass"
  gradient?: keyof typeof darkTheme.gradients
  size?: "sm" | "md" | "lg"
  fullWidth?: boolean
  className?: string
  onClick?: () => void
  disabled?: boolean
  asChild?: boolean
}

export function DarkSoftButton({
  children,
  variant = "gradient",
  gradient = "primary",
  size = "md",
  fullWidth = false,
  className,
  onClick,
  disabled = false,
  asChild = false,
  ...props
}: DarkSoftButtonProps) {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900"
  
  const sizeClasses = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  }

  const variantClasses = {
    gradient: `text-white shadow-lg hover:shadow-xl focus:ring-indigo-500`,
    outlined: `border-2 border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-gray-500 focus:ring-gray-500`,
    text: `text-gray-300 hover:bg-gray-800 focus:ring-gray-500`,
    glass: `bg-gray-800/60 backdrop-blur-xl border border-gray-600/30 text-gray-100 hover:bg-gray-700/60 focus:ring-gray-500`,
  }

  const gradientStyle = variant === "gradient" ? { background: darkTheme.gradients[gradient] } : {}
  const disabledClasses = "opacity-50 cursor-not-allowed hover:shadow-none hover:transform-none"

  const buttonClasses = cn(
    baseClasses,
    sizeClasses[size],
    variantClasses[variant],
    fullWidth && "w-full",
    disabled && disabledClasses,
    !disabled && "hover:-translate-y-0.5 active:translate-y-0",
    className
  )

  if (asChild) {
    const child = children as React.ReactElement
    return React.cloneElement(child, {
      className: cn(buttonClasses, (child.props as any)?.className),
      style: { ...gradientStyle, ...(child.props as any)?.style },
      ...(props as any)
    })
  }

  return (
    <button
      className={buttonClasses}
      style={gradientStyle}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

// Dark theme layout wrapper
interface DarkThemeProviderProps {
  children: ReactNode
  className?: string
}

export function DarkThemeProvider({ children, className }: DarkThemeProviderProps) {
  return (
    <div 
      className={cn(
        "min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900",
        "text-gray-100",
        className
      )}
      style={{
        backgroundImage: `
          radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.05) 0%, transparent 50%)
        `
      }}
    >
      {children}
    </div>
  )
}
