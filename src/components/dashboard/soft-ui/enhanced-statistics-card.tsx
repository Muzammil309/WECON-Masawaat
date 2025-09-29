"use client"

import React, { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface EnhancedStatisticsCardProps {
  title: string
  count: string | number
  percentage?: {
    value: string
    type: "increase" | "decrease" | "neutral"
  }
  icon: ReactNode
  bgColor?: "primary" | "secondary" | "success" | "warning" | "error" | "info" | "dark" | "white"
  direction?: "left" | "right"
  className?: string
}

const colorVariants = {
  primary: {
    bg: "bg-gradient-to-br from-indigo-500 to-purple-600",
    iconBg: "bg-white/20",
    text: "text-white",
    titleOpacity: "text-white/80"
  },
  secondary: {
    bg: "bg-gradient-to-br from-pink-500 to-rose-600",
    iconBg: "bg-white/20",
    text: "text-white",
    titleOpacity: "text-white/80"
  },
  success: {
    bg: "bg-gradient-to-br from-emerald-500 to-teal-600",
    iconBg: "bg-white/20",
    text: "text-white",
    titleOpacity: "text-white/80"
  },
  warning: {
    bg: "bg-gradient-to-br from-amber-500 to-orange-600",
    iconBg: "bg-white/20",
    text: "text-white",
    titleOpacity: "text-white/80"
  },
  error: {
    bg: "bg-gradient-to-br from-red-500 to-pink-600",
    iconBg: "bg-white/20",
    text: "text-white",
    titleOpacity: "text-white/80"
  },
  info: {
    bg: "bg-gradient-to-br from-cyan-500 to-blue-600",
    iconBg: "bg-white/20",
    text: "text-white",
    titleOpacity: "text-white/80"
  },
  dark: {
    bg: "bg-gradient-to-br from-gray-800 to-gray-900",
    iconBg: "bg-white/20",
    text: "text-white",
    titleOpacity: "text-white/80"
  },
  white: {
    bg: "bg-white/90 backdrop-blur-xl border border-gray-200/60",
    iconBg: "bg-gradient-to-br from-indigo-500 to-purple-600",
    text: "text-gray-900",
    titleOpacity: "text-gray-600"
  }
}

const percentageColors = {
  increase: "text-emerald-400",
  decrease: "text-red-400",
  neutral: "text-gray-400"
}

export function EnhancedStatisticsCard({
  title,
  count,
  percentage,
  icon,
  bgColor = "white",
  direction = "right",
  className
}: EnhancedStatisticsCardProps) {
  const colors = colorVariants[bgColor]
  
  return (
    <div
      className={cn(
        "rounded-2xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative overflow-hidden",
        colors.bg,
        className
      )}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
        <div className="w-full h-full bg-gradient-to-br from-white to-transparent rounded-full transform translate-x-16 -translate-y-16" />
      </div>
      
      <div className="relative z-10">
        <div className={cn("flex items-center", direction === "left" ? "flex-row" : "flex-row-reverse")}>
          {/* Icon */}
          <div className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center shadow-lg",
            colors.iconBg,
            direction === "left" ? "mr-4" : "ml-4"
          )}>
            <div className={bgColor === "white" ? "text-white" : "text-white"}>
              {icon}
            </div>
          </div>
          
          {/* Content */}
          <div className={cn("flex-1", direction === "left" ? "text-left" : "text-right")}>
            <p className={cn(
              "text-sm font-medium mb-1 capitalize",
              colors.titleOpacity
            )}>
              {title}
            </p>
            <div className="flex items-baseline gap-2">
              <h3 className={cn("text-2xl font-bold", colors.text)}>
                {count}
              </h3>
              {percentage && (
                <span className={cn(
                  "text-sm font-semibold",
                  bgColor === "white" ? percentageColors[percentage.type] : "text-white/80"
                )}>
                  {percentage.value}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Preset variants for common use cases
export function PrimaryStatCard(props: Omit<EnhancedStatisticsCardProps, "bgColor">) {
  return <EnhancedStatisticsCard {...props} bgColor="primary" />
}

export function SuccessStatCard(props: Omit<EnhancedStatisticsCardProps, "bgColor">) {
  return <EnhancedStatisticsCard {...props} bgColor="success" />
}

export function WarningStatCard(props: Omit<EnhancedStatisticsCardProps, "bgColor">) {
  return <EnhancedStatisticsCard {...props} bgColor="warning" />
}

export function InfoStatCard(props: Omit<EnhancedStatisticsCardProps, "bgColor">) {
  return <EnhancedStatisticsCard {...props} bgColor="info" />
}

export function WhiteStatCard(props: Omit<EnhancedStatisticsCardProps, "bgColor">) {
  return <EnhancedStatisticsCard {...props} bgColor="white" />
}
