"use client"

import React, { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface EnhancedContentCardProps {
  children: ReactNode
  title?: string
  subtitle?: string
  icon?: ReactNode
  action?: ReactNode
  variant?: "default" | "glass" | "gradient" | "elevated"
  className?: string
  id?: string
}

export function EnhancedContentCard({
  children,
  title,
  subtitle,
  icon,
  action,
  variant = "default",
  className,
  id
}: EnhancedContentCardProps) {
  const variantClasses = {
    default: "bg-white/90 backdrop-blur-xl border border-gray-200/60 shadow-lg",
    glass: "bg-white/60 backdrop-blur-2xl border border-gray-200/40 shadow-xl",
    gradient: "bg-gradient-to-br from-white/95 to-gray-50/95 border border-gray-200/60 shadow-lg",
    elevated: "bg-white shadow-2xl border border-gray-100"
  }

  return (
    <div
      id={id}
      className={cn(
        "rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative overflow-hidden",
        variantClasses[variant],
        className
      )}
    >
      {/* Header */}
      {(title || subtitle || icon || action) && (
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <div className="text-white">
                  {icon}
                </div>
              </div>
            )}
            <div>
              {title && (
                <h3 className="text-xl font-bold text-gray-900 mb-1">{title}</h3>
              )}
              {subtitle && (
                <p className="text-gray-600 text-sm">{subtitle}</p>
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
      <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
        <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full transform translate-x-16 -translate-y-16" />
      </div>
    </div>
  )
}

interface WelcomeCardProps {
  userName: string
  userRole: string
  className?: string
}

export function WelcomeCard({ userName, userRole, className }: WelcomeCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl p-8 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white shadow-2xl relative overflow-hidden",
        className
      )}
    >
      {/* Animated background elements */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-16 -translate-x-16" />
      <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-white/5 rounded-full -translate-x-12 -translate-y-12 animate-pulse" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">
              Welcome back, {userName}!
            </h2>
            <p className="text-indigo-100 text-lg mb-4">
              Ready to explore amazing events and connect with fellow attendees?
            </p>
            <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 backdrop-blur-sm">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-sm font-medium capitalize">{userRole} Dashboard</span>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <span className="text-4xl">✨</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface EmptyStateCardProps {
  icon: ReactNode
  title: string
  description: string
  action?: ReactNode
  className?: string
}

export function EmptyStateCard({
  icon,
  title,
  description,
  action,
  className
}: EmptyStateCardProps) {
  return (
    <div className={cn("text-center py-12", className)}>
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <div className="text-gray-400">
          {icon}
        </div>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4 max-w-sm mx-auto">{description}</p>
      {action && (
        <div className="flex justify-center">
          {action}
        </div>
      )}
    </div>
  )
}

interface QuickActionCardProps {
  title: string
  description: string
  actions: Array<{
    label: string
    icon: ReactNode
    href: string
    variant?: "primary" | "secondary" | "outline"
  }>
  className?: string
}

export function QuickActionCard({
  title,
  description,
  actions,
  className
}: QuickActionCardProps) {
  return (
    <EnhancedContentCard
      title={title}
      subtitle={description}
      icon={<span className="text-lg">⚡</span>}
      className={className}
    >
      <div className="space-y-3">
        {actions.map((action, index) => (
          <a
            key={index}
            href={action.href}
            className={cn(
              "flex items-center gap-3 p-3 rounded-xl transition-all duration-200 hover:shadow-md",
              action.variant === "primary" && "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-indigo-500/25",
              action.variant === "secondary" && "bg-gradient-to-r from-pink-500 to-rose-600 text-white hover:shadow-pink-500/25",
              (!action.variant || action.variant === "outline") && "border border-gray-200 hover:bg-gray-50 text-gray-700"
            )}
          >
            <div className="flex-shrink-0">
              {action.icon}
            </div>
            <span className="font-medium">{action.label}</span>
          </a>
        ))}
      </div>
    </EnhancedContentCard>
  )
}
