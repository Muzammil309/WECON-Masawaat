export interface Database {
  public: {
    Tables: {
      em_profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          role: 'attendee' | 'organizer' | 'speaker' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'attendee' | 'organizer' | 'speaker' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'attendee' | 'organizer' | 'speaker' | 'admin'
          created_at?: string
          updated_at?: string
        }
      }
      em_events: {
        Row: {
          id: string
          title: string
          description: string | null
          start_date: string
          end_date: string
          location: string | null
          max_attendees: number | null
          organizer_id: string
          status: 'draft' | 'published' | 'cancelled' | 'completed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          start_date: string
          end_date: string
          location?: string | null
          max_attendees?: number | null
          organizer_id: string
          status?: 'draft' | 'published' | 'cancelled' | 'completed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          start_date?: string
          end_date?: string
          location?: string | null
          max_attendees?: number | null
          organizer_id?: string
          status?: 'draft' | 'published' | 'cancelled' | 'completed'
          created_at?: string
          updated_at?: string
        }
      }
      em_ticket_tiers: {
        Row: {
          id: string
          event_id: string
          name: string
          description: string | null
          price: number
          quantity: number
          sold: number
          sale_start: string | null
          sale_end: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          event_id: string
          name: string
          description?: string | null
          price: number
          quantity: number
          sold?: number
          sale_start?: string | null
          sale_end?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          name?: string
          description?: string | null
          price?: number
          quantity?: number
          sold?: number
          sale_start?: string | null
          sale_end?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      em_orders: {
        Row: {
          id: string
          user_id: string
          event_id: string
          total_amount: number
          status: 'pending' | 'completed' | 'cancelled' | 'refunded'
          stripe_payment_intent_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          event_id: string
          total_amount: number
          status?: 'pending' | 'completed' | 'cancelled' | 'refunded'
          stripe_payment_intent_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          event_id?: string
          total_amount?: number
          status?: 'pending' | 'completed' | 'cancelled' | 'refunded'
          stripe_payment_intent_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      em_tickets: {
        Row: {
          id: string
          order_id: string
          ticket_tier_id: string
          user_id: string
          qr_code: string
          checked_in: boolean
          checked_in_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_id: string
          ticket_tier_id: string
          user_id: string
          qr_code: string
          checked_in?: boolean
          checked_in_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          ticket_tier_id?: string
          user_id?: string
          qr_code?: string
          checked_in?: boolean
          checked_in_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
