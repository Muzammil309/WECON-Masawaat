'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  QrCode, 
  Printer, 
  Mail, 
  MessageSquare, 
  Download,
  AlertCircle,
  BarChart3,
  Users
} from 'lucide-react'
import { useRouter } from 'next/navigation'

export function QuickActions() {
  const router = useRouter()

  const actions = [
    {
      icon: <QrCode className="h-5 w-5" />,
      label: 'QR Scanner',
      description: 'Check-in attendees',
      color: 'bg-blue-500 hover:bg-blue-600',
      onClick: () => router.push('/check-in/scanner')
    },
    {
      icon: <Printer className="h-5 w-5" />,
      label: 'Badge Queue',
      description: 'Manage printing',
      color: 'bg-purple-500 hover:bg-purple-600',
      onClick: () => router.push('/admin/check-in/queue')
    },
    {
      icon: <Mail className="h-5 w-5" />,
      label: 'Send Email',
      description: 'Broadcast message',
      color: 'bg-green-500 hover:bg-green-600',
      onClick: () => console.log('Send email')
    },
    {
      icon: <MessageSquare className="h-5 w-5" />,
      label: 'Announcements',
      description: 'Push notification',
      color: 'bg-amber-500 hover:bg-amber-600',
      onClick: () => console.log('Send announcement')
    },
    {
      icon: <Download className="h-5 w-5" />,
      label: 'Export Data',
      description: 'Download reports',
      color: 'bg-indigo-500 hover:bg-indigo-600',
      onClick: () => console.log('Export data')
    },
    {
      icon: <AlertCircle className="h-5 w-5" />,
      label: 'Emergency',
      description: 'Broadcast alert',
      color: 'bg-red-500 hover:bg-red-600',
      onClick: () => console.log('Emergency broadcast')
    },
    {
      icon: <BarChart3 className="h-5 w-5" />,
      label: 'Analytics',
      description: 'View insights',
      color: 'bg-cyan-500 hover:bg-cyan-600',
      onClick: () => console.log('View analytics')
    },
    {
      icon: <Users className="h-5 w-5" />,
      label: 'Attendees',
      description: 'Manage list',
      color: 'bg-pink-500 hover:bg-pink-600',
      onClick: () => console.log('Manage attendees')
    }
  ]

  return (
    <Card className="border-slate-200">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-slate-900">Quick Actions</CardTitle>
        <CardDescription>Common tasks and operations</CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className="group relative p-4 rounded-lg border border-slate-200 hover:border-slate-300 transition-all hover:shadow-md bg-white"
            >
              <div className={`${action.color} text-white p-3 rounded-lg mb-3 transition-transform group-hover:scale-110`}>
                {action.icon}
              </div>
              <h4 className="font-semibold text-sm text-slate-900 mb-1">
                {action.label}
              </h4>
              <p className="text-xs text-slate-500">
                {action.description}
              </p>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

