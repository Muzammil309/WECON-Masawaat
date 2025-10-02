'use client'

import { usePathname } from 'next/navigation'
import { AiventHeader } from '@/components/aivent/aivent-header'
import { useEffect, useState } from 'react'

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
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // List of routes that should NOT show the AiventHeader
  // These routes have their own navigation systems or should be full-screen
  const excludedRoutes = [
    '/dashboard',
    '/admin',
    '/speaker',
    '/attendee',
    '/auth/login',
    '/auth/signup',
    '/auth/debug',
    '/auth/callback',
    '/auth/forgot-password'
  ]

  // Check if current path starts with any excluded route
  const isExcludedPage = excludedRoutes.some(route => {
    // Normalize pathname to handle trailing slashes
    const normalizedPath = pathname?.toLowerCase().replace(/\/$/, '') || ''
    const normalizedRoute = route.toLowerCase().replace(/\/$/, '')
    return normalizedPath === normalizedRoute || normalizedPath.startsWith(normalizedRoute + '/')
  })

  // Don't render anything until mounted (prevents hydration issues)
  if (!mounted) {
    return null
  }

  // Don't render header on excluded pages (dashboard, auth, etc.)
  if (isExcludedPage) {
    console.log('[ConditionalHeader] Excluded page detected, hiding header:', pathname)
    return null
  }

  // Render header on all other pages (homepage, landing pages, etc.)
  console.log('[ConditionalHeader] Public page, showing header:', pathname)
  return <AiventHeader />
}

