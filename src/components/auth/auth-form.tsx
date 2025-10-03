'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { Github, Mail, Loader2 } from 'lucide-react'
import Link from 'next/link'

export function AuthForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const supabase = createClient()
  const supabaseConfigured = useMemo(() => isSupabaseConfigured(), [])

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      console.log('Attempting signup with Supabase...')
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      console.log('Signup response:', { error, data })

      if (error) {
        console.error('Signup error:', error)
        toast.error(`Signup failed: ${error.message}`)
      } else {
        toast.success('Account created successfully! You can now sign in.')
        // Switch to sign in tab after successful signup
        setTimeout(() => {
          const signInTab = document.querySelector('[value="signin"]') as HTMLElement
          signInTab?.click()
        }, 1500)
      }
    } catch (error) {
      console.error('Unexpected signup error:', error)
      toast.error(`An unexpected error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      console.log('=== LOGIN FLOW STARTED ===')
      console.log('Step 1: Attempting signin with Supabase...')
      console.log('Email:', email)

      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      console.log('Step 2: Signin response received')
      console.log('Error:', error)
      console.log('Data:', data ? 'User data received' : 'No data')

      if (error) {
        console.error('❌ Signin error:', error)
        toast.error(`Login failed: ${error.message}`)
        setIsLoading(false)
        return
      }

      if (!data.user) {
        console.error('❌ No user data returned')
        toast.error('Login failed: No user data')
        setIsLoading(false)
        return
      }

      console.log('✅ Authentication successful')
      console.log('User ID:', data.user.id)
      toast.success('Welcome back!')

      // Determine role-based redirect
      let redirectPath = '/dashboard' // Default for attendees and speakers

      console.log('Step 3: Fetching user profile for role-based redirect...')

      const { data: profile, error: profileError } = await supabase
        .from('em_profiles')
        .select('role')
        .eq('id', data.user.id)
        .maybeSingle()

      console.log('Step 4: Profile query result')
      console.log('Profile:', profile)
      console.log('Profile Error:', profileError)

      if (profileError) {
        console.error('⚠️ Profile fetch error:', profileError)
        console.log('Using default redirect path:', redirectPath)
      } else if (profile && profile.role) {
        const userRole = profile.role
        console.log('✅ User role found:', userRole)

        // Role-based routing
        if (userRole === 'admin') {
          redirectPath = '/admin'
          console.log('✅ Admin role detected, will redirect to /admin')
        } else if (userRole === 'attendee' || userRole === 'speaker') {
          redirectPath = '/dashboard'
          console.log('✅ Attendee/Speaker role detected, will redirect to /dashboard')
        } else {
          console.warn('⚠️ Unknown role:', userRole, '- using default redirect')
        }
      } else {
        console.warn('⚠️ No profile found for user - using default redirect')
      }

      console.log('Step 5: Final redirect path determined:', redirectPath)
      console.log('Step 6: Initiating redirect...')

      // Use window.location.href for immediate, reliable redirect
      // This is the most reliable method and works in all scenarios
      console.log('🚀 Redirecting to:', redirectPath)

      // Set a safety timeout in case redirect fails
      const safetyTimeout = setTimeout(() => {
        console.warn('⚠️ Redirect timeout - showing manual option')
        setIsLoading(false)
        toast.error('Automatic redirect failed. Click the button below to continue.')

        // Show manual redirect button as fallback
        const continueBtn = document.createElement('button')
        continueBtn.textContent = 'Continue to Dashboard →'
        continueBtn.className = 'mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors'
        continueBtn.onclick = () => {
          console.log('Manual redirect button clicked')
          window.location.href = redirectPath
        }

        const form = document.querySelector('form')
        if (form && !form.querySelector('button[class*="bg-blue-600"]')) {
          form.appendChild(continueBtn)
        }
      }, 3000) // 3 second safety timeout

      // Small delay to ensure toast message is visible, then redirect
      setTimeout(() => {
        try {
          console.log('Executing redirect to:', redirectPath)
          clearTimeout(safetyTimeout) // Clear safety timeout if redirect succeeds
          window.location.href = redirectPath
        } catch (redirectError) {
          console.error('❌ Redirect failed:', redirectError)
          clearTimeout(safetyTimeout)
          setIsLoading(false)
          toast.error('Redirect failed. Please try again or contact support.')
        }
      }, 500)

    } catch (error) {
      console.error('❌ Unexpected signin error:', error)
      toast.error(`An unexpected error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`)
      setIsLoading(false)
    }
  }

  const handleSocialLogin = async (provider: 'github' | 'google') => {
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        toast.error(error.message)
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full">
      <Card className="w-full bg-white/95 backdrop-blur-sm shadow-2xl border-0">
        <CardHeader className="space-y-2 pb-6">
          <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Welcome to EventFlow
          </CardTitle>
          <CardDescription className="text-center text-base text-gray-600">
            Sign in to your account or create a new one
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          {!supabaseConfigured && (
            <div className="mb-4 rounded-lg border border-yellow-500/40 bg-yellow-500/10 p-4 text-yellow-800">
              <p className="text-sm font-medium">⚠️ Supabase is not configured</p>
              <p className="text-xs mt-1">Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY</p>
            </div>
          )}
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-lg">
              <TabsTrigger
                value="signin"
                className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Sign In
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="space-y-4 mt-6">
              <form onSubmit={handleSignIn} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="signin-email" className="text-sm font-medium text-gray-700">
                    Email
                  </Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="admin@wecon.events"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-11 px-4 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="signin-password" className="text-sm font-medium text-gray-700">
                      Password
                    </Label>
                    <Link
                      href="/auth/forgot-password"
                      className="text-xs text-purple-600 hover:text-purple-700 hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="signin-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11 px-4 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full h-11 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4 mt-6">
              <form onSubmit={handleSignUp} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="signup-fullname" className="text-sm font-medium text-gray-700">
                    Full Name
                  </Label>
                  <Input
                    id="signup-fullname"
                    type="text"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="h-11 px-4 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-sm font-medium text-gray-700">
                    Email
                  </Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-11 px-4 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-sm font-medium text-gray-700">
                    Password
                  </Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="h-11 px-4 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
                </div>
                <Button
                  type="submit"
                  className="w-full h-11 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-gray-500 font-medium">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={() => handleSocialLogin('github')}
              disabled={isLoading}
              className="h-11 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-colors"
            >
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSocialLogin('google')}
              disabled={isLoading}
              className="h-11 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-colors"
            >
              <Mail className="mr-2 h-4 w-4" />
              Google
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
