import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

// Mock client type for when Supabase is not configured
type MockSupabaseClient = any

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

export function createClient(): SupabaseClient | MockSupabaseClient {
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

    // Return a comprehensive mock client for build/prerender scenarios
    const mockQueryBuilder = {
      select: () => mockQueryBuilder,
      insert: () => mockQueryBuilder,
      update: () => mockQueryBuilder,
      delete: () => mockQueryBuilder,
      upsert: () => mockQueryBuilder,
      eq: () => mockQueryBuilder,
      neq: () => mockQueryBuilder,
      gt: () => mockQueryBuilder,
      gte: () => mockQueryBuilder,
      lt: () => mockQueryBuilder,
      lte: () => mockQueryBuilder,
      like: () => mockQueryBuilder,
      ilike: () => mockQueryBuilder,
      is: () => mockQueryBuilder,
      in: () => mockQueryBuilder,
      contains: () => mockQueryBuilder,
      containedBy: () => mockQueryBuilder,
      rangeGt: () => mockQueryBuilder,
      rangeGte: () => mockQueryBuilder,
      rangeLt: () => mockQueryBuilder,
      rangeLte: () => mockQueryBuilder,
      rangeAdjacent: () => mockQueryBuilder,
      overlaps: () => mockQueryBuilder,
      textSearch: () => mockQueryBuilder,
      match: () => mockQueryBuilder,
      not: () => mockQueryBuilder,
      or: () => mockQueryBuilder,
      filter: () => mockQueryBuilder,
      order: () => mockQueryBuilder,
      limit: () => mockQueryBuilder,
      range: () => mockQueryBuilder,
      abortSignal: () => mockQueryBuilder,
      single: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
      maybeSingle: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
      then: (resolve: any) => resolve({ data: [], error: null }),
    }

    return {
      auth: {
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signOut: () => Promise.resolve({ error: null }),
        signInWithPassword: () => Promise.resolve({ data: { user: null, session: null }, error: new Error('Supabase not configured') }),
        signUp: () => Promise.resolve({ data: { user: null, session: null }, error: new Error('Supabase not configured') }),
        signInWithOAuth: () => Promise.resolve({ data: { user: null, session: null }, error: new Error('Supabase not configured') }),
        getUser: () => Promise.resolve({ data: { user: null }, error: new Error('Supabase not configured') }),
        exchangeCodeForSession: () => Promise.resolve({ error: new Error('Supabase not configured') }),
      },
      from: () => mockQueryBuilder,
      storage: {
        from: () => ({
          list: () => Promise.resolve({ data: [], error: null }),
          upload: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
          download: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
          remove: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
          getPublicUrl: () => ({ data: { publicUrl: '' } }),
        }),
      },
      channel: () => ({
        on: () => ({ subscribe: () => {} }),
        subscribe: () => {},
        unsubscribe: () => {},
      }),
    } as MockSupabaseClient
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
