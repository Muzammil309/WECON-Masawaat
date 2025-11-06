import Link from 'next/link'

export function VisionFooter() {
  return (
    <footer className="flex items-center justify-between px-[20px] py-[16px] mt-[24px]">
      {/* Copyright */}
      <div className="text-white/60 text-[12px] font-['Plus_Jakarta_Display',sans-serif]">
        <span className="font-normal">@ 2025, WECON MASAWAAT - Made with ❤️ for a better event experience</span>
      </div>

      {/* Menu Links */}
      <div className="flex items-center gap-[32px] text-white/60 text-[12px] font-['Plus_Jakarta_Display',sans-serif]">
        <Link href="#" className="hover:text-[#4318FF] transition-colors">
          Marketplace
        </Link>
        <Link href="#" className="hover:text-[#4318FF] transition-colors">
          Blog
        </Link>
        <Link href="#" className="hover:text-[#4318FF] transition-colors">
          License
        </Link>
      </div>
    </footer>
  )
}

