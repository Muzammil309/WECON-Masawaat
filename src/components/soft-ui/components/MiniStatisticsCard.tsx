"use client"

import React, { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { SoftBox } from './SoftBox'
import { SoftTypography } from './SoftTypography'
import { Card } from '@/components/ui/card'

export type StatCardColor = 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error' | 'light' | 'dark' | 'white'

export interface MiniStatisticsCardProps {
  bgColor?: StatCardColor
  title: {
    text: string
    fontWeight?: 'light' | 'regular' | 'medium' | 'bold'
  }
  count: string | number
  percentage?: {
    color: StatCardColor
    text: string | number
  }
  icon: {
    color: StatCardColor
    component: ReactNode
  }
  direction?: 'left' | 'right'
  className?: string
}

export function MiniStatisticsCard({
  bgColor = 'white',
  title,
  count,
  percentage,
  icon,
  direction = 'right',
  className,
}: MiniStatisticsCardProps) {
  return (
    <Card className={cn('overflow-hidden border-0', className)}>
      <SoftBox
        bgColor={bgColor}
        variant={bgColor !== 'white' ? 'gradient' : 'contained'}
        gradient={bgColor !== 'white' ? bgColor : undefined}
        p={2}
      >
        <div className="flex items-center gap-4">
          {/* Icon - Left */}
          {direction === 'left' && (
            <SoftBox
              variant="gradient"
              bgColor={bgColor === 'white' ? icon.color : 'white'}
              color={bgColor === 'white' ? 'white' : 'dark'}
              width="3rem"
              height="3rem"
              borderRadius="md"
              display="flex"
              justifyContent="center"
              alignItems="center"
              shadow="md"
              className="flex-shrink-0"
            >
              {icon.component}
            </SoftBox>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0">
            <SoftTypography
              variant="button"
              color={bgColor === 'white' ? 'text' : 'white'}
              opacity={bgColor === 'white' ? 1 : 0.7}
              textTransform="capitalize"
              fontWeight={title.fontWeight || 'medium'}
              className="block mb-1"
            >
              {title.text}
            </SoftTypography>
            
            <div className="flex items-baseline gap-2 flex-wrap">
              <SoftTypography
                variant="h5"
                fontWeight="bold"
                color={bgColor === 'white' ? 'dark' : 'white'}
                className="inline-block"
              >
                {count}
              </SoftTypography>
              
              {percentage && (
                <SoftTypography
                  variant="button"
                  color={percentage.color}
                  fontWeight="bold"
                  className="inline-block"
                >
                  {percentage.text}
                </SoftTypography>
              )}
            </div>
          </div>

          {/* Icon - Right */}
          {direction === 'right' && (
            <SoftBox
              variant="gradient"
              bgColor={bgColor === 'white' ? icon.color : 'white'}
              color={bgColor === 'white' ? 'white' : 'dark'}
              width="3rem"
              height="3rem"
              borderRadius="md"
              display="flex"
              justifyContent="center"
              alignItems="center"
              shadow="md"
              className="flex-shrink-0"
            >
              {icon.component}
            </SoftBox>
          )}
        </div>
      </SoftBox>
    </Card>
  )
}

export default MiniStatisticsCard

