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

      // Reset loading state before redirect
      setLoading(false)

      // Small delay to show success message
      await new Promise(resolve => setTimeout(resolve, 500))

      // Perform redirect
      console.log('🔐 [VISION AUTH] Redirecting to dashboard...')
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
      className="h-screen flex relative"
      style={{
        fontFamily: '"Plus Jakarta Display", sans-serif',
        background: '#0F1535',
        overflow: 'hidden'
      }}
    >
      {/* Left Side - Image Section */}
      <div
        className="hidden lg:flex lg:w-1/2 relative items-center justify-center"
        style={{
          background: '#4FD1C5',
          height: '100vh'
        }}
      >
        {/* Background Image with Gradient Overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(/images/auth-background.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle at center, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0) 100%)'
            }}
          />
        </div>

        {/* Text Content */}
        <div className="relative z-10 text-center px-12">
          <p
            className="text-white mb-4"
            style={{
              fontSize: '20px',
              letterSpacing: '3.6px',
              fontWeight: 400
            }}
          >
            INSPIRED BY THE FUTURE:
          </p>
          <h1
            className="font-bold"
            style={{
              fontSize: '36px',
              letterSpacing: '6.48px',
              background: 'linear-gradient(135deg, #FFFFFF 0%, #5CE1CA 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            WECON MASAWAAT
          </h1>
        </div>
      </div>

      {/* Right Side - Form Section */}
      <div
        className="w-full lg:w-1/2 flex items-center justify-center p-8 relative overflow-y-auto"
        style={{
          background: '#0F1535',
          height: '100vh'
        }}
      >
        {/* Form Container */}
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-12">
            <p
              className="font-medium"
              style={{
                fontSize: '14px',
                letterSpacing: '2.52px',
                background: 'linear-gradient(135deg, #FFFFFF 0%, #5CE1CA 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              VISION UI FREE
            </p>
          </div>

          {/* Title */}
          <div className="mb-8">
            <h1
              className="text-3xl font-bold mb-2"
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
          <form onSubmit={handleSignIn} className="space-y-5">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-2"
                style={{ color: '#FFFFFF' }}
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                placeholder="Your email address"
                className="w-full px-5 py-3 rounded-[20px] text-sm outline-none transition-all"
                style={{
                  background: 'rgba(26, 31, 55, 0.5)',
                  border: '2px solid #151515',
                  color: '#FFFFFF',
                  fontFamily: '"Plus Jakarta Display", sans-serif',
                  backdropFilter: 'blur(21px)',
                  WebkitBackdropFilter: 'blur(21px)'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#7928CA'
                  e.target.style.boxShadow = '0 0 0 3px rgba(121, 40, 202, 0.1)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#151515'
                  e.target.style.boxShadow = 'none'
                }}
              />
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
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                placeholder="Your password"
                className="w-full px-5 py-3 rounded-[20px] text-sm outline-none transition-all"
                style={{
                  background: 'rgba(26, 31, 55, 0.5)',
                  border: '2px solid #151515',
                  color: '#FFFFFF',
                  fontFamily: '"Plus Jakarta Display", sans-serif',
                  backdropFilter: 'blur(21px)',
                  WebkitBackdropFilter: 'blur(21px)'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#7928CA'
                  e.target.style.boxShadow = '0 0 0 3px rgba(121, 40, 202, 0.1)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#151515'
                  e.target.style.boxShadow = 'none'
                }}
              />
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded"
                  style={{
                    accentColor: '#5CE1CA'
                  }}
                />
                <span className="text-sm" style={{ color: '#A0AEC0' }}>
                  Remember me
                </span>
              </label>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2"
              style={{
                background: loading ? 'linear-gradient(135deg, #7928CA 0%, #4318FF 100%)' : 'linear-gradient(135deg, #7928CA 0%, #4318FF 100%)',
                color: '#FFFFFF',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                letterSpacing: '1px'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 10px 20px rgba(92, 225, 202, 0.3)'
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }
              }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  SIGNING IN...
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
                className="font-bold hover:underline"
                style={{ color: '#5CE1CA' }}
              >
                Sign up
              </Link>
            </p>
          </div>

          {/* Footer */}
          <div className="mt-12">
            <div className="flex items-center justify-center gap-6 mb-4">
              <Link
                href="#"
                className="text-sm hover:underline"
                style={{ color: '#A0AEC0' }}
              >
                Marketplace
              </Link>
              <Link
                href="#"
                className="text-sm hover:underline"
                style={{ color: '#A0AEC0' }}
              >
                Blog
              </Link>
              <Link
                href="#"
                className="text-sm hover:underline"
                style={{ color: '#A0AEC0' }}
              >
                License
              </Link>
            </div>
            <p className="text-xs text-center" style={{ color: '#A0AEC0' }}>
              <span>@ 2021, Made with ❤️ by </span>
              <span className="font-medium">Simmmple & Creative Tim</span>
              <span> for a better web</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

