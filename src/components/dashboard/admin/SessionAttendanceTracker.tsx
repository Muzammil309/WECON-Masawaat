'use client'

import React, { useState } from 'react'
import { useLiveAttendance } from '@/lib/hooks/useSessionMetrics'
import {
  Users,
  TrendingUp,
  TrendingDown,
  Clock,
  Activity,
  BarChart3,
  RefreshCw
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

interface SessionAttendanceTrackerProps {
  sessionId: string
  sessionTitle: string
  capacity?: number
}

export function SessionAttendanceTracker({
  sessionId,
  sessionTitle,
  capacity
}: SessionAttendanceTrackerProps) {
  const {
    currentAttendees,
    peakAttendees,
    totalCheckIns,
    totalCheckOuts,
    averageDuration,
    dropOffRate,
    engagementRate,
    attendanceTimeline,
    loading,
    error,
    refresh
  } = useLiveAttendance(sessionId)

  const capacityPercentage = capacity ? (currentAttendees / capacity) * 100 : 0
  const isNearCapacity = capacityPercentage > 80
  const isAtCapacity = capacityPercentage >= 100

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <div className="text-center text-red-600">
            <p className="font-semibold">Error loading session metrics</p>
            <p className="text-sm mt-1">{error}</p>
            <Button onClick={() => refresh()} variant="outline" size="sm" className="mt-4">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-white/10 bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl text-white">{sessionTitle}</CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge 
                variant="outline" 
                className={`${
                  currentAttendees > 0
                    ? 'bg-green-500/20 text-green-400 border-green-500/50'
                    : 'bg-slate-500/20 text-slate-400 border-slate-500/50'
                }`}
              >
                <div className={`h-2 w-2 rounded-full mr-2 ${
                  currentAttendees > 0 ? 'bg-green-400 animate-pulse' : 'bg-slate-400'
                }`} />
                {currentAttendees > 0 ? 'Active' : 'Inactive'}
              </Badge>
              {capacity && (
                <Badge 
                  variant="outline"
                  className={`${
                    isAtCapacity
                      ? 'bg-red-500/20 text-red-400 border-red-500/50'
                      : isNearCapacity
                      ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
                      : 'bg-blue-500/20 text-blue-400 border-blue-500/50'
                  }`}
                >
                  {currentAttendees} / {capacity} capacity
                </Badge>
              )}
            </div>
          </div>
          <Button
            onClick={() => refresh()}
            variant="outline"
            size="sm"
            disabled={loading}
            className="bg-white/5 border-white/10 hover:bg-white/10"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Capacity Progress Bar */}
        {capacity && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Room Capacity</span>
              <span className={`font-semibold ${
                isAtCapacity ? 'text-red-400' : isNearCapacity ? 'text-yellow-400' : 'text-blue-400'
              }`}>
                {capacityPercentage.toFixed(0)}%
              </span>
            </div>
            <Progress 
              value={capacityPercentage} 
              className={`h-2 ${
                isAtCapacity ? 'bg-red-500/20' : isNearCapacity ? 'bg-yellow-500/20' : 'bg-blue-500/20'
              }`}
            />
            {isAtCapacity && (
              <p className="text-xs text-red-400 flex items-center gap-1">
                <Activity className="h-3 w-3" />
                Session is at full capacity
              </p>
            )}
          </div>
        )}

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricBox
            label="Current"
            value={currentAttendees}
            icon={<Users className="h-4 w-4" />}
            color="blue"
            loading={loading}
          />
          <MetricBox
            label="Peak"
            value={peakAttendees}
            icon={<TrendingUp className="h-4 w-4" />}
            color="green"
            loading={loading}
          />
          <MetricBox
            label="Total Check-ins"
            value={totalCheckIns}
            icon={<Activity className="h-4 w-4" />}
            color="purple"
            loading={loading}
          />
          <MetricBox
            label="Avg Duration"
            value={`${averageDuration.toFixed(0)}m`}
            icon={<Clock className="h-4 w-4" />}
            color="orange"
            loading={loading}
          />
        </div>

        {/* Engagement & Drop-off */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-400">Engagement Rate</span>
              <BarChart3 className="h-4 w-4 text-green-400" />
            </div>
            {loading ? (
              <div className="h-8 w-20 bg-white/10 animate-pulse rounded" />
            ) : (
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white">
                  {engagementRate.toFixed(1)}%
                </span>
                <Badge 
                  variant="outline"
                  className="bg-green-500/20 text-green-400 border-green-500/50 text-xs"
                >
                  {engagementRate > 50 ? 'High' : engagementRate > 25 ? 'Medium' : 'Low'}
                </Badge>
              </div>
            )}
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-400">Drop-off Rate</span>
              <TrendingDown className="h-4 w-4 text-red-400" />
            </div>
            {loading ? (
              <div className="h-8 w-20 bg-white/10 animate-pulse rounded" />
            ) : (
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white">
                  {dropOffRate.toFixed(1)}%
                </span>
                <Badge 
                  variant="outline"
                  className={`text-xs ${
                    dropOffRate > 50
                      ? 'bg-red-500/20 text-red-400 border-red-500/50'
                      : dropOffRate > 25
                      ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
                      : 'bg-green-500/20 text-green-400 border-green-500/50'
                  }`}
                >
                  {dropOffRate > 50 ? 'High' : dropOffRate > 25 ? 'Medium' : 'Low'}
                </Badge>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        {attendanceTimeline.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-slate-400">Recent Activity</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {attendanceTimeline.slice(0, 5).map((attendance, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-2 rounded-lg bg-white/5 text-sm"
                >
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${
                      attendance.checked_out_at ? 'bg-red-400' : 'bg-green-400'
                    }`} />
                    <span className="text-slate-300">
                      {attendance.checked_out_at ? 'Checked out' : 'Checked in'}
                    </span>
                  </div>
                  <span className="text-slate-400 text-xs">
                    {new Date(attendance.checked_in_at).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface MetricBoxProps {
  label: string
  value: string | number
  icon: React.ReactNode
  color: 'blue' | 'green' | 'purple' | 'orange'
  loading?: boolean
}

function MetricBox({ label, value, icon, color, loading }: MetricBoxProps) {
  const colorClasses = {
    blue: 'text-blue-400 bg-blue-500/20',
    green: 'text-green-400 bg-green-500/20',
    purple: 'text-purple-400 bg-purple-500/20',
    orange: 'text-orange-400 bg-orange-500/20'
  }

  return (
    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
      <div className="flex items-center gap-2 mb-2">
        <div className={`p-1.5 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
        <span className="text-xs text-slate-400">{label}</span>
      </div>
      {loading ? (
        <div className="h-7 w-16 bg-white/10 animate-pulse rounded" />
      ) : (
        <span className="text-xl font-bold text-white">{value}</span>
      )}
    </div>
  )
}

