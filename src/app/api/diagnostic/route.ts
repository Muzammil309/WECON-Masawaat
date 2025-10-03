import { NextResponse } from 'next/server'

export async function GET() {
  // Check if environment variables are accessible
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  const diagnostics = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    vercel: {
      region: process.env.VERCEL_REGION || 'unknown',
      env: process.env.VERCEL_ENV || 'unknown',
    },
    supabase: {
      url: {
        configured: !!supabaseUrl,
        value: supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'NOT_SET',
        length: supabaseUrl?.length || 0,
      },
      anonKey: {
        configured: !!supabaseAnonKey,
        length: supabaseAnonKey?.length || 0,
        prefix: supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'NOT_SET',
      },
      serviceRoleKey: {
        configured: !!serviceRoleKey,
        length: serviceRoleKey?.length || 0,
      },
    },
    status: {
      ready: !!(supabaseUrl && supabaseAnonKey),
      message: !!(supabaseUrl && supabaseAnonKey) 
        ? 'All environment variables are configured correctly' 
        : 'Environment variables are missing or not deployed',
    },
    nextSteps: !!(supabaseUrl && supabaseAnonKey) 
      ? [
          'Environment variables are configured correctly',
          'If login still fails, check browser console for errors',
          'Verify Supabase redirect URLs are configured',
          'Check Supabase project status',
        ]
      : [
          'Environment variables are NOT deployed',
          'Go to Vercel Dashboard → Settings → Environment Variables',
          'Verify all 3 variables are listed',
          'Click "Redeploy" on the latest deployment',
          'Wait 2-3 minutes for deployment to complete',
          'Refresh this page to verify',
        ],
  }

  return NextResponse.json(diagnostics, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  })
}

