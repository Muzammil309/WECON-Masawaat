/**
 * Badge Print Queue Component
 * Admin dashboard for managing badge print jobs
 */

'use client'

import React, { useState, useEffect } from 'react'
import { Printer, RefreshCw, CheckCircle, XCircle, Clock, AlertCircle, List } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import type { BadgePrintJob, BadgeQueueStatusResponse } from '@/lib/types/check-in'

interface BadgePrintQueueProps {
  stationId?: string
  refreshInterval?: number // milliseconds
}

export function BadgePrintQueue({ stationId, refreshInterval = 5000 }: BadgePrintQueueProps) {
  const [queueData, setQueueData] = useState<BadgeQueueStatusResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState<'all' | 'pending' | 'printing' | 'completed' | 'failed'>('all')

  // Fetch queue data
  const fetchQueue = async () => {
    try {
      const params = new URLSearchParams()
      if (stationId) params.append('station_id', stationId)
      if (selectedTab !== 'all') params.append('status', selectedTab)

      const response = await fetch(`/api/badges/queue?${params}`)
      const data: BadgeQueueStatusResponse = await response.json()
      setQueueData(data)
    } catch (error) {
      console.error('Error fetching queue:', error)
      toast.error('Failed to fetch badge queue')
    } finally {
      setLoading(false)
    }
  }

  // Retry failed job
  const retryJob = async (jobId: string) => {
    try {
      const response = await fetch(`/api/badges/retry/${jobId}`, {
        method: 'POST'
      })

      if (response.ok) {
        toast.success('Badge job queued for retry')
        fetchQueue()
      } else {
        toast.error('Failed to retry badge job')
      }
    } catch (error) {
      console.error('Error retrying job:', error)
      toast.error('Failed to retry badge job')
    }
  }

  // Auto-refresh
  useEffect(() => {
    fetchQueue()
    const interval = setInterval(fetchQueue, refreshInterval)
    return () => clearInterval(interval)
  }, [selectedTab, stationId, refreshInterval])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50">
          <Clock className="h-3 w-3 mr-1" />
          Pending
        </Badge>
      case 'printing':
        return <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/50">
          <Printer className="h-3 w-3 mr-1 animate-pulse" />
          Printing
        </Badge>
      case 'completed':
        return <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/50">
          <CheckCircle className="h-3 w-3 mr-1" />
          Completed
        </Badge>
      case 'failed':
        return <Badge variant="outline" className="bg-red-500/20 text-red-400 border-red-500/50">
          <XCircle className="h-3 w-3 mr-1" />
          Failed
        </Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString()
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
            <Printer className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Badge Print Queue</h2>
            <p className="text-sm text-slate-400">Monitor and manage badge printing</p>
          </div>
        </div>
        <Button
          onClick={fetchQueue}
          variant="outline"
          size="sm"
          disabled={loading}
          className="bg-white/5 border-white/10 hover:bg-white/10"
        >
          <RefreshCw className={cn('h-4 w-4 mr-2', loading && 'animate-spin')} />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          title="Pending"
          value={queueData?.total_pending || 0}
          icon={<Clock className="h-5 w-5" />}
          gradient="from-yellow-500 to-orange-500"
          loading={loading}
        />
        <StatCard
          title="Printing"
          value={queueData?.total_printing || 0}
          icon={<Printer className="h-5 w-5" />}
          gradient="from-blue-500 to-cyan-500"
          loading={loading}
          pulse
        />
        <StatCard
          title="Completed"
          value={queueData?.total_completed || 0}
          icon={<CheckCircle className="h-5 w-5" />}
          gradient="from-green-500 to-emerald-500"
          loading={loading}
        />
        <StatCard
          title="Failed"
          value={queueData?.total_failed || 0}
          icon={<XCircle className="h-5 w-5" />}
          gradient="from-red-500 to-rose-500"
          loading={loading}
        />
      </div>

      {/* Queue Table */}
      <Card className="border-white/10 bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <List className="h-5 w-5" />
            Print Jobs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTab} onValueChange={(v) => setSelectedTab(v as any)}>
            <TabsList className="bg-white/5">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="printing">Printing</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="failed">Failed</TabsTrigger>
            </TabsList>

            <TabsContent value={selectedTab} className="mt-4">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent mx-auto" />
                </div>
              ) : queueData?.queue && queueData.queue.length > 0 ? (
                <div className="rounded-lg border border-white/10 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/10 hover:bg-white/5">
                        <TableHead className="text-slate-300">Status</TableHead>
                        <TableHead className="text-slate-300">Attendee</TableHead>
                        <TableHead className="text-slate-300">Ticket Tier</TableHead>
                        <TableHead className="text-slate-300">Priority</TableHead>
                        <TableHead className="text-slate-300">Queued At</TableHead>
                        <TableHead className="text-slate-300">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {queueData.queue.map((job) => (
                        <TableRow key={job.id} className="border-white/10 hover:bg-white/5">
                          <TableCell>{getStatusBadge(job.status)}</TableCell>
                          <TableCell className="text-white">
                            {job.badge_data?.attendee_name || 'Unknown'}
                          </TableCell>
                          <TableCell className="text-slate-300">
                            {job.badge_data?.ticket_tier || '-'}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-white/5">
                              {job.priority}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-slate-400 text-sm">
                            {formatTime(job.queued_at)}
                          </TableCell>
                          <TableCell>
                            {job.status === 'failed' && (
                              <Button
                                onClick={() => retryJob(job.id)}
                                size="sm"
                                variant="outline"
                                className="bg-white/5 border-white/10 hover:bg-white/10"
                              >
                                <RefreshCw className="h-3 w-3 mr-1" />
                                Retry
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <AlertCircle className="h-12 w-12 text-slate-500 mx-auto mb-3" />
                  <p className="text-slate-400">No print jobs found</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

interface StatCardProps {
  title: string
  value: number
  icon: React.ReactNode
  gradient: string
  loading?: boolean
  pulse?: boolean
}

function StatCard({ title, value, icon, gradient, loading, pulse }: StatCardProps) {
  return (
    <Card className="relative overflow-hidden border-white/10 bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10`} />
      <CardContent className="relative pt-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-400 mb-2">{title}</p>
            {loading ? (
              <div className="h-10 w-20 bg-white/10 animate-pulse rounded" />
            ) : (
              <h3 className={cn('text-3xl font-bold text-white', pulse && 'animate-pulse')}>
                {value}
              </h3>
            )}
          </div>
          <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}>
            <div className="text-white">{icon}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

