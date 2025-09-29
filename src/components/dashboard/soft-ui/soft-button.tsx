"use client"

import React, { ReactNode, ButtonHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

interface SoftButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: "gradient" | "outlined" | "text" | "contained"
  color?: "primary" | "secondary" | "success" | "warning" | "error" | "info"
  size?: "sm" | "md" | "lg"
  fullWidth?: boolean
  className?: string
  asChild?: boolean
}

export function SoftButton({
  children,
  variant = "contained",
  color = "primary",
  size = "md",
  fullWidth = false,
  className,
  disabled,
  asChild = false,
  ...props
}: SoftButtonProps) {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
  
  const sizeClasses = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  }

  const colorClasses = {
    primary: {
      gradient: "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 focus:ring-blue-500",
      contained: "bg-blue-600 text-white shadow-lg shadow-blue-500/25 hover:bg-blue-700 hover:shadow-xl focus:ring-blue-500",
      outlined: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500",
      text: "text-blue-600 hover:bg-blue-50 focus:ring-blue-500",
    },
    secondary: {
      gradient: "bg-gradient-to-r from-slate-500 to-slate-600 text-white shadow-lg shadow-slate-500/25 hover:shadow-xl hover:shadow-slate-500/30 focus:ring-slate-500",
      contained: "bg-slate-600 text-white shadow-lg shadow-slate-500/25 hover:bg-slate-700 hover:shadow-xl focus:ring-slate-500",
      outlined: "border-2 border-slate-600 text-slate-600 hover:bg-slate-50 focus:ring-slate-500",
      text: "text-slate-600 hover:bg-slate-50 focus:ring-slate-500",
    },
    success: {
      gradient: "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 focus:ring-emerald-500",
      contained: "bg-emerald-600 text-white shadow-lg shadow-emerald-500/25 hover:bg-emerald-700 hover:shadow-xl focus:ring-emerald-500",
      outlined: "border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 focus:ring-emerald-500",
      text: "text-emerald-600 hover:bg-emerald-50 focus:ring-emerald-500",
    },
    warning: {
      gradient: "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 focus:ring-orange-500",
      contained: "bg-orange-600 text-white shadow-lg shadow-orange-500/25 hover:bg-orange-700 hover:shadow-xl focus:ring-orange-500",
      outlined: "border-2 border-orange-600 text-orange-600 hover:bg-orange-50 focus:ring-orange-500",
      text: "text-orange-600 hover:bg-orange-50 focus:ring-orange-500",
    },
    error: {
      gradient: "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30 focus:ring-red-500",
      contained: "bg-red-600 text-white shadow-lg shadow-red-500/25 hover:bg-red-700 hover:shadow-xl focus:ring-red-500",
      outlined: "border-2 border-red-600 text-red-600 hover:bg-red-50 focus:ring-red-500",
      text: "text-red-600 hover:bg-red-50 focus:ring-red-500",
    },
    info: {
      gradient: "bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/30 focus:ring-cyan-500",
      contained: "bg-cyan-600 text-white shadow-lg shadow-cyan-500/25 hover:bg-cyan-700 hover:shadow-xl focus:ring-cyan-500",
      outlined: "border-2 border-cyan-600 text-cyan-600 hover:bg-cyan-50 focus:ring-cyan-500",
      text: "text-cyan-600 hover:bg-cyan-50 focus:ring-cyan-500",
    },
  }

  const disabledClasses = "opacity-50 cursor-not-allowed hover:shadow-none hover:transform-none"

  const buttonClasses = cn(
    baseClasses,
    sizeClasses[size],
    colorClasses[color][variant],
    fullWidth && "w-full",
    disabled && disabledClasses,
    !disabled && "hover:-translate-y-0.5 active:translate-y-0",
    className
  )

  if (asChild) {
    // When asChild is true, we expect children to be a single React element
    // and we'll clone it with our button classes
    const child = children as React.ReactElement
    return React.cloneElement(child, {
      className: cn(buttonClasses, (child.props as any)?.className),
      ...(props as any)
    })
  }

  return (
    <button
      className={buttonClasses}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
