'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { UtensilsCrossed, Plus, Search, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { VisionBreadcrumb } from '@/components/vision-ui/breadcrumb'
import type { FoodVendor } from '../event-management-content'

export default function FoodVendorsView() {
  const [loading, setLoading] = useState(false)
  const [vendors, setVendors] = useState<FoodVendor[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const supabase = createClient()

  useEffect(() => {
    fetchVendors()
  }, [])

  const fetchVendors = async () => {
    try {
      setLoading(true)
      console.log('🔄 [FOOD VENDORS] Fetching vendors...')

      const { data, error} = await supabase
        .from('em_food_vendors')
        .select('*')
        .order('vendor_name', { ascending: true })

      if (error) {
        console.error('❌ Error fetching food vendors:', error)
        toast.error('Failed to load food vendors')
        return
      }

      setVendors(data || [])
      console.log('✅ [FOOD VENDORS] Fetched successfully:', data?.length || 0)
    } catch (error: any) {
      console.error('❌ [FOOD VENDORS] Error:', error)
      toast.error('Failed to load food vendors')
    } finally {
      setLoading(false)
    }
  }

  const filteredVendors = vendors.filter(
    (vendor) =>
      searchQuery === '' ||
      vendor.vendor_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.cuisine_type?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="p-[20px]">
      <div className="max-w-[1440px]">
        <VisionBreadcrumb
          items={[
            { label: 'Admin', href: '/dashboard/vision' },
            { label: 'Event Management' },
            { label: 'Food Vendors' },
          ]}
        />

        <div className="mb-[24px] md:mb-[32px]">
          <div className="flex items-center gap-[12px] mb-[8px]">
            <div className="flex items-center justify-center w-[40px] h-[40px] md:w-[48px] md:h-[48px] rounded-[12px] bg-gradient-to-br from-[#7928CA] to-[#4318FF]">
              <UtensilsCrossed className="h-[20px] w-[20px] md:h-[24px] md:w-[24px] text-white" />
            </div>
            <h1
              className="text-[20px] md:text-[24px] lg:text-[28px] font-bold text-white"
              style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
            >
              Food Court Vendors
            </h1>
          </div>
          <p
            className="text-white/60 text-[13px] md:text-[14px] ml-[52px] md:ml-[60px]"
            style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
          >
            Manage food court vendors and catering services
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-[16px] mb-[24px]">
          <div className="flex items-center gap-[12px] flex-1 w-full sm:max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-[12px] top-1/2 transform -translate-y-1/2 h-[16px] w-[16px] text-white/40" />
              <Input
                placeholder="Search vendors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-[40px] bg-white/5 border-white/10 text-white placeholder:text-white/40 h-[40px] md:h-[44px] rounded-[12px]"
                style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
              />
            </div>
          </div>
          <div className="flex items-center gap-[12px] w-full sm:w-auto">
            <Button
              variant="outline"
              className="flex-1 sm:flex-none bg-white/5 border-white/10 text-white hover:bg-white/10 h-[40px] md:h-[44px] rounded-[12px] min-h-[44px]"
              style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
            >
              <Filter className="h-[16px] w-[16px] mr-[8px]" />
              <span className="hidden sm:inline">Filter</span>
            </Button>
            <Button
              className="flex-1 sm:flex-none bg-gradient-to-r from-[#7928CA] to-[#4318FF] text-white hover:opacity-90 h-[40px] md:h-[44px] rounded-[12px] min-h-[44px]"
              style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
            >
              <Plus className="h-[16px] w-[16px] mr-[8px]" />
              Add Vendor
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="text-white/60 text-center py-[60px] md:py-[80px]">
            <div className="animate-pulse">Loading vendors...</div>
          </div>
        ) : filteredVendors.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[16px]">
            {filteredVendors.map((vendor) => (
              <VendorCard key={vendor.id} vendor={vendor} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="p-[32px] md:p-[48px] text-center rounded-[20px] border-2 border-white/10" style={{ background: 'rgba(26, 31, 55, 0.5)', backdropFilter: 'blur(21px)' }}>
      <div className="flex items-center justify-center w-[64px] h-[64px] md:w-[80px] md:h-[80px] mx-auto mb-[20px] rounded-[20px] bg-white/5">
        <UtensilsCrossed className="h-[32px] w-[32px] md:h-[40px] md:w-[40px] text-white/40" />
      </div>
      <h3 className="text-[16px] md:text-[18px] font-semibold text-white mb-[8px]" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>No Food Vendors Yet</h3>
      <p className="text-white/60 text-[13px] md:text-[14px] mb-[24px] max-w-md mx-auto" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>Add your first food vendor</p>
      <Button className="bg-gradient-to-r from-[#7928CA] to-[#4318FF] text-white hover:opacity-90 h-[44px] rounded-[12px] min-h-[44px]" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
        <Plus className="h-[16px] w-[16px] mr-[8px]" />Add First Vendor
      </Button>
    </div>
  )
}

function VendorCard({ vendor }: { vendor: FoodVendor }) {
  const paymentMethods = []
  if (vendor.accepts_cash) paymentMethods.push('Cash')
  if (vendor.accepts_card) paymentMethods.push('Card')

  const operatingHours = vendor.operating_hours_start && vendor.operating_hours_end
    ? `${vendor.operating_hours_start} - ${vendor.operating_hours_end}`
    : null

  return (
    <div className="p-[16px] md:p-[20px] hover:scale-[1.01] transition-all cursor-pointer rounded-[16px] border-2 border-white/10" style={{ background: 'rgba(26, 31, 55, 0.5)', backdropFilter: 'blur(21px)' }}>
      <h4 className="text-[14px] md:text-[15px] font-semibold text-white mb-[8px]" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>{vendor.vendor_name}</h4>
      {vendor.cuisine_type && <p className="text-white/60 text-[12px] md:text-[13px] mb-[12px]" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>{vendor.cuisine_type}</p>}
      <div className="flex flex-wrap items-center gap-[8px] md:gap-[12px]">
        {paymentMethods.length > 0 && <Badge className="bg-green-500/20 text-green-400 border-green-500/30 border text-[10px] md:text-[11px]">{paymentMethods.join(', ')}</Badge>}
        {operatingHours && <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 border text-[10px] md:text-[11px]">{operatingHours}</Badge>}
      </div>
    </div>
  )
}

