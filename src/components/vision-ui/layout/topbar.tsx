'use client'

import { Search, Settings, Bell, User } from 'lucide-react'
import Link from 'next/link'

interface TopbarProps {
  title: string
  breadcrumb?: string
}

export function VisionTopbar({ title, breadcrumb = 'Pages' }: TopbarProps) {
  return (
    <div className="flex items-center justify-between mb-[20px]">
      {/* Left: Breadcrumb and Title */}
      <div>
        <p
          className="text-[12px] font-normal text-[#A0AEC0] mb-[8px]"
          style={{ fontFamily: '"Plus Jakarta Display", sans-serif', lineHeight: '1' }}
        >
          <span className="text-[#A0AEC0]">{breadcrumb} </span>
          <span className="text-white font-medium">/ {title}</span>
        </p>
        <h1
          className="text-[14px] font-medium text-white"
          style={{ fontFamily: '"Plus Jakarta Display", sans-serif', lineHeight: '1.4' }}
        >
          {title}
        </h1>
      </div>

      {/* Right: Search and Icons */}
      <div className="flex items-center gap-[18px]">
        {/* Search Input */}
        <div
          className="flex items-center gap-[8px] px-[12px] py-[8px] rounded-[15px] border border-[rgba(226,232,240,0.3)]"
          style={{ background: '#0F1535' }}
        >
          <Search className="h-[15px] w-[15px] text-[#A0AEC0]" />
          <input
            type="text"
            placeholder="Type here..."
            className="bg-transparent border-none outline-none text-[12px] text-[#A0AEC0] placeholder:text-[#A0AEC0] w-[150px]"
            style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
          />
        </div>

        {/* Sign In Link */}
        <Link
          href="/auth/signin"
          className="flex items-center gap-[4px] text-[12px] font-normal text-[#718096] hover:text-white transition-colors"
          style={{ fontFamily: '"Plus Jakarta Display", sans-serif', lineHeight: '1.5' }}
        >
          <User className="h-[12px] w-[12px]" />
          <span>Sign In</span>
        </Link>

        {/* Settings Icon */}
        <button className="text-[#718096] hover:text-white transition-colors">
          <Settings className="h-[12px] w-[12px]" />
        </button>

        {/* Notifications Icon */}
        <button className="text-[#718096] hover:text-white transition-colors">
          <Bell className="h-[12px] w-[12px]" />
        </button>
      </div>
    </div>
  )
}

