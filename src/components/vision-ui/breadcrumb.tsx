'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export function VisionBreadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-[8px] mb-[24px] md:mb-[32px]">
      {items.map((item, index) => {
        const isLast = index === items.length - 1

        return (
          <div key={index} className="flex items-center gap-[8px]">
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="text-[12px] md:text-[13px] text-white/60 hover:text-white transition-colors"
                style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={`text-[12px] md:text-[13px] ${
                  isLast ? 'text-white font-medium' : 'text-white/60'
                }`}
                style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
              >
                {item.label}
              </span>
            )}
            {!isLast && (
              <ChevronRight className="h-[14px] w-[14px] text-white/40" />
            )}
          </div>
        )
      })}
    </nav>
  )
}

