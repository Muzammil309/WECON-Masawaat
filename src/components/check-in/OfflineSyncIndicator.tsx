/**
 * Offline Sync Indicator Component
 * Shows online/offline status, pending sync count, and manual sync button
 */

'use client'

import React from 'react'
import { Wifi, WifiOff, RefreshCw, CloudOff, Clock, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface OfflineSyncIndicatorProps {
  isOnline: boolean
  pendingCount: number
  isSyncing: boolean
  lastSyncAt: string | null
  onSyncNow: () => void
  compact?: boolean
  className?: string
}

export function OfflineSyncIndicator({
  isOnline,
  pendingCount,
  isSyncing,
  lastSyncAt,
  onSyncNow,
  compact = false,
  className
}: OfflineSyncIndicatorProps) {
  const formatLastSync = (dateString: string | null) => {
    if (!dateString) return 'Never'
    
    const date = new Date(dateString)
    const now = new Date()
    const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffSeconds < 60) return `${diffSeconds}s ago`
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`
    if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}h ago`
    return date.toLocaleDateString()
  }

  // Compact version (for mobile header)
  if (compact) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        {/* Status Icon */}
        <div className="relative">
          {isOnline ? (
            <Wifi className="h-5 w-5 text-green-500" />
          ) : (
            <WifiOff className="h-5 w-5 text-red-500 animate-pulse" />
          )}
          
          {/* Pending Count Badge */}
          {pendingCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {pendingCount > 99 ? '99+' : pendingCount}
            </Badge>
          )}
        </div>

        {/* Sync Button */}
        <Button
          onClick={onSyncNow}
          disabled={isSyncing || !isOnline || pendingCount === 0}
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0"
        >
          <RefreshCw className={cn('h-4 w-4', isSyncing && 'animate-spin')} />
        </Button>
      </div>
    )
  }

  // Full version (for dashboard)
  return (
    <Card className={cn('border-white/10 bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl', className)}>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Sync Status</h3>
            <Button
              onClick={onSyncNow}
              disabled={isSyncing || !isOnline || pendingCount === 0}
              size="sm"
              variant="outline"
              className="bg-white/5 border-white/10 hover:bg-white/10"
            >
              <RefreshCw className={cn('h-4 w-4 mr-2', isSyncing && 'animate-spin')} />
              {isSyncing ? 'Syncing...' : 'Sync Now'}
            </Button>
          </div>

          {/* Status Cards */}
          <div className="grid grid-cols-2 gap-3">
            {/* Online/Offline Status */}
            <div className={cn(
              'p-3 rounded-lg border transition-colors',
              isOnline 
                ? 'bg-green-500/10 border-green-500/30' 
                : 'bg-red-500/10 border-red-500/30'
            )}>
              <div className="flex items-center gap-2 mb-1">
                {isOnline ? (
                  <Wifi className="h-4 w-4 text-green-500" />
                ) : (
                  <WifiOff className="h-4 w-4 text-red-500" />
                )}
                <span className={cn(
                  'text-xs font-medium',
                  isOnline ? 'text-green-400' : 'text-red-400'
                )}>
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {isOnline ? 'Connected to server' : 'Working offline'}
              </p>
            </div>

            {/* Pending Sync Count */}
            <div className={cn(
              'p-3 rounded-lg border transition-colors',
              pendingCount > 0
                ? 'bg-orange-500/10 border-orange-500/30'
                : 'bg-slate-500/10 border-slate-500/30'
            )}>
              <div className="flex items-center gap-2 mb-1">
                {pendingCount > 0 ? (
                  <CloudOff className="h-4 w-4 text-orange-500" />
                ) : (
                  <CheckCircle className="h-4 w-4 text-slate-500" />
                )}
                <span className={cn(
                  'text-xs font-medium',
                  pendingCount > 0 ? 'text-orange-400' : 'text-slate-400'
                )}>
                  {pendingCount} Pending
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {pendingCount > 0 ? 'Waiting to sync' : 'All synced'}
              </p>
            </div>
          </div>

          {/* Last Sync Time */}
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Clock className="h-3 w-3" />
            <span>Last sync: {formatLastSync(lastSyncAt)}</span>
          </div>

          {/* Sync Progress */}
          {isSyncing && (
            <div className="space-y-2">
              <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 animate-pulse" style={{ width: '100%' }} />
              </div>
              <p className="text-xs text-center text-slate-400">
                Syncing {pendingCount} check-in{pendingCount !== 1 ? 's' : ''}...
              </p>
            </div>
          )}

          {/* Offline Warning */}
          {!isOnline && pendingCount > 0 && (
            <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
              <p className="text-xs text-yellow-400">
                ⚠️ You're offline. {pendingCount} check-in{pendingCount !== 1 ? 's' : ''} will sync when connection is restored.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

