'use client'

import { usePathname } from 'next/navigation'
import { AiventHeader } from '@/components/aivent/aivent-header'

/**
 * ConditionalHeader component
 * 
 * Renders the AiventHeader only on non-dashboard pages.
 * Dashboard pages (/dashboard, /admin, etc.) have their own navigation
 * and should not display the global header.
 * 
 * This ensures:
 * 1. Homepage and landing pages keep the original Aivent header with transparent overlay
 * 2. Dashboard pages use their own sidebar navigation without the global header
 * 3. No layout conflicts or overlapping headers
 */
export function ConditionalHeader() {
  const pathname = usePathname()
  
  // List of routes that should NOT show the AiventHeader
  // These routes have their own navigation systems
  const dashboardRoutes = [
    '/dashboard',
    '/admin',
    '/speaker',
    '/attendee'
  ]
  
  // Check if current path starts with any dashboard route
  const isDashboardPage = dashboardRoutes.some(route => pathname.startsWith(route))
  
  // Don't render header on dashboard pages
  if (isDashboardPage) {
    return null
  }
  
  // Render header on all other pages (homepage, landing pages, etc.)
  return <AiventHeader />
}

