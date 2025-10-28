'use client'

import { CheckCircle2, ShoppingCart, CreditCard, Bell, MoreVertical } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDistanceToNow } from 'date-fns'

interface TimelineItem {
  id: string
  title: string
  description: string
  timestamp: Date
  type: 'success' | 'order' | 'payment' | 'notification'
}

interface OrdersTimelineProps {
  items: TimelineItem[]
  loading?: boolean
}

const iconMap = {
  success: CheckCircle2,
  order: ShoppingCart,
  payment: CreditCard,
  notification: Bell,
}

const colorMap = {
  success: '#01B574',
  order: '#0075FF',
  payment: '#4318FF',
  notification: '#F6AD55',
}

export function VisionOrdersTimeline({ items, loading = false }: OrdersTimelineProps) {
  if (loading) {
    return (
      <div className="vision-glass-card p-[24px]">
        <div className="mb-[24px]">
          <Skeleton className="h-[24px] w-[150px] bg-white/10" />
        </div>
        <div className="space-y-[24px]">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-[60px] w-full bg-white/10" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="vision-glass-card p-[24px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-[32px]">
        <div>
          <h2
            className="text-[18px] font-bold text-white mb-[4px]"
            style={{ fontFamily: '"Plus Jakarta Display", sans-serif', lineHeight: '1.4' }}
          >
            Orders overview
          </h2>
          <div className="flex items-center gap-[4px]">
            <CheckCircle2 className="h-[15px] w-[15px] text-[#01B574]" />
            <p
              className="text-[14px] text-[#A0AEC0]"
              style={{ fontFamily: '"Plus Jakarta Display", sans-serif', lineHeight: '1.4' }}
            >
              <span className="font-bold text-[#01B574]">+30%</span>
              <span className="font-medium"> this month</span>
            </p>
          </div>
        </div>
        <button className="text-[#718096] hover:text-white transition-colors">
          <MoreVertical className="h-[20px] w-[20px]" />
        </button>
      </div>

      {/* Timeline */}
      <div className="space-y-[24px]">
        {items.length === 0 ? (
          <div className="py-[40px] text-center">
            <p
              className="text-[14px] font-medium text-[#A0AEC0]"
              style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
            >
              No recent activity
            </p>
          </div>
        ) : (
          items.map((item, index) => {
            const Icon = iconMap[item.type]
            const color = colorMap[item.type]
            const isLast = index === items.length - 1

            return (
              <div key={item.id} className="flex gap-[16px] relative">
                {/* Timeline Line */}
                {!isLast && (
                  <div
                    className="absolute left-[11px] top-[32px] bottom-[-24px] w-[2px]"
                    style={{ background: 'rgba(255, 255, 255, 0.1)' }}
                  />
                )}

                {/* Icon */}
                <div
                  className="flex items-center justify-center w-[24px] h-[24px] rounded-full flex-shrink-0 z-10"
                  style={{ background: color }}
                >
                  <Icon className="h-[14px] w-[14px] text-white" />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <p
                    className="text-[14px] font-bold text-white mb-[4px]"
                    style={{ fontFamily: '"Plus Jakarta Display", sans-serif', lineHeight: '1.4' }}
                  >
                    {item.title}
                  </p>
                  <p
                    className="text-[12px] font-medium text-[#A0AEC0] mb-[4px]"
                    style={{ fontFamily: '"Plus Jakarta Display", sans-serif', lineHeight: '1.5' }}
                  >
                    {item.description}
                  </p>
                  <p
                    className="text-[12px] font-normal text-[#A0AEC0]"
                    style={{ fontFamily: '"Plus Jakarta Display", sans-serif', lineHeight: '1.5' }}
                  >
                    {formatDistanceToNow(item.timestamp, { addSuffix: true })}
                  </p>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

