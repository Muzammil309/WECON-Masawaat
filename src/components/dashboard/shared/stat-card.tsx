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
    <div className="group vision-glass-card p-[24px] hover:bg-white/8 transition-all duration-300 hover:scale-[1.02] cursor-pointer border border-transparent hover:border-[#7928CA]/30">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Label */}
          <p
            className="text-[14px] font-semibold text-[#A0AEC0] mb-[10px]"
            style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
          >
            {label}
          </p>

          {/* Value */}
          <h3
            className="text-[32px] font-bold text-white mb-[6px] group-hover:text-[#7928CA] transition-colors"
            style={{ fontFamily: '"Plus Jakarta Display", sans-serif', lineHeight: '1.2' }}
          >
            {value}
          </h3>

          {/* Trend */}
          {trend && (
            <div className="flex items-center gap-[8px]">
              <span
                className={`text-[13px] font-bold ${
                  trendPositive ? 'text-[#01B574]' : 'text-[#E31A1A]'
                }`}
                style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
              >
                {trendPositive ? '↑' : '↓'} {trend}
              </span>
              <span
                className="text-[13px] font-medium text-[#A0AEC0]"
                style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
              >
                since last month
              </span>
            </div>
          )}
        </div>

        {/* Icon */}
        <div
          className="flex items-center justify-center w-[56px] h-[56px] rounded-[16px] group-hover:scale-110 transition-transform duration-300"
          style={{
            background: 'linear-gradient(135deg, #7928CA 0%, #4318FF 100%)',
            boxShadow: '0 8px 24px rgba(121, 40, 202, 0.3)',
          }}
        >
          <Icon className="h-[28px] w-[28px] text-white" strokeWidth={2.5} />
        </div>
      </div>
    </div>
  )
}

