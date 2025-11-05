'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Mail, Lock, User, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

export function VisionSignUp() {
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    console.log('🔐 [VISION AUTH] Sign Up started')

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      })

      if (error) {
        console.error('🔐 [VISION AUTH] Sign Up error:', error.message)
        
        // Check if user already exists
        if (error.message.includes('User already registered') || error.message.includes('already registered')) {
          // Check if user is now authenticated
          const { data: sessionData } = await supabase.auth.getSession()
          
          if (sessionData?.session?.user) {
            console.log('🔐 [VISION AUTH] User already exists and is authenticated, redirecting')
            toast.success('Welcome back! Redirecting to dashboard...')

            // Reset loading state before redirect
            setLoading(false)

            // Small delay to show success message
            await new Promise(resolve => setTimeout(resolve, 500))

            // Perform redirect
            console.log('🔐 [VISION AUTH] Redirecting to dashboard...')
            router.push('/dashboard/vision')
            return
          } else {
            setError('An account with this email already exists. Please sign in instead.')
            toast.error('Account already exists. Please sign in.')
            setLoading(false)
            return
          }
        }
        
        setError(error.message)
        toast.error(error.message)
        setLoading(false)
        return
      }

      console.log('🔐 [VISION AUTH] Sign Up successful!')
      
      // Check if user is immediately authenticated (email confirmation disabled)
      if (data.session) {
        console.log('🔐 [VISION AUTH] User authenticated immediately, redirecting')
        toast.success('Account created! Redirecting to dashboard...')

        // Reset loading state before redirect
        setLoading(false)

        // Small delay to show success message
        await new Promise(resolve => setTimeout(resolve, 500))

        // Perform redirect
        console.log('🔐 [VISION AUTH] Redirecting to dashboard...')
        router.push('/dashboard/vision')
        return
      }
      
      // Email confirmation required
      setSuccess('Account created! Please check your email to verify your account.')
      toast.success('Account created! Check your email to verify.')
      setLoading(false)
      
      // Clear form
      setName('')
      setEmail('')
      setPassword('')
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
              Welcome!
            </h1>
            <p
              className="text-sm"
              style={{ color: '#A0AEC0' }}
            >
              Use these awesome forms to create a new account
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

          {/* Success Alert */}
          {success && (
            <div
              className="mb-6 p-4 rounded-lg flex items-start gap-3"
              style={{
                background: 'rgba(1, 181, 116, 0.1)',
                border: '1px solid rgba(1, 181, 116, 0.3)'
              }}
            >
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: '#01B574' }} />
              <p className="text-sm" style={{ color: '#01B574' }}>{success}</p>
            </div>
          )}

          {/* Sign Up Form */}
          <form onSubmit={handleSignUp} className="space-y-5">
            {/* Name Field */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium mb-2"
                style={{ color: '#FFFFFF' }}
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
                placeholder="Your full name"
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
                minLength={6}
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

            {/* Terms Checkbox */}
            <div className="flex items-start">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  className="w-4 h-4 rounded mt-0.5"
                  style={{
                    accentColor: '#5CE1CA'
                  }}
                />
                <span className="text-xs" style={{ color: '#A0AEC0' }}>
                  I agree to the{' '}
                  <Link href="#" className="font-medium" style={{ color: '#5CE1CA' }}>
                    Terms and Conditions
                  </Link>
                </span>
              </label>
            </div>

            {/* Sign Up Button */}
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
                  CREATING ACCOUNT...
                </>
              ) : (
                'SIGN UP'
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="mt-8 text-center">
            <p className="text-sm" style={{ color: '#A0AEC0' }}>
              Already have an account?{' '}
              <Link
                href="/auth/login"
                className="font-bold hover:underline"
                style={{ color: '#5CE1CA' }}
              >
                Sign in
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

