import { Metadata } from 'next'
import LearningLabsView from '@/components/dashboard/admin/event-management/learning-labs-view'

export const metadata: Metadata = {
  title: 'Learning Labs - Event Management | WECON',
  description: 'Manage learning labs and workshop sessions',
}

export default function LearningLabsPage() {
  return <LearningLabsView />
}

