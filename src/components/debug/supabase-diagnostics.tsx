'use client'

import { useEffect, useState } from 'react'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client'

interface DiagnosticInfo {
  isConfigured: boolean
  hasUrl: boolean
  hasKey: boolean
  urlValue: string
  keyLength: number
  clientCreated: boolean
  connectionTest: 'pending' | 'success' | 'failed'
  error?: string
}

export function SupabaseDiagnostics() {
  const [diagnostics, setDiagnostics] = useState<DiagnosticInfo | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const runDiagnostics = async () => {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      const info: DiagnosticInfo = {
        isConfigured: isSupabaseConfigured(),
        hasUrl: !!url,
        hasKey: !!key,
        urlValue: url || 'undefined',
        keyLength: key?.length || 0,
        clientCreated: false,
        connectionTest: 'pending'
      }

      try {
        const client = createClient()
        info.clientCreated = true
        
        // Test connection with a simple auth check
        const { data, error } = await client.auth.getSession()
        if (error) {
          info.connectionTest = 'failed'
          info.error = error.message
        } else {
          info.connectionTest = 'success'
        }
      } catch (error) {
        info.connectionTest = 'failed'
        info.error = error instanceof Error ? error.message : 'Unknown error'
      }

      setDiagnostics(info)
    }

    runDiagnostics()
  }, [])

  // Only show in development or when explicitly requested
  if (process.env.NODE_ENV === 'production' && !isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-red-600 text-white px-3 py-1 rounded text-xs z-50"
      >
        Show Diagnostics
      </button>
    )
  }

  if (!diagnostics) {
    return (
      <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded shadow-lg z-50">
        Running diagnostics...
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded shadow-lg z-50 max-w-md">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-sm">Supabase Diagnostics</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-white"
        >
          ×
        </button>
      </div>
      
      <div className="space-y-1 text-xs">
        <div className={`flex justify-between ${diagnostics.isConfigured ? 'text-green-400' : 'text-red-400'}`}>
          <span>Configured:</span>
          <span>{diagnostics.isConfigured ? '✓' : '✗'}</span>
        </div>
        
        <div className={`flex justify-between ${diagnostics.hasUrl ? 'text-green-400' : 'text-red-400'}`}>
          <span>Has URL:</span>
          <span>{diagnostics.hasUrl ? '✓' : '✗'}</span>
        </div>
        
        <div className={`flex justify-between ${diagnostics.hasKey ? 'text-green-400' : 'text-red-400'}`}>
          <span>Has Key:</span>
          <span>{diagnostics.hasKey ? '✓' : '✗'}</span>
        </div>
        
        <div className="text-gray-300">
          <span>URL: </span>
          <span className="break-all">{diagnostics.urlValue}</span>
        </div>
        
        <div className="text-gray-300">
          <span>Key Length: </span>
          <span>{diagnostics.keyLength}</span>
        </div>
        
        <div className={`flex justify-between ${diagnostics.clientCreated ? 'text-green-400' : 'text-red-400'}`}>
          <span>Client Created:</span>
          <span>{diagnostics.clientCreated ? '✓' : '✗'}</span>
        </div>
        
        <div className={`flex justify-between ${
          diagnostics.connectionTest === 'success' ? 'text-green-400' : 
          diagnostics.connectionTest === 'failed' ? 'text-red-400' : 'text-yellow-400'
        }`}>
          <span>Connection:</span>
          <span>{diagnostics.connectionTest}</span>
        </div>
        
        {diagnostics.error && (
          <div className="text-red-400 mt-2">
            <div className="font-semibold">Error:</div>
            <div className="break-words">{diagnostics.error}</div>
          </div>
        )}
      </div>
    </div>
  )
}
