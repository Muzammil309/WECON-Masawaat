import { Metadata } from 'next'
import RoundtablesView from '@/components/dashboard/admin/event-management/roundtables-view'

export const metadata: Metadata = {
  title: 'Roundtables - Event Management | WECON',
  description: 'Manage roundtable discussion sessions',
}

export default function RoundtablesPage() {
  return <RoundtablesView />
}

