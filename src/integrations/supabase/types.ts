export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      accessories: {
        Row: {
          created_at: string
          description: string
          id: string
          name: string
          price: number
          price_period: string
          thumbnail_url: string | null
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          name: string
          price: number
          price_period: string
          thumbnail_url?: string | null
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          name?: string
          price?: number
          price_period?: string
          thumbnail_url?: string | null
        }
        Relationships: []
      }
      boletos: {
        Row: {
          barcode: string
          created_at: string
          due_date: string
          id: string
          payment_id: string
          pdf_url: string | null
          status: string
          updated_at: string
        }
        Insert: {
          barcode: string
          created_at?: string
          due_date: string
          id?: string
          payment_id: string
          pdf_url?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          barcode?: string
          created_at?: string
          due_date?: string
          id?: string
          payment_id?: string
          pdf_url?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "boletos_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          }
        ]
      }
      plans: {
        Row: {
          id: string
          name: string
          description: string | null
          type: 'flex' | 'monthly' | 'black'
          period: 'week' | 'month'
          base_price: number
          included_km: number
          extra_km_price: number | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          type: 'flex' | 'monthly' | 'black'
          period: 'week' | 'month'
          base_price: number
          included_km: number
          extra_km_price?: number | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          type?: 'flex' | 'monthly' | 'black'
          period?: 'week' | 'month'
          base_price?: number
          included_km?: number
          extra_km_price?: number | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      insurance_options: {
        Row: {
          id: string
          name: string
          description: string | null
          coverage_details: Record<string, boolean>
          price: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          coverage_details?: Record<string, boolean>
          price: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          coverage_details?: Record<string, boolean>
          price?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      car_groups: {
        Row: {
          created_at: string | null
          description: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      car_models: {
        Row: {
          brand_logo_url: string | null
          category_id: string | null
          created_at: string | null
          daily_price: number | null
          description: string | null
          engine_size: string | null
          features: Json | null
          id: string
          image_url: string | null
          luggage: number | null
          name: string
          optionals: Json | null
          passengers: number | null
          total_price: number | null
          transmission: string | null
          updated_at: string | null
          vehicle_type: string | null
          year: string | null
        }
        Insert: {
          brand_logo_url?: string | null
          category_id?: string | null
          created_at?: string | null
          daily_price?: number | null
          description?: string | null
          engine_size?: string | null
          features?: Json | null
          id?: string
          image_url?: string | null
          luggage?: number | null
          name: string
          optionals?: Json | null
          passengers?: number | null
          total_price?: number | null
          transmission?: string | null
          updated_at?: string | null
          vehicle_type?: string | null
          year?: string | null
        }
        Update: {
          brand_logo_url?: string | null
          category_id?: string | null
          created_at?: string | null
          daily_price?: number | null
          description?: string | null
          engine_size?: string | null
          features?: Json | null
          id?: string
          image_url?: string | null
          luggage?: number | null
          name?: string
          optionals?: Json | null
          passengers?: number | null
          total_price?: number | null
          transmission?: string | null
          updated_at?: string | null
          vehicle_type?: string | null
          year?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "car_models_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          }
        ]
      }
      categories: {
        Row: {
          badge_text: string | null
          created_at: string | null
          description: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          name: string
        }
        Insert: {
          badge_text?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name: string
        }
        Update: {
          badge_text?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
        }
        Relationships: []
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]