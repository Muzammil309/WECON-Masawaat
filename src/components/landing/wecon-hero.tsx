'use client'

import Link from 'next/link'
import Image from 'next/image'

export function WeconHero() {
  return (
    <div className="space-y-[16px] sm:space-y-[20px] lg:space-y-[24px]">
      {/* WECON Logo Image - Fallback to text if image not found */}
      <div className="flex flex-col items-center justify-center">
        {/* Orange CM Logo */}
        <div className="w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] lg:w-[120px] lg:h-[120px] rounded-full bg-gradient-to-br from-[#FFA726] to-[#FF9800] mb-[16px] sm:mb-[20px] flex items-center justify-center">
          <div className="w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] lg:w-[70px] lg:h-[70px] rounded-full bg-white/30"></div>
        </div>

        {/* Presents Badge */}
        <div className="mb-[20px] sm:mb-[24px]">
          <span className="inline-block bg-[#E91E63] text-white text-[12px] sm:text-[14px] lg:text-[16px] font-bold px-[20px] sm:px-[24px] py-[8px] sm:py-[10px] rounded-[8px]">
            Presents
          </span>
        </div>

        {/* CON25 Logo */}
        <div className="text-center mb-[12px] sm:mb-[16px]">
          <h1 className="text-[72px] sm:text-[96px] lg:text-[120px] font-black leading-none tracking-tight">
            <span className="text-[#E91E63]">CON</span>
            <span className="text-[36px] sm:text-[48px] lg:text-[60px] align-top">25</span>
          </h1>
        </div>

        {/* Arabic Text */}
        <div className="text-[28px] sm:text-[36px] lg:text-[42px] font-bold text-black leading-none mb-[8px]" style={{ fontFamily: 'Arial, sans-serif' }}>
          مساوات
        </div>
        <div className="w-[100px] sm:w-[120px] lg:w-[140px] h-[3px] bg-black"></div>
      </div>

      {/* Tagline */}
      <p className="text-center text-[13px] sm:text-[14px] lg:text-[15px] text-gray-600 font-normal px-[20px]">
        Add a little bit of body text
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-[12px] sm:gap-[16px] items-center justify-center px-[20px]">
        <Link
          href="#"
          className="w-full sm:w-auto min-h-[44px] px-[24px] sm:px-[32px] py-[12px] sm:py-[14px] border-2 border-[#E91E63] text-[#E91E63] rounded-[24px] sm:rounded-[28px] text-[14px] sm:text-[15px] lg:text-[16px] font-semibold text-center hover:bg-[#E91E63] hover:text-white transition-all flex items-center justify-center"
        >
          Register Now
        </Link>
        <Link
          href="#"
          className="w-full sm:w-auto min-h-[44px] px-[24px] sm:px-[32px] py-[12px] sm:py-[14px] border-2 border-gray-300 text-gray-700 rounded-[24px] sm:rounded-[28px] text-[14px] sm:text-[15px] lg:text-[16px] font-semibold text-center hover:border-gray-400 transition-all flex items-center justify-center"
        >
          Join Whatsapp Community
        </Link>
      </div>
    </div>
  )
}

