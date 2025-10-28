'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  loading: boolean
  role: 'admin' | 'speaker' | 'attendee' | null
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  role: null,
  signOut: async () => {},
})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [role, setRole] = useState<'admin' | 'speaker' | 'attendee' | null>(null)

  useEffect(() => {
    let mounted = true
    const supabase = createClient()

    console.log('🔐 AuthProvider: Initializing...')

    // Get initial session
    const getInitialSession = async () => {
      try {
        console.log('🔐 AuthProvider: Fetching initial session...')
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()

        console.log('🔐 AuthProvider: Session fetch result:', {
          hasSession: !!session,
          hasUser: !!session?.user,
          error: sessionError ? sessionError.message : 'none'
        })

        if (sessionError) {
          console.error('❌ AuthProvider: Session error:', sessionError)
          if (mounted) {
            setUser(null)
            setRole(null)
            setLoading(false)
          }
          return
        }

        const authUser = session?.user ?? null

        if (mounted) {
          setUser(authUser)
          console.log('🔐 AuthProvider: User set:', authUser ? `ID: ${authUser.id}` : 'null')
        }

        // fetch role from em_profiles
        if (authUser && mounted) {
          try {
            console.log('🔐 AuthProvider: Fetching role for user:', authUser.id)
            const { data, error } = await supabase
              .from('em_profiles')
              .select('role')
              .eq('id', authUser.id)
              .maybeSingle()

            console.log('🔐 AuthProvider: Role fetch result:', {
              role: data?.role,
              error: error ? error.message : 'none'
            })

            if (mounted) {
              if (!error && data) {
                const userRole = (data.role as any) ?? 'attendee'
                setRole(userRole)
                console.log('✅ AuthProvider: Role set to:', userRole)
              } else {
                setRole('attendee')
                console.log('⚠️ AuthProvider: No role found, defaulting to attendee')
              }
            }
          } catch (e) {
            console.error('❌ AuthProvider: Role fetch error:', e)
            if (mounted) {
              setRole('attendee')
              console.log('⚠️ AuthProvider: Error fetching role, defaulting to attendee')
            }
          }
        } else if (mounted) {
          setRole(null)
          console.log('🔐 AuthProvider: No user, role set to null')
        }
      } catch (error) {
        console.error('❌ AuthProvider: Failed to get initial session:', error)
        if (mounted) {
          setUser(null)
          setRole(null)
        }
      } finally {
        if (mounted) {
          setLoading(false)
          console.log('✅ AuthProvider: Loading complete, loading set to false')
        }
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: any, session: any) => {
        if (!mounted) return

        console.log('🔐 AuthProvider: Auth state changed:', event)

        const authUser = session?.user ?? null
        setUser(authUser)
        setLoading(false)
        console.log('🔐 AuthProvider: Auth change - loading set to false')

        if (authUser) {
          console.log('🔐 AuthProvider: User authenticated:', authUser.id)

          // Ensure profile row exists
          try {
            const { error: upsertError } = await supabase
              .from('em_profiles')
              .upsert({
                id: authUser.id,
                email: authUser.email!,
                full_name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || null,
                avatar_url: authUser.user_metadata?.avatar_url || null,
              })
              .select()
            if (upsertError) {
              console.error('❌ AuthProvider: Error creating/updating profile:', upsertError)
            } else {
              console.log('✅ AuthProvider: Profile upserted successfully')
            }
          } catch (error) {
            console.error('❌ AuthProvider: Failed to create/update profile:', error)
          }

          // Load role
          try {
            console.log('🔐 AuthProvider: Fetching role after auth change...')
            const { data, error } = await supabase
              .from('em_profiles')
              .select('role')
              .eq('id', authUser.id)
              .maybeSingle()
            if (mounted) {
              if (!error && data) {
                const userRole = (data.role as any) ?? 'attendee'
                setRole(userRole)
                console.log('✅ AuthProvider: Role set to:', userRole)
              } else {
                setRole('attendee')
                console.log('⚠️ AuthProvider: No role found, defaulting to attendee')
              }
            }
          } catch (e) {
            console.error('❌ AuthProvider: Role fetch error:', e)
            if (mounted) {
              setRole('attendee')
            }
          }
        } else if (mounted) {
          setRole(null)
          console.log('🔐 AuthProvider: User signed out, role set to null')
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signOut = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      // Clear user state immediately
      setUser(null)
      setRole(null)
    } catch (error) {
      console.error('Failed to sign out:', error)
    }
  }

  const value = {
    user,
    loading,
    role,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
