'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Mail, Lock, User, CheckCircle2, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

export function ModernAuthForm() {
  const router = useRouter()
  const supabase = createClient()

  // Login state
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)

  // Signup state
  const [signupName, setSignupName] = useState('')
  const [signupEmail, setSignupEmail] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [signupLoading, setSignupLoading] = useState(false)

  // UI state
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoginLoading(true)

    console.log('🔐 [AUTH] ========================================')
    console.log('🔐 [AUTH] LOGIN FLOW STARTED')
    console.log('🔐 [AUTH] ========================================')
    console.log('🔐 [AUTH] Email:', loginEmail)
    console.log('🔐 [AUTH] Timestamp:', new Date().toISOString())

    try {
      // Simple, direct authentication
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      })

      if (error) {
        console.error('🔐 [AUTH] Login error:', error.message)
        setError(error.message)
        toast.error(error.message)
        setLoginLoading(false)
        return
      }

      if (!data.user) {
        console.error('🔐 [AUTH] No user returned')
        setError('Authentication failed')
        toast.error('Authentication failed')
        setLoginLoading(false)
        return
      }

      console.log('🔐 [AUTH] Login successful!')
      console.log('🔐 [AUTH] User ID:', data.user.id)

      // Fetch user role
      const { data: profile, error: profileError } = await supabase
        .from('em_profiles')
        .select('role')
        .eq('id', data.user.id)
        .single()

      if (profileError) {
        console.error('🔐 [AUTH] Profile fetch error:', profileError)
        // Continue with default role if profile fetch fails
      }

      const role = profile?.role || 'attendee'
      console.log('🔐 [AUTH] User role:', role)

      // Determine redirect path
      const redirectPath = role === 'admin' ? '/admin' : '/dashboard'
      console.log('🔐 [AUTH] Redirect path:', redirectPath)

      // Show success message
      setSuccess('Login successful! Redirecting...')
      toast.success('Welcome back!')

      // Wait a moment for the success message to be visible
      await new Promise(resolve => setTimeout(resolve, 800))

      // Perform redirect using both methods for reliability
      console.log('🔐 [AUTH] Executing redirect to:', redirectPath)

      // Try Next.js router first
      router.push(redirectPath)

      // Fallback to window.location after a short delay if router.push doesn't work
      setTimeout(() => {
        console.log('🔐 [AUTH] Fallback redirect using window.location')
        window.location.href = redirectPath
      }, 1000)

      console.log('🔐 [AUTH] ========================================')
      console.log('🔐 [AUTH] LOGIN FLOW COMPLETED SUCCESSFULLY')
      console.log('🔐 [AUTH] ========================================')

    } catch (err) {
      console.error('🔐 [AUTH] ========================================')
      console.error('🔐 [AUTH] LOGIN FLOW FAILED')
      console.error('🔐 [AUTH] ========================================')
      console.error('🔐 [AUTH] Unexpected error:', err)
      const message = err instanceof Error ? err.message : 'An unexpected error occurred'
      setError(message)
      toast.error(message)
      setLoginLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setSignupLoading(true)

    console.log('🔐 [AUTH] Signup started')
    console.log('🔐 [AUTH] Email:', signupEmail)

    try {
      // Create account
      const { data, error } = await supabase.auth.signUp({
        email: signupEmail,
        password: signupPassword,
        options: {
          data: {
            full_name: signupName,
          },
        },
      })

      if (error) {
        console.error('🔐 [AUTH] Signup error:', error.message)
        setError(error.message)
        toast.error(error.message)
        setSignupLoading(false)
        return
      }

      console.log('🔐 [AUTH] Signup successful!')
      setSuccess('Account created! Please check your email to verify your account.')
      toast.success('Account created successfully!')

      // Clear form
      setSignupName('')
      setSignupEmail('')
      setSignupPassword('')
      setSignupLoading(false)

    } catch (err) {
      console.error('🔐 [AUTH] Unexpected error:', err)
      const message = err instanceof Error ? err.message : 'An unexpected error occurred'
      setError(message)
      toast.error(message)
      setSignupLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      <Card className="w-full max-w-md relative backdrop-blur-sm bg-white/90 shadow-2xl border-0">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Welcome to WECON
          </CardTitle>
          <CardDescription>
            Sign in to your account or create a new one
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="you@example.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="pl-10"
                      required
                      disabled={loginLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="pl-10"
                      required
                      disabled={loginLoading}
                    />
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="border-green-200 bg-green-50 text-green-800 animate-in fade-in slide-in-from-top-2">
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  disabled={loginLoading}
                >
                  {loginLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>

                <div className="text-center text-sm">
                  <a href="/auth/forgot-password" className="text-blue-600 hover:text-blue-700 hover:underline">
                    Forgot password?
                  </a>
                </div>
              </form>
            </TabsContent>

            {/* Signup Tab */}
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="John Doe"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      className="pl-10"
                      required
                      disabled={signupLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="you@example.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      className="pl-10"
                      required
                      disabled={signupLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      className="pl-10"
                      required
                      disabled={signupLoading}
                      minLength={6}
                    />
                  </div>
                  <p className="text-xs text-slate-500">Must be at least 6 characters</p>
                </div>

                {error && (
                  <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="border-green-200 bg-green-50 text-green-800 animate-in fade-in slide-in-from-top-2">
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  disabled={signupLoading}
                >
                  {signupLoading ? (
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
        </CardContent>

        <CardFooter className="flex flex-col space-y-2 text-center text-xs text-slate-500">
          <p>By continuing, you agree to our Terms of Service and Privacy Policy</p>
        </CardFooter>
      </Card>
    </div>
  )
}

