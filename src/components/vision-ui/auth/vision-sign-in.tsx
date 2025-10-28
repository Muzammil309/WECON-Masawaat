'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Mail, Lock, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

export function VisionSignIn() {
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    console.log('🔐 [VISION AUTH] Sign In started')

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error('🔐 [VISION AUTH] Sign In error:', error.message)
        setError(error.message)
        toast.error(error.message)
        setLoading(false)
        return
      }

      if (!data.user) {
        console.error('🔐 [VISION AUTH] No user returned')
        setError('Authentication failed')
        toast.error('Authentication failed')
        setLoading(false)
        return
      }

      console.log('🔐 [VISION AUTH] Sign In successful!')
      toast.success('Welcome back!')
      router.push('/dashboard/vision')
    } catch (err) {
      console.error('🔐 [VISION AUTH] Unexpected error:', err)
      setError('An unexpected error occurred')
      toast.error('An unexpected error occurred')
      setLoading(false)
    }
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ 
        background: '#0F1535',
        fontFamily: '"Plus Jakarta Display", sans-serif'
      }}
    >
      {/* Decorative Background */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(67, 24, 255, 0.15) 0%, transparent 50%)',
          filter: 'blur(60px)'
        }}
      />

      {/* Sign In Card */}
      <div 
        className="relative w-full max-w-md"
        style={{
          background: 'rgba(26, 31, 55, 0.7)',
          backdropFilter: 'blur(60px)',
          borderRadius: '20px',
          padding: '40px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <h1 
            className="text-2xl font-bold mb-2"
            style={{ color: '#FFFFFF' }}
          >
            Welcome Back
          </h1>
          <p 
            className="text-sm"
            style={{ color: '#A0AEC0' }}
          >
            Enter your email and password to sign in
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div 
            className="mb-6 p-4 rounded-lg flex items-start gap-3"
            style={{
              background: 'rgba(227, 26, 26, 0.1)',
              border: '1px solid rgba(227, 26, 26, 0.3)'
            }}
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ color: '#E31A1A' }} />
            <p className="text-sm" style={{ color: '#E31A1A' }}>{error}</p>
          </div>
        )}

        {/* Sign In Form */}
        <form onSubmit={handleSignIn} className="space-y-6">
          {/* Email Field */}
          <div>
            <label 
              htmlFor="email" 
              className="block text-sm font-medium mb-2"
              style={{ color: '#FFFFFF' }}
            >
              Email
            </label>
            <div className="relative">
              <Mail 
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5"
                style={{ color: '#A0AEC0' }}
              />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                placeholder="mail@simmmple.com"
                className="w-full pl-12 pr-4 py-3 rounded-lg text-sm outline-none transition-all"
                style={{
                  background: 'rgba(26, 31, 55, 0.5)',
                  border: '1px solid rgba(160, 174, 192, 0.3)',
                  color: '#FFFFFF',
                  fontFamily: '"Plus Jakarta Display", sans-serif'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#4318FF'
                  e.target.style.boxShadow = '0 0 0 3px rgba(67, 24, 255, 0.1)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(160, 174, 192, 0.3)'
                  e.target.style.boxShadow = 'none'
                }}
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label 
              htmlFor="password" 
              className="block text-sm font-medium mb-2"
              style={{ color: '#FFFFFF' }}
            >
              Password
            </label>
            <div className="relative">
              <Lock 
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5"
                style={{ color: '#A0AEC0' }}
              />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                placeholder="Min. 8 characters"
                className="w-full pl-12 pr-4 py-3 rounded-lg text-sm outline-none transition-all"
                style={{
                  background: 'rgba(26, 31, 55, 0.5)',
                  border: '1px solid rgba(160, 174, 192, 0.3)',
                  color: '#FFFFFF',
                  fontFamily: '"Plus Jakarta Display", sans-serif'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#4318FF'
                  e.target.style.boxShadow = '0 0 0 3px rgba(67, 24, 255, 0.1)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(160, 174, 192, 0.3)'
                  e.target.style.boxShadow = 'none'
                }}
              />
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                className="w-4 h-4 rounded"
                style={{
                  accentColor: '#4318FF'
                }}
              />
              <span className="text-sm" style={{ color: '#A0AEC0' }}>
                Remember me
              </span>
            </label>
            <Link 
              href="/auth/forgot-password"
              className="text-sm hover:underline"
              style={{ color: '#4318FF' }}
            >
              Forgot password?
            </Link>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2"
            style={{
              background: loading ? '#7551FF' : '#4318FF',
              color: '#FFFFFF',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.background = '#7551FF'
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 10px 20px rgba(67, 24, 255, 0.3)'
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.background = '#4318FF'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }
            }}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Signing in...
              </>
            ) : (
              'SIGN IN'
            )}
          </button>
        </form>

        {/* Sign Up Link */}
        <div className="mt-8 text-center">
          <p className="text-sm" style={{ color: '#A0AEC0' }}>
            Don't have an account?{' '}
            <Link 
              href="/auth/signup"
              className="font-medium hover:underline"
              style={{ color: '#4318FF' }}
            >
              Sign up
            </Link>
          </p>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
          <p className="text-xs text-center" style={{ color: '#718096' }}>
            © 2021, Made with ❤️ by Simmmple & Creative Tim for a better web
          </p>
        </div>
      </div>
    </div>
  )
}

