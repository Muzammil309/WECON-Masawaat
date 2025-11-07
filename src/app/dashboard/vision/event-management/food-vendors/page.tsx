import { Metadata } from 'next'
import FoodVendorsView from '@/components/dashboard/admin/event-management/food-vendors-view'

export const metadata: Metadata = {
  title: 'Food Vendors - Event Management | WECON',
  description: 'Manage food court vendors and catering services',
}

export default function FoodVendorsPage() {
  return <FoodVendorsView />
}

