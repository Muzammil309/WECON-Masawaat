'use client'

import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string | number
  trend: string
  trendPositive?: boolean
  icon: LucideIcon
}

export function VisionStatCard({ label, value, trend, trendPositive = true, icon: Icon }: StatCardProps) {
  return (
    <div className="vision-glass-card p-[21.5px] w-full h-[80px] flex items-center justify-between">
      {/* Left: Text Content */}
      <div>
        <p
          className="text-[12px] font-medium text-[#A0AEC0] mb-[4px]"
          style={{ fontFamily: '"Plus Jakarta Display", sans-serif', lineHeight: '1' }}
        >
          {label}
        </p>
        <p
          className="text-[18px] font-bold text-white mb-[4px]"
          style={{ fontFamily: '"Plus Jakarta Display", sans-serif', lineHeight: '1.4' }}
        >
          {value}
        </p>
        <p
          className={`text-[14px] font-bold ${trendPositive ? 'text-[#01B574]' : 'text-[#E31A1A]'}`}
          style={{ fontFamily: '"Plus Jakarta Display", sans-serif', lineHeight: '1.4' }}
        >
          {trend}
        </p>
      </div>

      {/* Right: Icon */}
      <div className="vision-icon-bg w-[45px] h-[45px] flex items-center justify-center">
        <Icon className="h-[22.5px] w-[22.5px] text-white" />
      </div>
    </div>
  )
}

