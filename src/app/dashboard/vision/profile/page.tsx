'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ProfileRedirectPage() {
  const router = useRouter()

  useEffect(() => {
    console.log('🔄 Redirecting to profile page...')
    router.push('/dashboard/profile')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0F1535', fontFamily: '"Plus Jakarta Display", sans-serif' }}>
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-white text-sm">Redirecting to your profile...</p>
      </div>
    </div>
  )
}

