"use client"

import React, { ReactNode } from "react"
import { cn } from "@/lib/utils"

// Professional Dark Theme Color System
export const professionalDarkTheme = {
  background: {
    primary: "#0f0f23", // Deep dark blue
    secondary: "#1a1a2e", // Dark blue-gray
    tertiary: "#16213e", // Medium dark blue
    surface: "#1e1e2e", // Card background
    elevated: "#252545", // Elevated surfaces
  },
  text: {
    primary: "#ffffff", // Pure white
    secondary: "#e2e8f0", // Light gray
    muted: "#94a3b8", // Medium gray
    accent: "#60a5fa", // Blue accent
  },
  border: {
    primary: "rgba(148, 163, 184, 0.1)", // Subtle borders
    secondary: "rgba(148, 163, 184, 0.2)", // Medium borders
    accent: "rgba(96, 165, 250, 0.3)", // Accent borders
  },
  gradients: {
    primary: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    secondary: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    success: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    warning: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    danger: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    info: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    dark: "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)",
    purple: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    blue: "linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)",
    green: "linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)",
    orange: "linear-gradient(135deg, #FF9800 0%, #FFC107 100%)",
  },
  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    glow: "0 0 20px rgba(96, 165, 250, 0.3)",
  }
}

// Professional Dark Theme Provider
interface ProfessionalDarkThemeProviderProps {
  children: ReactNode
  className?: string
}

export function ProfessionalDarkThemeProvider({ children, className }: ProfessionalDarkThemeProviderProps) {
  return (
    <div
      className={cn(
        "min-h-screen text-white",
        className
      )}
      style={{
        background: `linear-gradient(135deg, ${professionalDarkTheme.background.primary} 0%, ${professionalDarkTheme.background.secondary} 50%, ${professionalDarkTheme.background.tertiary} 100%)`,
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Subtle animated background pattern */}
      <div className="fixed inset-0 opacity-30 pointer-events-none z-0">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 20% 80%, rgba(96, 165, 250, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(59, 130, 246, 0.05) 0%, transparent 50%)
          `
        }} />
      </div>
      <div className="relative z-10 min-h-screen">
        {children}
      </div>
    </div>
  )
}

// Professional Statistics Card
interface ProfessionalStatCardProps {
  title: string
  value: string | number
  change?: {
    value: string
    type: "increase" | "decrease" | "neutral"
  }
  icon: ReactNode
  gradient?: keyof typeof professionalDarkTheme.gradients
  className?: string
}

export function ProfessionalStatCard({
  title,
  value,
  change,
  icon,
  gradient = "primary",
  className
}: ProfessionalStatCardProps) {
  const changeColors = {
    increase: "text-emerald-400",
    decrease: "text-red-400",
    neutral: "text-slate-400",
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl p-6 backdrop-blur-xl border transition-all duration-300 hover:scale-105 hover:shadow-2xl",
        "bg-white/5 border-white/10 shadow-xl",
        className
      )}
    >
      {/* Background gradient overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{ background: professionalDarkTheme.gradients[gradient] }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg"
            style={{ background: professionalDarkTheme.gradients[gradient] }}
          >
            {icon}
          </div>
          {change && (
            <span className={cn("text-sm font-semibold", changeColors[change.type])}>
              {change.value}
            </span>
          )}
        </div>
        
        <div>
          <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
          <p className="text-white text-2xl font-bold">{value}</p>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-20 h-20 opacity-10">
        <div 
          className="w-full h-full rounded-full transform translate-x-10 -translate-y-10"
          style={{ background: professionalDarkTheme.gradients[gradient] }}
        />
      </div>
    </div>
  )
}

// Professional Content Card
interface ProfessionalContentCardProps {
  children: ReactNode
  title?: string
  subtitle?: string
  icon?: ReactNode
  action?: ReactNode
  className?: string
  gradient?: boolean
  gradientType?: keyof typeof professionalDarkTheme.gradients
}

export function ProfessionalContentCard({
  children,
  title,
  subtitle,
  icon,
  action,
  className,
  gradient = false,
  gradientType = "primary"
}: ProfessionalContentCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl p-6 backdrop-blur-xl border transition-all duration-300 hover:shadow-2xl",
        gradient 
          ? "bg-gradient-to-br from-white/10 to-white/5 border-white/20" 
          : "bg-white/5 border-white/10",
        className
      )}
    >
      {/* Header */}
      {(title || subtitle || icon || action) && (
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            {icon && (
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg"
                style={{ background: professionalDarkTheme.gradients[gradientType] }}
              >
                {icon}
              </div>
            )}
            <div>
              {title && (
                <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
              )}
              {subtitle && (
                <p className="text-slate-400 text-sm">{subtitle}</p>
              )}
            </div>
          </div>
          {action && (
            <div className="flex-shrink-0">
              {action}
            </div>
          )}
        </div>
      )}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Background decoration */}
      {gradient && (
        <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
          <div 
            className="w-full h-full rounded-full transform translate-x-16 -translate-y-16"
            style={{ background: professionalDarkTheme.gradients[gradientType] }}
          />
        </div>
      )}
    </div>
  )
}

// Professional Button
interface ProfessionalButtonProps {
  children: ReactNode
  variant?: "gradient" | "outline" | "ghost"
  gradient?: keyof typeof professionalDarkTheme.gradients
  size?: "sm" | "md" | "lg"
  fullWidth?: boolean
  className?: string
  onClick?: () => void
  disabled?: boolean
  href?: string
}

export function ProfessionalButton({
  children,
  variant = "gradient",
  gradient = "primary",
  size = "md",
  fullWidth = false,
  className,
  onClick,
  disabled = false,
  href,
  ...props
}: ProfessionalButtonProps) {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent"
  
  const sizeClasses = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  }

  const variantClasses = {
    gradient: "text-white shadow-lg hover:shadow-xl focus:ring-blue-500/50",
    outline: "border border-white/20 text-white hover:bg-white/10 focus:ring-white/50",
    ghost: "text-white hover:bg-white/10 focus:ring-white/50",
  }

  const gradientStyle = variant === "gradient" ? { background: professionalDarkTheme.gradients[gradient] } : {}
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

  const Component = href ? "a" : "button"

  return (
    <Component
      className={buttonClasses}
      style={gradientStyle}
      onClick={onClick}
      disabled={disabled}
      href={href}
      {...props}
    >
      {children}
    </Component>
  )
}
