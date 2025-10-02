'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react'

export default function AuthDebugPage() {
  const [status, setStatus] = useState<any>({
    supabaseConfigured: false,
    userAuthenticated: false,
    userId: null,
    userEmail: null,
    profileExists: false,
    userRole: null,
    error: null,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    setLoading(true)
    const supabase = createClient()
    const newStatus: any = {
      supabaseConfigured: false,
      userAuthenticated: false,
      userId: null,
      userEmail: null,
      profileExists: false,
      userRole: null,
      error: null,
    }

    try {
      // Check if Supabase is configured
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      newStatus.supabaseConfigured = !!(supabaseUrl && supabaseKey)

      // Check if user is authenticated
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError) {
        newStatus.error = userError.message
      }

      if (user) {
        newStatus.userAuthenticated = true
        newStatus.userId = user.id
        newStatus.userEmail = user.email

        // Check if profile exists
        const { data: profile, error: profileError } = await supabase
          .from('em_profiles')
          .select('role')
          .eq('id', user.id)
          .maybeSingle()

        if (profileError) {
          newStatus.error = profileError.message
        }

        if (profile) {
          newStatus.profileExists = true
          newStatus.userRole = profile.role
        }
      }
    } catch (error) {
      newStatus.error = error instanceof Error ? error.message : 'Unknown error'
    }

    setStatus(newStatus)
    setLoading(false)
  }

  const StatusItem = ({ label, value, success }: { label: string; value: any; success: boolean }) => (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <span className="font-medium text-gray-700">{label}:</span>
      <div className="flex items-center gap-2">
        <span className="text-gray-900">{value?.toString() || 'N/A'}</span>
        {success ? (
          <CheckCircle2 className="h-5 w-5 text-green-500" />
        ) : (
          <XCircle className="h-5 w-5 text-red-500" />
        )}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-white/95 backdrop-blur-sm shadow-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Authentication Debug</CardTitle>
          <CardDescription className="text-center">
            Diagnostic information for authentication flow
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Checking authentication status...</p>
            </div>
          ) : (
            <>
              <StatusItem
                label="Supabase Configured"
                value={status.supabaseConfigured ? 'Yes' : 'No'}
                success={status.supabaseConfigured}
              />
              <StatusItem
                label="User Authenticated"
                value={status.userAuthenticated ? 'Yes' : 'No'}
                success={status.userAuthenticated}
              />
              {status.userId && (
                <StatusItem
                  label="User ID"
                  value={status.userId}
                  success={true}
                />
              )}
              {status.userEmail && (
                <StatusItem
                  label="Email"
                  value={status.userEmail}
                  success={true}
                />
              )}
              <StatusItem
                label="Profile Exists"
                value={status.profileExists ? 'Yes' : 'No'}
                success={status.profileExists}
              />
              {status.userRole && (
                <StatusItem
                  label="User Role"
                  value={status.userRole}
                  success={true}
                />
              )}

              {status.error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-900">Error</p>
                    <p className="text-sm text-red-700">{status.error}</p>
                  </div>
                </div>
              )}

              <div className="pt-4 space-y-2">
                <Button
                  onClick={checkAuthStatus}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  Refresh Status
                </Button>
                <Button
                  onClick={() => window.location.href = '/auth/login'}
                  variant="outline"
                  className="w-full"
                >
                  Go to Login
                </Button>
                {status.userAuthenticated && (
                  <Button
                    onClick={() => {
                      const path = status.userRole === 'admin' ? '/admin' : '/dashboard'
                      window.location.href = path
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    Go to {status.userRole === 'admin' ? 'Admin' : 'Dashboard'}
                  </Button>
                )}
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-medium text-blue-900 mb-2">Console Logs</p>
                <p className="text-xs text-blue-700">
                  Check your browser console (F12) for detailed authentication logs during login.
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

