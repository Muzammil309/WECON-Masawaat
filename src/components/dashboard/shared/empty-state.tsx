'use client'

import { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({ icon: Icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="vision-glass-card p-[40px] text-center">
      {/* Icon */}
      <div className="flex items-center justify-center mb-[20px]">
        <div
          className="flex items-center justify-center w-[80px] h-[80px] rounded-[20px]"
          style={{
            background: 'linear-gradient(135deg, rgba(121, 40, 202, 0.2) 0%, rgba(67, 24, 255, 0.2) 100%)',
            border: '2px solid rgba(121, 40, 202, 0.3)',
          }}
        >
          <Icon className="h-[40px] w-[40px] text-[#7928CA]" />
        </div>
      </div>

      {/* Title */}
      <h3
        className="text-[20px] font-bold text-white mb-[8px]"
        style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
      >
        {title}
      </h3>

      {/* Description */}
      <p
        className="text-[14px] font-normal text-[#A0AEC0] mb-[24px] max-w-[400px] mx-auto"
        style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
      >
        {description}
      </p>

      {/* Action Button */}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-[24px] py-[12px] rounded-[12px] text-[12px] font-bold text-white transition-all hover:scale-105"
          style={{
            fontFamily: '"Plus Jakarta Display", sans-serif',
            background: 'linear-gradient(135deg, #7928CA 0%, #4318FF 100%)',
          }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}

