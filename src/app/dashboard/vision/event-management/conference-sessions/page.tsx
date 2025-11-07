import { Metadata } from 'next'
import ConferenceSessionsView from '@/components/dashboard/admin/event-management/conference-sessions-view'

export const metadata: Metadata = {
  title: 'Conference Sessions - Event Management | WECON',
  description: 'Manage conference sessions, keynotes, panels, and presentations',
}

export default function ConferenceSessionsPage() {
  return <ConferenceSessionsView />
}

