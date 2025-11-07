import { Metadata } from 'next'
import StartupStoriesView from '@/components/dashboard/admin/event-management/startup-stories-view'

export const metadata: Metadata = {
  title: 'Startup Stories - Event Management | WECON',
  description: 'Manage startup pitch sessions and founder stories',
}

export default function StartupStoriesPage() {
  return <StartupStoriesView />
}

