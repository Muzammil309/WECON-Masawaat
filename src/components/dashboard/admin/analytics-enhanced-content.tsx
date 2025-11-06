'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import {
  BarChart3,
  Users,
  TrendingUp,
  DollarSign,
  MapPin,
  Calendar,
  Download,
  Filter,
  Eye,
  UserCheck,
  Ticket,
  Award
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'

interface AnalyticsData {
  totalRegistrations: number
  totalRevenue: number
  totalAttendance: number
  averageRating: number
  registrationsByTerritory: { territory: string; count: number; revenue: number }[]
  registrationTrend: { date: string; count: number }[]
  sessionPopularity: { session: string; attendees: number; rating: number }[]
  revenueByCategory: { category: string; amount: number }[]
}

export function AnalyticsEnhancedContent() {
  const [loading, setLoading] = useState(false)
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalRegistrations: 0,
    totalRevenue: 0,
    totalAttendance: 0,
    averageRating: 0,
    registrationsByTerritory: [],
    registrationTrend: [],
    sessionPopularity: [],
    revenueByCategory: []
  })
  const supabase = createClient()

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      // Mock data - replace with actual Supabase queries
      const mockAnalytics: AnalyticsData = {
        totalRegistrations: 1247,
        totalRevenue: 124700,
        totalAttendance: 1089,
        averageRating: 4.6,
        registrationsByTerritory: [
          { territory: 'North America', count: 456, revenue: 45600 },
          { territory: 'Europe', count: 389, revenue: 38900 },
          { territory: 'Asia Pacific', count: 267, revenue: 26700 },
          { territory: 'Middle East', count: 135, revenue: 13500 }
        ],
        registrationTrend: [
          { date: '2025-01-01', count: 45 },
          { date: '2025-01-02', count: 67 },
          { date: '2025-01-03', count: 89 },
          { date: '2025-01-04', count: 123 },
          { date: '2025-01-05', count: 156 }
        ],
        sessionPopularity: [
          { session: 'AI in Healthcare', attendees: 345, rating: 4.8 },
          { session: 'Cloud Architecture', attendees: 289, rating: 4.6 },
          { session: 'Cybersecurity Trends', attendees: 267, rating: 4.7 },
          { session: 'Data Analytics', attendees: 234, rating: 4.5 }
        ],
        revenueByCategory: [
          { category: 'VIP Tickets', amount: 45000 },
          { category: 'Standard Tickets', amount: 35000 },
          { category: 'Sponsorships', amount: 30000 },
          { category: 'Exhibitor Booths', amount: 14700 }
        ]
      }
      setAnalytics(mockAnalytics)
    } catch (error: any) {
      console.error('Error fetching analytics:', error)
      toast.error('Failed to load analytics')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num)
  }

  return (
    <div className="space-y-[24px]">
      <Tabs defaultValue="overview" className="space-y-[24px]">
        <TabsList className="bg-white/5 border border-white/10 p-[6px] rounded-[16px] inline-flex gap-[6px]">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white text-white/60 px-[20px] py-[10px] rounded-[12px] text-[14px] font-semibold transition-all flex items-center gap-[8px]"
            style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
          >
            <BarChart3 className="h-[16px] w-[16px]" strokeWidth={2.5} />
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="registrations"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white text-white/60 px-[20px] py-[10px] rounded-[12px] text-[14px] font-semibold transition-all flex items-center gap-[8px]"
            style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
          >
            <Ticket className="h-[16px] w-[16px]" strokeWidth={2.5} />
            Registrations
          </TabsTrigger>
          <TabsTrigger
            value="attendance"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white text-white/60 px-[20px] py-[10px] rounded-[12px] text-[14px] font-semibold transition-all flex items-center gap-[8px]"
            style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
          >
            <UserCheck className="h-[16px] w-[16px]" strokeWidth={2.5} />
            Attendance
          </TabsTrigger>
          <TabsTrigger
            value="revenue"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white text-white/60 px-[20px] py-[10px] rounded-[12px] text-[14px] font-semibold transition-all flex items-center gap-[8px]"
            style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
          >
            <DollarSign className="h-[16px] w-[16px]" strokeWidth={2.5} />
            Revenue
          </TabsTrigger>
        </TabsList>




        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-[20px]">
          {/* Key Metrics */}
          <div className="grid gap-[20px] md:grid-cols-2 lg:grid-cols-4">
            <div className="vision-glass-card p-[24px]">
              <div className="flex items-center justify-between mb-[12px]">
                <div
                  className="flex items-center justify-center w-[48px] h-[48px] rounded-[12px]"
                  style={{ background: 'linear-gradient(135deg, #7928CA 0%, #4318FF 100%)' }}
                >
                  <Users className="h-[24px] w-[24px] text-white" strokeWidth={2.5} />
                </div>
                <TrendingUp className="h-[20px] w-[20px] text-green-500" />
              </div>
              <h4
                className="text-[13px] text-white/60 mb-[4px]"
                style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
              >
                Total Registrations
              </h4>
              <p
                className="text-[28px] font-bold text-white"
                style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
              >
                {formatNumber(analytics.totalRegistrations)}
              </p>
            </div>

            <div className="vision-glass-card p-[24px]">
              <div className="flex items-center justify-between mb-[12px]">
                <div
                  className="flex items-center justify-center w-[48px] h-[48px] rounded-[12px]"
                  style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)' }}
                >
                  <DollarSign className="h-[24px] w-[24px] text-white" strokeWidth={2.5} />
                </div>
                <TrendingUp className="h-[20px] w-[20px] text-green-500" />
              </div>
              <h4
                className="text-[13px] text-white/60 mb-[4px]"
                style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
              >
                Total Revenue
              </h4>
              <p
                className="text-[28px] font-bold text-white"
                style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
              >
                {formatCurrency(analytics.totalRevenue)}
              </p>
            </div>

            <div className="vision-glass-card p-[24px]">
              <div className="flex items-center justify-between mb-[12px]">
                <div
                  className="flex items-center justify-center w-[48px] h-[48px] rounded-[12px]"
                  style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)' }}
                >
                  <UserCheck className="h-[24px] w-[24px] text-white" strokeWidth={2.5} />
                </div>
                <TrendingUp className="h-[20px] w-[20px] text-green-500" />
              </div>
              <h4
                className="text-[13px] text-white/60 mb-[4px]"
                style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
              >
                Total Attendance
              </h4>
              <p
                className="text-[28px] font-bold text-white"
                style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
              >
                {formatNumber(analytics.totalAttendance)}
              </p>
            </div>

            <div className="vision-glass-card p-[24px]">
              <div className="flex items-center justify-between mb-[12px]">
                <div
                  className="flex items-center justify-center w-[48px] h-[48px] rounded-[12px]"
                  style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' }}
                >
                  <Award className="h-[24px] w-[24px] text-white" strokeWidth={2.5} />
                </div>
                <TrendingUp className="h-[20px] w-[20px] text-green-500" />
              </div>
              <h4
                className="text-[13px] text-white/60 mb-[4px]"
                style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
              >
                Average Rating
              </h4>
              <p
                className="text-[28px] font-bold text-white"
                style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
              >
                {analytics.averageRating.toFixed(1)}
              </p>
            </div>
          </div>

          {/* Territory Breakdown */}
          <div className="vision-glass-card p-[24px]">
            <div className="flex items-center justify-between mb-[20px]">
              <h3
                className="text-[18px] font-bold text-white"
                style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
              >
                Registrations by Territory
              </h3>
              <Button
                variant="outline"
                className="border-white/10 text-white hover:bg-white/10 px-[20px] py-[10px] rounded-[12px] text-[13px] font-semibold flex items-center gap-[8px]"
                style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
              >
                <Download className="h-[16px] w-[16px]" strokeWidth={2.5} />
                Export
              </Button>
            </div>
            <div className="space-y-[16px]">
              {analytics.registrationsByTerritory.map((territory, index) => (
                <div key={index} className="space-y-[8px]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-[12px]">
                      <MapPin className="h-[16px] w-[16px] text-purple-400" />
                      <span
                        className="text-[14px] font-semibold text-white"
                        style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
                      >
                        {territory.territory}
                      </span>
                    </div>
                    <div className="flex items-center gap-[16px]">
                      <span
                        className="text-[13px] text-white/60"
                        style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
                      >
                        {formatNumber(territory.count)} registrations
                      </span>
                      <span
                        className="text-[14px] font-bold text-green-500"
                        style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
                      >
                        {formatCurrency(territory.revenue)}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-[8px] overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(territory.count / analytics.totalRegistrations) * 100}%`,
                        background: 'linear-gradient(90deg, #7928CA 0%, #4318FF 100%)'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Registrations Tab */}
        <TabsContent value="registrations" className="space-y-[20px]">
          <div className="vision-glass-card p-[24px]">
            <h3
              className="text-[18px] font-bold text-white mb-[20px]"
              style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
            >
              Registration Trend
            </h3>
            <div className="space-y-[12px]">
              {analytics.registrationTrend.map((day, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-[12px] bg-white/5 rounded-[10px]"
                >
                  <div className="flex items-center gap-[12px]">
                    <Calendar className="h-[16px] w-[16px] text-purple-400" />
                    <span
                      className="text-[14px] text-white"
                      style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
                    >
                      {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <Badge className="bg-purple-500/15 text-purple-400 text-[12px] font-semibold px-[12px] py-[4px] rounded-[8px]">
                    {formatNumber(day.count)} registrations
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Attendance Tab */}
        <TabsContent value="attendance" className="space-y-[20px]">
          <div className="vision-glass-card p-[24px]">
            <h3
              className="text-[18px] font-bold text-white mb-[20px]"
              style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
            >
              Session Attendance
            </h3>
            <div className="space-y-[12px]">
              {analytics.sessionPopularity.map((session, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-[16px] bg-white/5 rounded-[12px] hover:bg-white/8 transition-all"
                >
                  <span
                    className="text-[14px] font-semibold text-white"
                    style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
                  >
                    {session.session}
                  </span>
                  <div className="flex items-center gap-[12px]">
                    <Badge className="bg-blue-500/15 text-blue-400 text-[12px] font-semibold px-[12px] py-[4px] rounded-[8px]">
                      {formatNumber(session.attendees)} attendees
                    </Badge>
                    <Badge className="bg-yellow-500/15 text-yellow-400 text-[11px] font-semibold px-[10px] py-[4px] rounded-[8px]">
                      ⭐ {session.rating}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Revenue Tab */}
        <TabsContent value="revenue" className="space-y-[20px]">
          <div className="vision-glass-card p-[24px]">
            <h3
              className="text-[18px] font-bold text-white mb-[20px]"
              style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
            >
              Revenue Breakdown
            </h3>
            <div className="space-y-[16px]">
              {analytics.revenueByCategory.map((category, index) => (
                <div key={index} className="space-y-[8px]">
                  <div className="flex items-center justify-between">
                    <span
                      className="text-[14px] font-semibold text-white"
                      style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
                    >
                      {category.category}
                    </span>
                    <span
                      className="text-[16px] font-bold text-green-500"
                      style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
                    >
                      {formatCurrency(category.amount)}
                    </span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-[8px] overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(category.amount / analytics.totalRevenue) * 100}%`,
                        background: 'linear-gradient(90deg, #10B981 0%, #059669 100%)'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}