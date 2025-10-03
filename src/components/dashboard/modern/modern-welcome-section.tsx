'use client'

import { ReactNode } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { User, Sparkles } from 'lucide-react'
import Link from 'next/link'

interface ModernWelcomeSectionProps {
  userName: string
  userEmail?: string
  userAvatar?: string
  greeting?: string
  description?: string
  actions?: Array<{
    label: string
    href: string
    icon?: ReactNode
    variant?: 'default' | 'secondary' | 'outline' | 'ghost'
  }>
  gradient?: string
  className?: string
}

export function ModernWelcomeSection({
  userName,
  userEmail,
  userAvatar,
  greeting,
  description = 'Ready to explore amazing events and connect with like-minded people?',
  actions = [],
  gradient = 'from-blue-600 via-purple-600 to-pink-600',
  className
}: ModernWelcomeSectionProps) {
  const initials = userName.slice(0, 2).toUpperCase()
  const displayGreeting = greeting || `Welcome back, ${userName}!`

  return (
    <Card className={cn(
      "relative overflow-hidden border-0 text-white shadow-2xl",
      className
    )}>
      {/* Gradient Background */}
      <div className={cn("absolute inset-0 bg-gradient-to-r", gradient)} />
      
      {/* Animated Background Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24" />
      <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-white/5 rounded-full animate-pulse delay-1000" />

      <CardContent className="relative p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Avatar */}
          <div className="relative">
            <Avatar className="h-20 w-20 border-4 border-white/30 shadow-2xl">
              <AvatarImage src={userAvatar} alt={userName} />
              <AvatarFallback className="text-2xl font-bold bg-white/20 text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-4 border-white flex items-center justify-center">
              <Sparkles className="h-3 w-3 text-white" />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-2 flex items-center gap-2">
              {displayGreeting}
            </h2>
            <p className="text-white/90 text-lg mb-4 max-w-2xl">
              {description}
            </p>
            {userEmail && (
              <p className="text-white/70 text-sm">
                {userEmail}
              </p>
            )}
          </div>

          {/* Actions */}
          {actions.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {actions.map((action, index) => (
                <Button
                  key={index}
                  asChild
                  variant={action.variant || 'secondary'}
                  className={cn(
                    action.variant === 'outline' && "border-white/30 text-white hover:bg-white/10 hover:text-white"
                  )}
                >
                  <Link href={action.href}>
                    {action.icon}
                    {action.label}
                  </Link>
                </Button>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

interface QuickAction {
  label: string
  description?: string
  href: string
  icon: ReactNode
  gradient?: string
  iconBg?: string
}

interface ModernQuickActionsProps {
  actions: QuickAction[]
  title?: string
  columns?: 2 | 3 | 4
  className?: string
}

export function ModernQuickActions({
  actions,
  title = 'Quick Actions',
  columns = 4,
  className
}: ModernQuickActionsProps) {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4'
  }

  return (
    <div className={className}>
      {title && (
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          {title}
        </h3>
      )}
      <div className={cn("grid gap-4", gridCols[columns])}>
        {actions.map((action, index) => (
          <Link key={index} href={action.href}>
            <Card className="group relative overflow-hidden border-slate-200/60 dark:border-slate-700/60 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
              {/* Gradient Background Accent */}
              {action.gradient && (
                <div className={cn(
                  "absolute top-0 right-0 w-24 h-24 bg-gradient-to-br opacity-10 rounded-full -mr-12 -mt-12 group-hover:opacity-20 transition-opacity duration-300",
                  action.gradient
                )} />
              )}

              <CardContent className="p-6 relative">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300",
                    action.iconBg || "bg-blue-500/10"
                  )}>
                    <div className="text-slate-700 dark:text-white">
                      {action.icon}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {action.label}
                    </h4>
                    {action.description && (
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                        {action.description}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

interface ModernEmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: {
    label: string
    href: string
    icon?: ReactNode
  }
  className?: string
}

export function ModernEmptyState({
  icon,
  title,
  description,
  action,
  className
}: ModernEmptyStateProps) {
  return (
    <Card className={cn("border-dashed border-2 border-slate-300 dark:border-slate-700", className)}>
      <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
        {icon && (
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
            <div className="text-slate-400">
              {icon}
            </div>
          </div>
        )}
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
          {title}
        </h3>
        {description && (
          <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md">
            {description}
          </p>
        )}
        {action && (
          <Button asChild>
            <Link href={action.href}>
              {action.icon}
              {action.label}
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

interface ModernInfoBannerProps {
  title: string
  description?: string
  icon?: ReactNode
  variant?: 'info' | 'success' | 'warning' | 'error'
  action?: {
    label: string
    onClick: () => void
  }
  dismissible?: boolean
  onDismiss?: () => void
  className?: string
}

export function ModernInfoBanner({
  title,
  description,
  icon,
  variant = 'info',
  action,
  dismissible = false,
  onDismiss,
  className
}: ModernInfoBannerProps) {
  const variantStyles = {
    info: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      iconBg: 'bg-blue-100 dark:bg-blue-900/30',
      iconColor: 'text-blue-600 dark:text-blue-400',
      textColor: 'text-blue-900 dark:text-blue-100'
    },
    success: {
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
      border: 'border-emerald-200 dark:border-emerald-800',
      iconBg: 'bg-emerald-100 dark:bg-emerald-900/30',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      textColor: 'text-emerald-900 dark:text-emerald-100'
    },
    warning: {
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      border: 'border-amber-200 dark:border-amber-800',
      iconBg: 'bg-amber-100 dark:bg-amber-900/30',
      iconColor: 'text-amber-600 dark:text-amber-400',
      textColor: 'text-amber-900 dark:text-amber-100'
    },
    error: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      iconBg: 'bg-red-100 dark:bg-red-900/30',
      iconColor: 'text-red-600 dark:text-red-400',
      textColor: 'text-red-900 dark:text-red-100'
    }
  }

  const styles = variantStyles[variant]

  return (
    <div className={cn(
      "rounded-xl border p-4",
      styles.bg,
      styles.border,
      className
    )}>
      <div className="flex items-start gap-4">
        {icon && (
          <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0", styles.iconBg)}>
            <div className={styles.iconColor}>
              {icon}
            </div>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h4 className={cn("font-semibold mb-1", styles.textColor)}>
            {title}
          </h4>
          {description && (
            <p className={cn("text-sm", styles.textColor, "opacity-90")}>
              {description}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {action && (
            <Button
              size="sm"
              variant="ghost"
              onClick={action.onClick}
              className={styles.textColor}
            >
              {action.label}
            </Button>
          )}
          {dismissible && onDismiss && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onDismiss}
              className={styles.textColor}
            >
              ×
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

