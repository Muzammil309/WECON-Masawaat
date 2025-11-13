'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

interface Activity {
  title: string
  time?: string
  subtitle?: string
  href: string
}

const activities: Activity[] = [
  {
    title: 'Learning Labs',
    time: '11:30 am',
    subtitle: 'Investor Readiness\nBy Accelerate Prosperity',
    href: '#',
  },
  {
    title: 'Skill Clinics',
    time: '10:00 am',
    subtitle: 'Product Photography Workshop\nBy Ramina Adz',
    href: '#',
  },
  {
    title: 'Entrepreneurial &\nInnovation Showcase',
    href: '#',
  },
  {
    title: "Mentors' Table",
    href: '#',
  },
  {
    title: 'Impact Narrative Cinema',
    href: '#',
  },
  {
    title: 'Policy Advocacy',
    href: '#',
  },
]

export function WeconActivities() {
  return (
    <div className="space-y-[16px] sm:space-y-[20px] lg:space-y-[24px]">
      {/* Section Title */}
      <h2 className="text-[28px] sm:text-[36px] lg:text-[42px] font-bold text-black">Activities</h2>

      {/* Activities List */}
      <div className="space-y-[10px] sm:space-y-[12px] lg:space-y-[14px]">
        {activities.map((activity, index) => (
          <Link
            key={index}
            href={activity.href}
            className="flex items-center gap-[14px] sm:gap-[16px] lg:gap-[18px] bg-gray-100 rounded-[14px] sm:rounded-[16px] lg:rounded-[18px] p-[14px] sm:p-[16px] lg:p-[18px] hover:bg-gray-200 transition-all group min-h-[68px] sm:min-h-[76px] lg:min-h-[84px]"
          >
            {/* Pink Circle Icon */}
            <div className="w-[44px] h-[44px] sm:w-[52px] sm:h-[52px] lg:w-[56px] lg:h-[56px] rounded-full bg-[#E91E63] flex-shrink-0"></div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-[8px] sm:gap-[10px]">
                <h3 className="text-[15px] sm:text-[16px] lg:text-[17px] font-bold text-black whitespace-pre-line leading-tight">
                  {activity.title}
                </h3>
                {activity.time && (
                  <span className="text-[11px] sm:text-[12px] lg:text-[13px] font-semibold text-[#E91E63] whitespace-nowrap">
                    {activity.time}
                  </span>
                )}
              </div>
              {activity.subtitle && (
                <p className="text-[11px] sm:text-[12px] lg:text-[13px] text-gray-600 mt-[4px] sm:mt-[6px] whitespace-pre-line leading-snug">
                  {activity.subtitle}
                </p>
              )}
            </div>

            {/* Arrow Icon */}
            <ChevronRight className="w-[22px] h-[22px] sm:w-[24px] sm:h-[24px] lg:w-[26px] lg:h-[26px] text-[#E91E63] flex-shrink-0 group-hover:translate-x-[4px] transition-transform" strokeWidth={2.5} />
          </Link>
        ))}
      </div>
    </div>
  )
}

