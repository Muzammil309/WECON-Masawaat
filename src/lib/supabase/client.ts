import { createBrowserClient } from '@supabase/ssr'

export function isSupabaseConfigured() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Debug logging for production troubleshooting
  if (typeof window !== 'undefined') {
    console.log('Supabase Config Check:', {
      hasUrl: !!url,
      hasKey: !!key,
      urlPrefix: url ? url.substring(0, 20) + '...' : 'undefined',
      keyPrefix: key ? key.substring(0, 20) + '...' : 'undefined'
    })
  }

  return Boolean(url && key)
}

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Enhanced debugging for production
  if (typeof window !== 'undefined') {
    console.log('Creating Supabase client:', {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseAnonKey,
      url: supabaseUrl,
      keyLength: supabaseAnonKey?.length || 0
    })
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase environment variables are not configured. Some features may not work.')
    console.warn('Missing:', {
      url: !supabaseUrl,
      key: !supabaseAnonKey
    })

    // Return a mock client for build/prerender scenarios
    return {
      auth: {
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signOut: () => Promise.resolve({ error: null }),
        signInWithPassword: () => Promise.resolve({ data: { user: null, session: null }, error: new Error('Supabase not configured') }),
        signUp: () => Promise.resolve({ data: { user: null, session: null }, error: new Error('Supabase not configured') }),
        signInWithOAuth: () => Promise.resolve({ data: { user: null, session: null }, error: new Error('Supabase not configured') }),
        getUser: () => Promise.resolve({ data: { user: null }, error: new Error('Supabase not configured') }),
      },
      from: () => ({
        select: () => ({ data: [], error: null }),
        insert: () => ({ data: null, error: new Error('Supabase not configured') }),
        update: () => ({ data: null, error: new Error('Supabase not configured') }),
        delete: () => ({ data: null, error: new Error('Supabase not configured') }),
        upsert: () => ({ select: () => ({ data: null, error: new Error('Supabase not configured') }) }),
        eq: () => ({ maybeSingle: () => ({ data: null, error: new Error('Supabase not configured') }) }),
        maybeSingle: () => ({ data: null, error: new Error('Supabase not configured') }),
      }),
    } as any
  }

  try {
    const client = createBrowserClient(supabaseUrl, supabaseAnonKey)
    if (typeof window !== 'undefined') {
      console.log('Supabase client created successfully')
    }
    return client
  } catch (error) {
    console.error('Failed to create Supabase client:', error)
    throw error
  }
}
