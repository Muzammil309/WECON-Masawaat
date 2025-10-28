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

      {/* Sign Up Card */}
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
        <form onSubmit={handleSignUp} className="space-y-6">
          {/* Name Field */}
          <div>
            <label 
              htmlFor="name" 
              className="block text-sm font-medium mb-2"
              style={{ color: '#FFFFFF' }}
            >
              Name
            </label>
            <div className="relative">
              <User 
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5"
                style={{ color: '#A0AEC0' }}
              />
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
                placeholder="Your full name"
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
                minLength={6}
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

          {/* Sign Up Button */}
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
                Creating account...
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
              className="font-medium hover:underline"
              style={{ color: '#4318FF' }}
            >
              Sign in
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

