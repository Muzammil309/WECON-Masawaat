'use client'

export function WeconFooter() {
  return (
    <div className="rounded-[20px] sm:rounded-[24px] lg:rounded-[28px] border-4 border-[#FF9800] p-[28px] sm:p-[36px] lg:p-[44px] bg-white">
      {/* CM Logo */}
      <div className="flex items-center gap-[4px] sm:gap-[6px] mb-[14px] sm:mb-[16px] lg:mb-[18px]">
        <div className="text-[28px] sm:text-[36px] lg:text-[42px] font-bold">
          <span className="text-black">cm</span>
        </div>
        <div className="w-[11px] h-[11px] sm:w-[13px] sm:h-[13px] lg:w-[15px] lg:h-[15px] rounded-full bg-[#FF9800]"></div>
      </div>

      {/* Body Text */}
      <p className="text-[13px] sm:text-[14px] lg:text-[15px] text-gray-600 leading-relaxed">
        Add a little bit of body text
      </p>
    </div>
  )
}

