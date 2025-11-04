'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar, 
  Users, 
  BarChart3, 
  MessageCircle, 
  Download, 
  Store,
  CheckCircle2,
  UserPlus,
  Share2,
  TrendingUp
} from 'lucide-react'
import type { PointsEntry, ActivityType } from '@/types/profile'
import { format } from 'date-fns'

interface PointsHistoryProps {
  points: PointsEntry[]
}

const ACTIVITY_CONFIG: Record<ActivityType, { icon: any; label: string; color: string }> = {
  session_attendance: { icon: Calendar, label: 'Attended Session', color: 'blue' },
  networking_connection: { icon: Users, label: 'New Connection', color: 'green' },
  poll_participation: { icon: BarChart3, label: 'Voted in Poll', color: 'purple' },
  question_asked: { icon: MessageCircle, label: 'Asked Question', color: 'indigo' },
  resource_download: { icon: Download, label: 'Downloaded Resource', color: 'cyan' },
  booth_visit: { icon: Store, label: 'Visited Booth', color: 'orange' },
  profile_completion: { icon: CheckCircle2, label: 'Completed Profile', color: 'green' },
  event_registration: { icon: UserPlus, label: 'Registered for Event', color: 'blue' },
  referral: { icon: Share2, label: 'Referred Friend', color: 'pink' },
  social_share: { icon: Share2, label: 'Shared on Social', color: 'purple' },
}

export function PointsHistory({ points }: PointsHistoryProps) {
  const totalPoints = points.reduce((sum, entry) => sum + entry.points, 0)

  const getActivityConfig = (type: ActivityType) => {
    return ACTIVITY_CONFIG[type] || { 
      icon: TrendingUp, 
      label: type.replace(/_/g, ' '), 
      color: 'gray' 
    }
  }

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card
        className="vision-glass-card"
        style={{
          background: 'rgba(26, 31, 55, 0.5)',
          backdropFilter: 'blur(21px)',
          border: '2px solid #151515',
          borderRadius: '20px'
        }}
      >
        <CardHeader>
          <CardTitle style={{ color: '#fff', fontSize: '24px' }}>Activity History</CardTitle>
          <CardDescription style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Your recent activities and points earned
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="text-3xl font-bold text-white">
                {totalPoints.toLocaleString()}
              </div>
              <div className="text-sm text-gray-300">
                Total Points from {points.length} activities
              </div>
            </div>
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white">
              <TrendingUp className="h-8 w-8" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Timeline */}
      {points.length > 0 ? (
        <Card
          className="vision-glass-card"
          style={{
            background: 'rgba(26, 31, 55, 0.5)',
            backdropFilter: 'blur(21px)',
            border: '2px solid #151515',
            borderRadius: '20px'
          }}
        >
          <CardContent className="p-6">
            <div className="space-y-4">
              {points.map((entry, index) => {
                const config = getActivityConfig(entry.activity_type)
                const Icon = config.icon

                return (
                  <div
                    key={entry.id}
                    className="flex items-start gap-4 pb-4 border-b border-gray-700 last:border-0 last:pb-0"
                  >
                    {/* Icon */}
                    <div className={`flex-shrink-0 h-10 w-10 rounded-full bg-${config.color}-100 flex items-center justify-center`}>
                      <Icon className={`h-5 w-5 text-${config.color}-600`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-medium text-white">
                            {config.label}
                          </p>
                          <p className="text-sm text-gray-400 mt-1">
                            {format(new Date(entry.created_at), 'MMM d, yyyy • h:mm a')}
                          </p>
                        </div>
                        <Badge variant="secondary" className="flex-shrink-0">
                          +{entry.points} pts
                        </Badge>
                      </div>

                      {/* Metadata */}
                      {entry.metadata && Object.keys(entry.metadata).length > 0 && (
                        <div className="mt-2 text-xs text-gray-400">
                          {entry.metadata.session_title && (
                            <span>Session: {entry.metadata.session_title}</span>
                          )}
                          {entry.metadata.connection_name && (
                            <span>Connected with: {entry.metadata.connection_name}</span>
                          )}
                          {entry.metadata.resource_title && (
                            <span>Resource: {entry.metadata.resource_title}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card
          className="vision-glass-card"
          style={{
            background: 'rgba(26, 31, 55, 0.5)',
            backdropFilter: 'blur(21px)',
            border: '2px solid #151515',
            borderRadius: '20px'
          }}
        >
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <TrendingUp className="h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              No Activity Yet
            </h3>
            <p className="text-gray-300 max-w-md">
              Start participating in events to earn points and track your activity here!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

