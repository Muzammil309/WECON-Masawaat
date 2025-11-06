'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/providers/auth-provider'
import { User, Mail, Phone, MapPin, Calendar, Save, Upload, Camera } from 'lucide-react'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'

interface ProfileData {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  avatar_url: string | null
  role: string
  created_at: string
  bio: string | null
  location: string | null
  company: string | null
  job_title: string | null
}

export function ProfileContent() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    bio: '',
    location: '',
    company: '',
    job_title: ''
  })

  useEffect(() => {
    if (user) {
      fetchProfile()
    }
  }, [user])

  const fetchProfile = async () => {
    try {
      console.log('👤 Fetching profile for user:', user?.id)
      const supabase = createClient()

      const { data, error } = await supabase
        .from('em_profiles')
        .select('*')
        .eq('id', user?.id)
        .single()

      if (error) {
        console.error('❌ Error fetching profile:', error)
        toast.error('Failed to load profile')
        return
      }

      console.log('✅ Profile loaded:', data)
      setProfile(data)
      setFormData({
        full_name: data.full_name || '',
        phone: data.phone || '',
        bio: data.bio || '',
        location: data.location || '',
        company: data.company || '',
        job_title: data.job_title || ''
      })
    } catch (err) {
      console.error('❌ Unexpected error:', err)
      toast.error('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const supabase = createClient()

      const { error } = await supabase
        .from('em_profiles')
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
          bio: formData.bio,
          location: formData.location,
          company: formData.company,
          job_title: formData.job_title
        })
        .eq('id', user?.id)

      if (error) throw error

      toast.success('Profile updated successfully!')
      fetchProfile()
    } catch (err) {
      console.error('❌ Error saving profile:', err)
      toast.error('Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-[24px] mt-[28px]">
        <Skeleton className="h-[200px] w-full rounded-[20px]" />
        <Skeleton className="h-[400px] w-full rounded-[20px]" />
      </div>
    )
  }

  return (
    <div className="mt-[28px] space-y-[24px]">
      {/* Profile Header */}
      <div className="vision-glass-card p-[32px]">
        <div className="flex flex-col md:flex-row items-center gap-[24px]">
          {/* Avatar */}
          <div className="relative">
            <div className="w-[120px] h-[120px] rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white text-[48px] font-bold">
              {profile?.full_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <button className="absolute bottom-0 right-0 w-[36px] h-[36px] rounded-full bg-purple-600 flex items-center justify-center hover:bg-purple-700 transition-colors">
              <Camera className="h-[18px] w-[18px] text-white" />
            </button>
          </div>

          {/* User Info */}
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-[28px] font-bold text-white mb-[8px]" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
              {profile?.full_name || 'Complete Your Profile'}
            </h2>
            <div className="flex flex-col md:flex-row items-center gap-[16px] text-[14px] text-gray-300">
              <div className="flex items-center gap-[8px]">
                <Mail className="h-[16px] w-[16px]" />
                <span>{user?.email}</span>
              </div>
              <div className="flex items-center gap-[8px]">
                <User className="h-[16px] w-[16px]" />
                <span className="px-[12px] py-[4px] rounded-[8px] bg-purple-500/20 text-purple-300 font-medium capitalize">
                  {profile?.role || 'attendee'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <div className="vision-glass-card p-[32px]">
        <h3 className="text-[20px] font-bold text-white mb-[24px]" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
          Personal Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
          {/* Full Name */}
          <div>
            <label className="block text-[14px] text-gray-300 mb-[8px]" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
              Full Name
            </label>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              placeholder="Enter your full name"
              className="w-full px-[16px] py-[12px] rounded-[12px] text-sm outline-none transition-all text-white"
              style={{
                background: 'rgba(26, 31, 55, 0.5)',
                border: '2px solid #151515',
                fontFamily: '"Plus Jakarta Display", sans-serif',
              }}
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-[14px] text-gray-300 mb-[8px]" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+92 300 1234567"
              className="w-full px-[16px] py-[12px] rounded-[12px] text-sm outline-none transition-all text-white"
              style={{
                background: 'rgba(26, 31, 55, 0.5)',
                border: '2px solid #151515',
                fontFamily: '"Plus Jakarta Display", sans-serif',
              }}
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-[14px] text-gray-300 mb-[8px]" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
              Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="City, Country"
              className="w-full px-[16px] py-[12px] rounded-[12px] text-sm outline-none transition-all text-white"
              style={{
                background: 'rgba(26, 31, 55, 0.5)',
                border: '2px solid #151515',
                fontFamily: '"Plus Jakarta Display", sans-serif',
              }}
            />
          </div>

          {/* Company */}
          <div>
            <label className="block text-[14px] text-gray-300 mb-[8px]" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
              Company
            </label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              placeholder="Your company name"
              className="w-full px-[16px] py-[12px] rounded-[12px] text-sm outline-none transition-all text-white"
              style={{
                background: 'rgba(26, 31, 55, 0.5)',
                border: '2px solid #151515',
                fontFamily: '"Plus Jakarta Display", sans-serif',
              }}
            />
          </div>

          {/* Job Title */}
          <div className="md:col-span-2">
            <label className="block text-[14px] text-gray-300 mb-[8px]" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
              Job Title
            </label>
            <input
              type="text"
              value={formData.job_title}
              onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
              placeholder="Your job title"
              className="w-full px-[16px] py-[12px] rounded-[12px] text-sm outline-none transition-all text-white"
              style={{
                background: 'rgba(26, 31, 55, 0.5)',
                border: '2px solid #151515',
                fontFamily: '"Plus Jakarta Display", sans-serif',
              }}
            />
          </div>

          {/* Bio */}
          <div className="md:col-span-2">
            <label className="block text-[14px] text-gray-300 mb-[8px]" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
              Bio
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Tell us about yourself..."
              rows={4}
              className="w-full px-[16px] py-[12px] rounded-[12px] text-sm outline-none transition-all text-white resize-none"
              style={{
                background: 'rgba(26, 31, 55, 0.5)',
                border: '2px solid #151515',
                fontFamily: '"Plus Jakarta Display", sans-serif',
              }}
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-[24px] flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-[24px] py-[12px] rounded-[12px] text-[14px] font-semibold transition-all flex items-center gap-[8px] disabled:opacity-50"
            style={{
              background: 'linear-gradient(135deg, #7928CA 0%, #4318FF 100%)',
              color: '#fff',
              fontFamily: '"Plus Jakarta Display", sans-serif',
            }}
          >
            <Save className="h-[16px] w-[16px]" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Account Info */}
      <div className="vision-glass-card p-[32px]">
        <h3 className="text-[20px] font-bold text-white mb-[24px]" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
          Account Information
        </h3>

        <div className="space-y-[16px]">
          <div className="flex items-center justify-between py-[12px] border-b border-white/10">
            <span className="text-[14px] text-gray-400">Email Address</span>
            <span className="text-[14px] text-white">{user?.email}</span>
          </div>
          <div className="flex items-center justify-between py-[12px] border-b border-white/10">
            <span className="text-[14px] text-gray-400">Account Type</span>
            <span className="text-[14px] text-white capitalize">{profile?.role || 'attendee'}</span>
          </div>
          <div className="flex items-center justify-between py-[12px]">
            <span className="text-[14px] text-gray-400">Member Since</span>
            <span className="text-[14px] text-white">
              {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
