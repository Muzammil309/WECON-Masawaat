import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Compute role-based default redirect
      let defaultNext = '/dashboard'
      try {
        const { data: userRes } = await supabase.auth.getUser()
        const userId = userRes?.user?.id
        if (userId) {
          const { data: profile } = await (supabase as any)
            .from('em_profiles')
            .select('role')
            .eq('id', userId)
            .maybeSingle()
          if ((profile as any)?.role === 'admin') {
            defaultNext = '/admin'
          }
        }
      } catch (e) {
        // ignore and use default attendee dashboard
      }

      // if "next" is in param, use it as the redirect URL; else role-based default
      const next = searchParams.get('next') ?? defaultNext

      const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === 'development'
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}


export async function POST(request: Request) {
  try {
    const { access_token, refresh_token } = await request.json()
    if (!access_token || !refresh_token) {
      return NextResponse.json({ ok: false, error: 'Missing tokens' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data, error } = await supabase.auth.setSession({ access_token, refresh_token })
    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 400 })
    }
    return NextResponse.json({ ok: true, user: !!data?.user, expires_at: data?.session?.expires_at ?? null })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'Unknown error' }, { status: 500 })
  }
}
