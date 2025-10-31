'use client'

import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string | number
  trend?: string
  trendPositive?: boolean
  icon: LucideIcon
  loading?: boolean
}

export function StatCard({ label, value, trend, trendPositive, icon: Icon, loading }: StatCardProps) {
  if (loading) {
    return (
      <div className="vision-glass-card p-[20px] animate-pulse">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="h-4 bg-white/10 rounded w-24 mb-3"></div>
            <div className="h-8 bg-white/10 rounded w-32 mb-2"></div>
            <div className="h-3 bg-white/10 rounded w-16"></div>
          </div>
          <div className="w-[30px] h-[30px] bg-white/10 rounded-[12px]"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="vision-glass-card p-[20px] hover:bg-white/5 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Label */}
          <p
            className="text-[12px] font-medium text-[#A0AEC0] mb-[8px]"
            style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
          >
            {label}
          </p>

          {/* Value */}
          <h3
            className="text-[24px] font-bold text-white mb-[4px]"
            style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
          >
            {value}
          </h3>

          {/* Trend */}
          {trend && (
            <div className="flex items-center gap-[6px]">
              <span
                className={`text-[12px] font-medium ${
                  trendPositive ? 'text-[#01B574]' : 'text-[#E31A1A]'
                }`}
                style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
              >
                {trendPositive ? '↑' : '↓'} {trend}
              </span>
              <span
                className="text-[12px] font-normal text-[#A0AEC0]"
                style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
              >
                since last month
              </span>
            </div>
          )}
        </div>

        {/* Icon */}
        <div
          className="flex items-center justify-center w-[45px] h-[45px] rounded-[12px]"
          style={{
            background: 'linear-gradient(135deg, #7928CA 0%, #4318FF 100%)',
          }}
        >
          <Icon className="h-[24px] w-[24px] text-white" />
        </div>
      </div>
    </div>
  )
}

