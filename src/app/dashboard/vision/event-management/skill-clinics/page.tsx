import { Metadata } from 'next'
import SkillClinicsView from '@/components/dashboard/admin/event-management/skill-clinics-view'

export const metadata: Metadata = {
  title: 'Skill Clinics - Event Management | WECON',
  description: 'Manage skill training clinics and certification programs',
}

export default function SkillClinicsPage() {
  return <SkillClinicsView />
}

