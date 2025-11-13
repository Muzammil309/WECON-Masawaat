'use client'

import Image from 'next/image'

export function WeconHeader() {
  return (
    <header className="bg-white border-b border-gray-100">
      <div className="max-w-[390px] sm:max-w-[768px] lg:max-w-[1200px] mx-auto px-[20px] sm:px-[32px] lg:px-[48px] py-[16px] sm:py-[20px]">
        <div className="flex items-center justify-between">
          {/* Change Mechanics Logo */}
          <div className="flex items-center gap-[2px]">
            <div className="text-[18px] sm:text-[24px] lg:text-[28px] font-bold">
              <span className="text-black">cm</span>
            </div>
            <div className="text-[9px] sm:text-[11px] lg:text-[12px] leading-tight">
              <div className="font-semibold text-black">change</div>
              <div className="font-semibold text-black">mechanics</div>
            </div>
          </div>

          {/* British Council Logo */}
          <div className="flex items-center gap-[6px] sm:gap-[8px]">
            <div className="grid grid-cols-2 gap-[2px]">
              <div className="w-[7px] h-[7px] sm:w-[9px] sm:h-[9px] lg:w-[10px] lg:h-[10px] rounded-full bg-[#003B5C]"></div>
              <div className="w-[7px] h-[7px] sm:w-[9px] sm:h-[9px] lg:w-[10px] lg:h-[10px] rounded-full bg-[#003B5C]"></div>
              <div className="w-[7px] h-[7px] sm:w-[9px] sm:h-[9px] lg:w-[10px] lg:h-[10px] rounded-full bg-[#003B5C]"></div>
              <div className="w-[7px] h-[7px] sm:w-[9px] sm:h-[9px] lg:w-[10px] lg:h-[10px] rounded-full bg-[#003B5C]"></div>
            </div>
            <div className="text-[9px] sm:text-[11px] lg:text-[12px] leading-tight">
              <div className="font-bold text-[#003B5C]">BRITISH</div>
              <div className="font-bold text-[#003B5C]">COUNCIL</div>
            </div>
          </div>
        </div>

        {/* Presents Badge */}
        <div className="mt-[12px] sm:mt-[16px]">
          <span className="inline-block bg-[#E91E63] text-white text-[10px] sm:text-[12px] lg:text-[13px] font-semibold px-[12px] sm:px-[16px] py-[4px] sm:py-[6px] rounded-[4px] sm:rounded-[6px]">
            Presents
          </span>
        </div>
      </div>
    </header>
  )
}

