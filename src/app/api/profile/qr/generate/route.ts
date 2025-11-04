import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import QRCode from 'qrcode'

// POST /api/profile/qr/generate - Generate or regenerate profile QR code
export async function POST(request: NextRequest) {
  try {
    console.log('📡 POST /api/profile/qr/generate - Request received')
    const supabase = await createClient()

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      console.error('❌ Authentication failed:', authError?.message)
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('✅ User authenticated:', user.id)

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('em_profiles')
      .select('id, profile_qr_code, full_name, email')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      console.error('❌ Profile not found:', profileError?.message)
      return NextResponse.json(
        { success: false, error: 'Profile not found' },
        { status: 404 }
      )
    }

    // Generate QR code data
    const qrData = {
      type: 'profile',
      user_id: user.id,
      timestamp: new Date().toISOString(),
    }

    const qrCodeString = JSON.stringify(qrData)

    // Update profile with new QR code
    const { error: updateError } = await supabase
      .from('em_profiles')
      .update({ profile_qr_code: qrCodeString })
      .eq('id', user.id)

    if (updateError) {
      console.error('❌ Error updating profile QR code:', updateError)
      return NextResponse.json(
        { success: false, error: 'Failed to update profile QR code' },
        { status: 500 }
      )
    }

    // Generate QR code image (base64)
    const qrCodeImage = await QRCode.toDataURL(qrCodeString, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      width: 512,
      margin: 2,
    })

    console.log('✅ Profile QR code generated successfully')

    return NextResponse.json({
      success: true,
      data: {
        qr_code: qrCodeString,
        qr_code_image: qrCodeImage,
        user: {
          id: profile.id,
          full_name: profile.full_name,
          email: profile.email,
        },
      },
      message: 'Profile QR code generated successfully',
    })
  } catch (error) {
    console.error('❌ POST /api/profile/qr/generate error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate profile QR code',
      },
      { status: 500 }
    )
  }
}

// GET /api/profile/qr/generate - Get current profile QR code
export async function GET(request: NextRequest) {
  try {
    console.log('📡 GET /api/profile/qr/generate - Request received')
    const supabase = await createClient()

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      console.error('❌ Authentication failed:', authError?.message)
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('✅ User authenticated:', user.id)

    // Get user profile with QR code
    const { data: profile, error: profileError } = await supabase
      .from('em_profiles')
      .select('id, profile_qr_code, full_name, email, avatar_url')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      console.error('❌ Profile not found:', profileError?.message)
      return NextResponse.json(
        { success: false, error: 'Profile not found' },
        { status: 404 }
      )
    }

    // If no QR code exists, generate one
    if (!profile.profile_qr_code) {
      console.log('⚠️ No QR code found, generating new one')
      
      const qrData = {
        type: 'profile',
        user_id: user.id,
        timestamp: new Date().toISOString(),
      }

      const qrCodeString = JSON.stringify(qrData)

      const { error: updateError } = await supabase
        .from('em_profiles')
        .update({ profile_qr_code: qrCodeString })
        .eq('id', user.id)

      if (updateError) {
        console.error('❌ Error updating profile QR code:', updateError)
      } else {
        profile.profile_qr_code = qrCodeString
      }
    }

    // Generate QR code image from stored string
    const qrCodeImage = await QRCode.toDataURL(profile.profile_qr_code, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      width: 512,
      margin: 2,
    })

    console.log('✅ Profile QR code retrieved successfully')

    return NextResponse.json({
      success: true,
      data: {
        qr_code: profile.profile_qr_code,
        qr_code_image: qrCodeImage,
        user: {
          id: profile.id,
          full_name: profile.full_name,
          email: profile.email,
          avatar_url: profile.avatar_url,
        },
      },
    })
  } catch (error) {
    console.error('❌ GET /api/profile/qr/generate error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to retrieve profile QR code',
      },
      { status: 500 }
    )
  }
}

