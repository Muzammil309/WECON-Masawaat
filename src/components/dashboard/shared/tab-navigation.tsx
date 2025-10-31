'use client'

import { LucideIcon } from 'lucide-react'

export interface Tab {
  id: string
  label: string
  icon: LucideIcon
}

interface TabNavigationProps {
  tabs: Tab[]
  activeTab: string
  onTabChange: (tabId: string) => void
}

export function TabNavigation({ tabs, activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="vision-glass-card p-[8px] mb-[24px]">
      <div className="flex items-center gap-[8px] overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          const Icon = tab.icon

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                flex items-center gap-[10px] px-[20px] py-[12px] rounded-[12px] transition-all whitespace-nowrap
                ${
                  isActive
                    ? 'vision-tab-active'
                    : 'hover:bg-white/5'
                }
              `}
            >
              <Icon className={`h-[18px] w-[18px] ${isActive ? 'text-white' : 'text-[#A0AEC0]'}`} />
              <span
                className={`text-[14px] font-medium ${isActive ? 'text-white' : 'text-[#A0AEC0]'}`}
                style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
              >
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

