'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export function WeconScheduleCard() {
  return (
    <Link
      href="#"
      className="block rounded-[20px] sm:rounded-[24px] lg:rounded-[28px] p-[28px] sm:p-[36px] lg:p-[44px] relative overflow-hidden group hover:scale-[1.02] transition-transform"
      style={{
        background: 'linear-gradient(135deg, #E91E63 0%, #FF9800 100%)',
      }}
    >
      {/* Date */}
      <div className="flex items-baseline gap-[6px] sm:gap-[8px] mb-[8px] sm:mb-[12px]">
        <span className="text-[48px] sm:text-[64px] lg:text-[72px] font-bold text-white leading-none">26</span>
        <span className="text-[18px] sm:text-[22px] lg:text-[24px] font-semibold text-white">th</span>
        <span className="text-[18px] sm:text-[22px] lg:text-[24px] font-semibold text-white ml-[6px] sm:ml-[8px]">November</span>
      </div>

      {/* Schedule Text */}
      <div className="flex items-center justify-between">
        <span className="text-[28px] sm:text-[36px] lg:text-[42px] font-light text-white italic">Schedule</span>
        
        {/* Arrow Icon */}
        <div className="w-[44px] h-[44px] sm:w-[52px] sm:h-[52px] lg:w-[56px] lg:h-[56px] bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-all">
          <ChevronRight className="w-[22px] h-[22px] sm:w-[26px] sm:h-[26px] lg:w-[28px] lg:h-[28px] text-white" strokeWidth={3} />
        </div>
      </div>
    </Link>
  )
}

