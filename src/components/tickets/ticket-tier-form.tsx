'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Ticket, DollarSign, Users, Calendar } from 'lucide-react'

interface TicketTierFormData {
  name: string
  description: string
  price: number
  quantity: number
  sale_start: string
  sale_end: string
}

interface TicketTierFormProps {
  eventId: string
  onSuccess?: () => void
}

export function TicketTierForm({ eventId, onSuccess }: TicketTierFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<TicketTierFormData>({
    name: '',
    description: '',
    price: 0,
    quantity: 100,
    sale_start: '',
    sale_end: '',
  })

  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await supabase
        .from('em_ticket_tiers')
        .insert({
          event_id: eventId,
          name: formData.name,
          description: formData.description,
          price: formData.price,
          quantity: formData.quantity,
          sale_start: formData.sale_start || null,
          sale_end: formData.sale_end || null,
        })

      if (error) {
        toast.error('Failed to create ticket tier: ' + error.message)
      } else {
        toast.success('Ticket tier created successfully!')
        setFormData({
          name: '',
          description: '',
          price: 0,
          quantity: 100,
          sale_start: '',
          sale_end: '',
        })
        onSuccess?.()
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof TicketTierFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Ticket className="h-5 w-5" />
          Create Ticket Tier
        </CardTitle>
        <CardDescription>
          Add a new ticket tier for your event with pricing and availability settings.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Ticket Name *</Label>
            <Input
              id="name"
              type="text"
              placeholder="e.g., Early Bird, VIP, General Admission"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe what's included with this ticket..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Price (USD) *
              </Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.price}
                onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Quantity Available *
              </Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                placeholder="100"
                value={formData.quantity}
                onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 0)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sale_start" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Sale Start (Optional)
              </Label>
              <Input
                id="sale_start"
                type="datetime-local"
                value={formData.sale_start}
                onChange={(e) => handleInputChange('sale_start', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sale_end" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Sale End (Optional)
              </Label>
              <Input
                id="sale_end"
                type="datetime-local"
                value={formData.sale_end}
                onChange={(e) => handleInputChange('sale_end', e.target.value)}
              />
            </div>
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Creating...' : 'Create Ticket Tier'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
