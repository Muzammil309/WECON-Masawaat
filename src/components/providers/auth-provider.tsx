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

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()

        if (sessionError) {
          console.error('Session error:', sessionError)
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
        }

        // fetch role from em_profiles
        if (authUser && mounted) {
          try {
            const { data, error } = await supabase
              .from('em_profiles')
              .select('role')
              .eq('id', authUser.id)
              .maybeSingle()

            if (mounted) {
              if (!error && data) {
                setRole((data.role as any) ?? 'attendee')
              } else {
                setRole('attendee')
              }
            }
          } catch (e) {
            console.error('Role fetch error:', e)
            if (mounted) {
              setRole('attendee')
            }
          }
        } else if (mounted) {
          setRole(null)
        }
      } catch (error) {
        console.error('Failed to get initial session:', error)
        if (mounted) {
          setUser(null)
          setRole(null)
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event: any, session: any) => {
        if (!mounted) return

        const authUser = session?.user ?? null
        setUser(authUser)
        setLoading(false)

        if (authUser) {
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
            if (upsertError) console.error('Error creating/updating profile:', upsertError)
          } catch (error) {
            console.error('Failed to create/update profile:', error)
          }

          // Load role
          try {
            const { data, error } = await supabase
              .from('em_profiles')
              .select('role')
              .eq('id', authUser.id)
              .maybeSingle()
            if (mounted) {
              if (!error && data) {
                setRole((data.role as any) ?? 'attendee')
              } else {
                setRole('attendee')
              }
            }
          } catch (e) {
            console.error('Role fetch error:', e)
            if (mounted) {
              setRole('attendee')
            }
          }
        } else if (mounted) {
          setRole(null)
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
