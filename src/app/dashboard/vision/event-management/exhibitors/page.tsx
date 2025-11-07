import { Metadata } from 'next'
import ExhibitorsView from '@/components/dashboard/admin/event-management/exhibitors-view'

export const metadata: Metadata = {
  title: 'Exhibitors - Event Management | WECON',
  description: 'Manage exhibiting companies and booth assignments',
}

export default function ExhibitorsPage() {
  return <ExhibitorsView />
}

