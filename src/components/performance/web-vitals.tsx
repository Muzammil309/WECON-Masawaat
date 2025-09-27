'use client'

import { useEffect } from 'react'
import { onCLS, onINP, onFCP, onLCP, onTTFB } from 'web-vitals'

interface WebVitalsProps {
  onMetric?: (metric: unknown) => void
}

export function WebVitals({ onMetric }: WebVitalsProps) {
  useEffect(() => {
    const handleMetric = (metric: unknown) => {
      // Log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.log('Web Vital:', metric)
      }

      // Send to analytics service
      if (onMetric) {
        onMetric(metric)
      }

      // Send to Vercel Analytics if available
      if (typeof window !== 'undefined' && (window as unknown as { va?: unknown }).va) {
        const metricData = metric as { name: string; value: number; rating: string }
        ((window as unknown as { va: (action: string, event: string, data: unknown) => void }).va)('track', 'Web Vital', {
          name: metricData.name,
          value: metricData.value,
          rating: metricData.rating,
        })
      }
    }

    // Measure Core Web Vitals
    onCLS(handleMetric)
    onINP(handleMetric) // INP replaced FID
    onFCP(handleMetric)
    onLCP(handleMetric)
    onTTFB(handleMetric)
  }, [onMetric])

  return null
}

// Hook for measuring custom performance metrics
export function usePerformanceMetric(name: string, value: number) {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.performance) {
      // Create a custom performance mark
      performance.mark(`${name}-start`)
      
      setTimeout(() => {
        performance.mark(`${name}-end`)
        performance.measure(name, `${name}-start`, `${name}-end`)
        
        const measure = performance.getEntriesByName(name)[0]
        if (measure && process.env.NODE_ENV === 'development') {
          console.log(`Performance metric ${name}:`, measure.duration, 'ms')
        }
      }, value)
    }
  }, [name, value])
}
