'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Users, Search, Filter, Download, Mail, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'
import { format } from 'date-fns'

interface Attendee {
  id: string
  email: string
  full_name: string
  company: string | null
  job_title: string | null
  phone: string | null
  role: string
  created_at: string
  total_tickets: number
  checked_in_count: number
}

export function AttendeesContent() {
  const [attendees, setAttendees] = useState<Attendee[]>([])
  const [filteredAttendees, setFilteredAttendees] = useState<Attendee[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')

  useEffect(() => {
    fetchAttendees()
  }, [])

  useEffect(() => {
    filterAttendees()
  }, [attendees, searchQuery, roleFilter])

  const fetchAttendees = async () => {
    try {
      console.log('👥 Fetching all attendees...')
      const supabase = createClient()

      // Fetch profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('em_profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (profilesError) {
        console.error('❌ Error fetching profiles:', profilesError)
        toast.error('Failed to load attendees')
        return
      }

      // Fetch ticket counts for each attendee
      const attendeesWithStats = await Promise.all(
        (profiles || []).map(async (profile: any) => {
          const { data: tickets } = await supabase
            .from('em_tickets')
            .select('id, check_in_logs(checked_in_at)')
            .eq('user_id', profile.id)

          const totalTickets = tickets?.length || 0
          const checkedInCount = tickets?.filter((t: any) => t.check_in_logs && t.check_in_logs.length > 0).length || 0

          return {
            id: profile.id,
            email: profile.email || 'N/A',
            full_name: profile.full_name || 'N/A',
            company: profile.company,
            job_title: profile.job_title,
            phone: profile.phone,
            role: profile.role || 'attendee',
            created_at: profile.created_at,
            total_tickets: totalTickets,
            checked_in_count: checkedInCount
          }
        })
      )

      console.log('✅ Loaded attendees:', attendeesWithStats.length)
      setAttendees(attendeesWithStats)
    } catch (err) {
      console.error('❌ Unexpected error:', err)
      toast.error('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const filterAttendees = () => {
    let filtered = [...attendees]

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(attendee =>
        attendee.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        attendee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (attendee.company && attendee.company.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Apply role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(attendee => attendee.role === roleFilter)
    }

    setFilteredAttendees(filtered)
  }

  const handleDeleteAttendee = async (attendeeId: string) => {
    if (!confirm('Are you sure you want to delete this attendee? This action cannot be undone.')) return

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('em_profiles')
        .delete()
        .eq('id', attendeeId)

      if (error) throw error

      toast.success('Attendee deleted successfully')
      fetchAttendees()
    } catch (err) {
      console.error('❌ Error deleting attendee:', err)
      toast.error('Failed to delete attendee')
    }
  }

  const handleExportCSV = () => {
    toast.info('CSV export feature coming soon!')
  }

  const handleBulkEmail = () => {
    toast.info('Bulk email feature coming soon!')
  }

  if (loading) {
    return (
      <div className="space-y-[24px] mt-[28px]">
        {[1, 2, 3, 4].map(i => (
          <Skeleton key={i} className="h-[100px] w-full rounded-[20px]" />
        ))}
      </div>
    )
  }

  const totalAttendees = attendees.length
  const totalCheckedIn = attendees.reduce((sum, a) => sum + a.checked_in_count, 0)
  const totalTickets = attendees.reduce((sum, a) => sum + a.total_tickets, 0)

  return (
    <div className="mt-[28px] space-y-[24px]">
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[20px]">
        <div className="vision-glass-card p-[24px]">
          <div className="flex items-center gap-[12px] mb-[8px]">
            <Users className="h-[24px] w-[24px] text-purple-400" />
            <span className="text-[14px] text-gray-400" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
              Total Attendees
            </span>
          </div>
          <p className="text-[32px] font-bold text-white" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
            {totalAttendees}
          </p>
        </div>

        <div className="vision-glass-card p-[24px]">
          <div className="flex items-center gap-[12px] mb-[8px]">
            <CheckCircle className="h-[24px] w-[24px] text-green-400" />
            <span className="text-[14px] text-gray-400" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
              Total Check-ins
            </span>
          </div>
          <p className="text-[32px] font-bold text-white" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
            {totalCheckedIn}
          </p>
        </div>

        <div className="vision-glass-card p-[24px]">
          <div className="flex items-center gap-[12px] mb-[8px]">
            <span className="text-[24px]">🎫</span>
            <span className="text-[14px] text-gray-400" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
              Total Tickets
            </span>
          </div>
          <p className="text-[32px] font-bold text-white" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
            {totalTickets}
          </p>
        </div>
      </div>

      {/* Search, Filter, and Actions */}
      <div className="vision-glass-card p-[20px]">
        <div className="flex flex-col lg:flex-row gap-[16px]">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-[16px] top-1/2 transform -translate-y-1/2 h-[18px] w-[18px] text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-[48px] pr-[16px] py-[12px] rounded-[12px] text-sm outline-none transition-all text-white"
              style={{
                background: 'rgba(26, 31, 55, 0.5)',
                border: '2px solid #151515',
                fontFamily: '"Plus Jakarta Display", sans-serif',
              }}
            />
          </div>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-[16px] py-[12px] rounded-[12px] text-sm outline-none transition-all text-white"
            style={{
              background: 'rgba(26, 31, 55, 0.5)',
              border: '2px solid #151515',
              fontFamily: '"Plus Jakarta Display", sans-serif',
            }}
          >
            <option value="all">All Roles</option>
            <option value="attendee">Attendee</option>
            <option value="speaker">Speaker</option>
            <option value="admin">Admin</option>
          </select>

          {/* Action Buttons */}
          <div className="flex gap-[12px]">
            <button
              onClick={handleExportCSV}
              className="px-[16px] py-[12px] rounded-[12px] text-sm font-medium transition-all flex items-center gap-[8px]"
              style={{
                background: 'linear-gradient(135deg, #7928CA 0%, #4318FF 100%)',
                color: '#fff',
              }}
            >
              <Download className="h-[16px] w-[16px]" />
              Export CSV
            </button>
            <button
              onClick={handleBulkEmail}
              className="px-[16px] py-[12px] rounded-[12px] text-sm font-medium transition-all flex items-center gap-[8px]"
              style={{
                background: 'rgba(26, 31, 55, 0.5)',
                border: '2px solid #151515',
                color: '#fff',
              }}
            >
              <Mail className="h-[16px] w-[16px]" />
              Bulk Email
            </button>
          </div>
        </div>
      </div>

      {/* Attendees Table */}
      {filteredAttendees.length === 0 ? (
        <div className="vision-glass-card p-[48px] text-center">
          <Users className="h-[64px] w-[64px] text-gray-400 mx-auto mb-[16px]" />
          <h3 className="text-[20px] font-bold text-white mb-[8px]" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
            No Attendees Found
          </h3>
          <p className="text-[14px] text-gray-400" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
            {searchQuery || roleFilter !== 'all'
              ? 'Try adjusting your search or filters'
              : 'No attendees registered yet'}
          </p>
        </div>
      ) : (
        <div className="vision-glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left p-[16px] text-[14px] font-medium text-gray-400" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
                    Name
                  </th>
                  <th className="text-left p-[16px] text-[14px] font-medium text-gray-400" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
                    Email
                  </th>
                  <th className="text-left p-[16px] text-[14px] font-medium text-gray-400" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
                    Company
                  </th>
                  <th className="text-left p-[16px] text-[14px] font-medium text-gray-400" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
                    Role
                  </th>
                  <th className="text-left p-[16px] text-[14px] font-medium text-gray-400" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
                    Tickets
                  </th>
                  <th className="text-left p-[16px] text-[14px] font-medium text-gray-400" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
                    Check-ins
                  </th>
                  <th className="text-left p-[16px] text-[14px] font-medium text-gray-400" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
                    Joined
                  </th>
                  <th className="text-left p-[16px] text-[14px] font-medium text-gray-400" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAttendees.map((attendee) => (
                  <tr key={attendee.id} className="border-b border-gray-800 hover:bg-white/5 transition-all">
                    <td className="p-[16px]">
                      <div>
                        <p className="text-[14px] font-medium text-white" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
                          {attendee.full_name}
                        </p>
                        {attendee.job_title && (
                          <p className="text-[12px] text-gray-400">{attendee.job_title}</p>
                        )}
                      </div>
                    </td>
                    <td className="p-[16px] text-[14px] text-gray-300">{attendee.email}</td>
                    <td className="p-[16px] text-[14px] text-gray-300">{attendee.company || 'N/A'}</td>
                    <td className="p-[16px]">
                      <span className="px-[12px] py-[4px] rounded-[8px] text-[12px] font-medium bg-purple-500/20 text-purple-300 capitalize">
                        {attendee.role}
                      </span>
                    </td>
                    <td className="p-[16px] text-[14px] text-gray-300">{attendee.total_tickets}</td>
                    <td className="p-[16px] text-[14px] text-gray-300">{attendee.checked_in_count}</td>
                    <td className="p-[16px] text-[14px] text-gray-300">
                      {format(new Date(attendee.created_at), 'MMM dd, yyyy')}
                    </td>
                    <td className="p-[16px]">
                      <div className="flex gap-[8px]">
                        <button
                          onClick={() => toast.info('Edit feature coming soon!')}
                          className="p-[8px] rounded-[8px] hover:bg-white/10 transition-all"
                          title="Edit"
                        >
                          <Edit className="h-[16px] w-[16px] text-blue-400" />
                        </button>
                        <button
                          onClick={() => handleDeleteAttendee(attendee.id)}
                          className="p-[8px] rounded-[8px] hover:bg-white/10 transition-all"
                          title="Delete"
                        >
                          <Trash2 className="h-[16px] w-[16px] text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

