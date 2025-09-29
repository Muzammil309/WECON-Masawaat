"use client"

import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface SoftCardProps {
  children: ReactNode
  className?: string
  gradient?: boolean
  shadow?: "sm" | "md" | "lg" | "xl"
  blur?: boolean
  id?: string
}

export function SoftCard({
  children,
  className,
  gradient = false,
  shadow = "md",
  blur = false,
  id
}: SoftCardProps) {
  return (
    <div
      id={id}
      className={cn(
        "rounded-2xl border border-white/20 bg-white/80 p-6 transition-all duration-300",
        gradient && "bg-gradient-to-br from-white/90 to-white/70",
        blur && "backdrop-blur-xl supports-[backdrop-filter]:bg-white/60",
        shadow === "sm" && "shadow-sm",
        shadow === "md" && "shadow-lg shadow-slate-200/50",
        shadow === "lg" && "shadow-xl shadow-slate-200/60",
        shadow === "xl" && "shadow-2xl shadow-slate-200/70",
        "hover:shadow-xl hover:shadow-slate-200/60 hover:-translate-y-1",
        className
      )}
    >
      {children}
    </div>
  )
}

interface SoftStatCardProps {
  title: string
  value: string | number
  change?: {
    value: string
    type: "increase" | "decrease" | "neutral"
  }
  icon: ReactNode
  iconColor?: "blue" | "purple" | "green" | "orange" | "red"
  className?: string
}

export function SoftStatCard({
  title,
  value,
  change,
  icon,
  iconColor = "blue",
  className
}: SoftStatCardProps) {
  const iconColorClasses = {
    blue: "bg-gradient-to-br from-blue-500 to-blue-600 text-white",
    purple: "bg-gradient-to-br from-purple-500 to-purple-600 text-white",
    green: "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white",
    orange: "bg-gradient-to-br from-orange-500 to-orange-600 text-white",
    red: "bg-gradient-to-br from-red-500 to-red-600 text-white",
  }

  const changeColorClasses = {
    increase: "text-emerald-600",
    decrease: "text-red-600",
    neutral: "text-slate-600",
  }

  return (
    <SoftCard className={cn("relative overflow-hidden", className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-slate-900 mb-2">{value}</p>
          {change && (
            <p className={cn("text-sm font-medium", changeColorClasses[change.type])}>
              {change.value}
            </p>
          )}
        </div>
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center shadow-lg",
          iconColorClasses[iconColor]
        )}>
          {icon}
        </div>
      </div>
    </SoftCard>
  )
}

interface SoftGradientCardProps {
  children: ReactNode
  gradient: "blue" | "purple" | "green" | "orange" | "pink"
  className?: string
}

export function SoftGradientCard({ children, gradient, className }: SoftGradientCardProps) {
  const gradientClasses = {
    blue: "bg-gradient-to-br from-blue-500 to-blue-600",
    purple: "bg-gradient-to-br from-purple-500 to-purple-600", 
    green: "bg-gradient-to-br from-emerald-500 to-emerald-600",
    orange: "bg-gradient-to-br from-orange-500 to-orange-600",
    pink: "bg-gradient-to-br from-pink-500 to-pink-600",
  }

  return (
    <div
      className={cn(
        "rounded-2xl p-6 text-white shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1",
        gradientClasses[gradient],
        className
      )}
    >
      {children}
    </div>
  )
}
