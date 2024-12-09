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
          category_id: string | null
          created_at: string
          description: string
          id: string
          name: string
          price: number
          price_period: string
          thumbnail_url: string | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          description: string
          id?: string
          name: string
          price: number
          price_period: string
          thumbnail_url?: string | null
        }
        Update: {
          category_id?: string | null
          created_at?: string
          description?: string
          id?: string
          name?: string
          price?: number
          price_period?: string
          thumbnail_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "accessories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
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
          },
        ]
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
          },
        ]
      }
      cart_items: {
        Row: {
          checkout_session_id: string
          created_at: string
          id: string
          item_id: string
          item_type: string
          quantity: number
          total_price: number
          unit_price: number
          updated_at: string
        }
        Insert: {
          checkout_session_id: string
          created_at?: string
          id?: string
          item_id: string
          item_type: string
          quantity?: number
          total_price: number
          unit_price: number
          updated_at?: string
        }
        Update: {
          checkout_session_id?: string
          created_at?: string
          id?: string
          item_id?: string
          item_type?: string
          quantity?: number
          total_price?: number
          unit_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_checkout_session_id_fkey"
            columns: ["checkout_session_id"]
            isOneToOne: false
            referencedRelation: "checkout_sessions"
            referencedColumns: ["id"]
          },
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
      category_plans: {
        Row: {
          base_price: number
          bullet_points: Json | null
          category_id: string
          conditions: Json | null
          created_at: string | null
          description: string | null
          display_order: number | null
          extra_km_price: number | null
          features: Json | null
          highlight: boolean | null
          id: string
          included_km: number
          is_active: boolean | null
          name: string
          period: string
          type: string
          updated_at: string | null
        }
        Insert: {
          base_price: number
          bullet_points?: Json | null
          category_id: string
          conditions?: Json | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          extra_km_price?: number | null
          features?: Json | null
          highlight?: boolean | null
          id?: string
          included_km: number
          is_active?: boolean | null
          name: string
          period: string
          type: string
          updated_at?: string | null
        }
        Update: {
          base_price?: number
          bullet_points?: Json | null
          category_id?: string
          conditions?: Json | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          extra_km_price?: number | null
          features?: Json | null
          highlight?: boolean | null
          id?: string
          included_km?: number
          is_active?: boolean | null
          name?: string
          period?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "category_plans_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_conversations: {
        Row: {
          admin_user_id: string | null
          created_at: string
          driver_id: string | null
          id: string
          updated_at: string
        }
        Insert: {
          admin_user_id?: string | null
          created_at?: string
          driver_id?: string | null
          id?: string
          updated_at?: string
        }
        Update: {
          admin_user_id?: string | null
          created_at?: string
          driver_id?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          conversation_id: string | null
          created_at: string
          id: string
          role: string
        }
        Insert: {
          content: string
          conversation_id?: string | null
          created_at?: string
          id?: string
          role: string
        }
        Update: {
          content?: string
          conversation_id?: string | null
          created_at?: string
          id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      check_in_changes: {
        Row: {
          change_type: string
          checkout_session_id: string
          created_at: string | null
          created_by: string | null
          id: string
          new_value: Json | null
          previous_value: Json | null
        }
        Insert: {
          change_type: string
          checkout_session_id: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          new_value?: Json | null
          previous_value?: Json | null
        }
        Update: {
          change_type?: string
          checkout_session_id?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          new_value?: Json | null
          previous_value?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "check_in_changes_checkout_session_id_fkey"
            columns: ["checkout_session_id"]
            isOneToOne: false
            referencedRelation: "checkout_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      check_in_documents: {
        Row: {
          checkout_session_id: string
          created_at: string | null
          created_by: string | null
          document_type: string
          file_url: string
          id: string
        }
        Insert: {
          checkout_session_id: string
          created_at?: string | null
          created_by?: string | null
          document_type: string
          file_url: string
          id?: string
        }
        Update: {
          checkout_session_id?: string
          created_at?: string | null
          created_by?: string | null
          document_type?: string
          file_url?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "check_in_documents_checkout_session_id_fkey"
            columns: ["checkout_session_id"]
            isOneToOne: false
            referencedRelation: "checkout_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      check_in_inspection_items: {
        Row: {
          category: string
          created_at: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          name: string
        }
        Insert: {
          category: string
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name: string
        }
        Update: {
          category?: string
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
        }
        Relationships: []
      }
      checkout_sessions: {
        Row: {
          assigned_vehicle_id: string | null
          check_in_completed_at: string | null
          check_in_completed_by: string | null
          check_in_contract_signed: boolean | null
          check_in_damages: Json | null
          check_in_documents_verified: boolean | null
          check_in_fuel_level: number | null
          check_in_initial_km: number | null
          check_in_notes: string | null
          check_in_photos: Json | null
          check_in_status: string | null
          created_at: string
          driver_id: string | null
          guest_email: string | null
          guest_token: string | null
          id: string
          insurance_option_id: string | null
          payment_location: string | null
          payment_type: string | null
          pickup_date: string | null
          pickup_time: string | null
          reservation_number: number
          selected_car: Json
          selected_optionals: Json
          status: string
          total_amount: number
          updated_at: string
        }
        Insert: {
          assigned_vehicle_id?: string | null
          check_in_completed_at?: string | null
          check_in_completed_by?: string | null
          check_in_contract_signed?: boolean | null
          check_in_damages?: Json | null
          check_in_documents_verified?: boolean | null
          check_in_fuel_level?: number | null
          check_in_initial_km?: number | null
          check_in_notes?: string | null
          check_in_photos?: Json | null
          check_in_status?: string | null
          created_at?: string
          driver_id?: string | null
          guest_email?: string | null
          guest_token?: string | null
          id?: string
          insurance_option_id?: string | null
          payment_location?: string | null
          payment_type?: string | null
          pickup_date?: string | null
          pickup_time?: string | null
          reservation_number?: number
          selected_car: Json
          selected_optionals: Json
          status?: string
          total_amount: number
          updated_at?: string
        }
        Update: {
          assigned_vehicle_id?: string | null
          check_in_completed_at?: string | null
          check_in_completed_by?: string | null
          check_in_contract_signed?: boolean | null
          check_in_damages?: Json | null
          check_in_documents_verified?: boolean | null
          check_in_fuel_level?: number | null
          check_in_initial_km?: number | null
          check_in_notes?: string | null
          check_in_photos?: Json | null
          check_in_status?: string | null
          created_at?: string
          driver_id?: string | null
          guest_email?: string | null
          guest_token?: string | null
          id?: string
          insurance_option_id?: string | null
          payment_location?: string | null
          payment_type?: string | null
          pickup_date?: string | null
          pickup_time?: string | null
          reservation_number?: number
          selected_car?: Json
          selected_optionals?: Json
          status?: string
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "checkout_sessions_assigned_vehicle_id_fkey"
            columns: ["assigned_vehicle_id"]
            isOneToOne: false
            referencedRelation: "fleet_vehicles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "checkout_sessions_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "driver_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "checkout_sessions_insurance_option_id_fkey"
            columns: ["insurance_option_id"]
            isOneToOne: false
            referencedRelation: "insurance_options"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          address: string | null
          birth_date: string | null
          city: string | null
          commercial_address: Json | null
          commercial_city: string | null
          commercial_complement: string | null
          commercial_neighborhood: string | null
          commercial_number: string | null
          commercial_phone: string | null
          commercial_postal_code: string | null
          commercial_state: string | null
          contract_count: number | null
          correspondence_address: string | null
          cpf: string
          created_at: string | null
          drivers_license: Json | null
          email: string
          full_name: string
          gender: string | null
          id: string
          last_rental_date: string | null
          license_category: string | null
          license_expiry: string | null
          license_number: string | null
          license_record: string | null
          mobile_phone: string | null
          nationality: string | null
          other_phone: string | null
          phone: string
          postal_code: string | null
          registration_code: string | null
          registration_date: string | null
          registration_type: string | null
          rental_days_count: number | null
          residential_address: Json | null
          residential_complement: string | null
          residential_neighborhood: string | null
          residential_number: string | null
          residential_phone: string | null
          rg: string | null
          state: string | null
          status: string | null
          total_rentals: number | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          birth_date?: string | null
          city?: string | null
          commercial_address?: Json | null
          commercial_city?: string | null
          commercial_complement?: string | null
          commercial_neighborhood?: string | null
          commercial_number?: string | null
          commercial_phone?: string | null
          commercial_postal_code?: string | null
          commercial_state?: string | null
          contract_count?: number | null
          correspondence_address?: string | null
          cpf: string
          created_at?: string | null
          drivers_license?: Json | null
          email: string
          full_name: string
          gender?: string | null
          id?: string
          last_rental_date?: string | null
          license_category?: string | null
          license_expiry?: string | null
          license_number?: string | null
          license_record?: string | null
          mobile_phone?: string | null
          nationality?: string | null
          other_phone?: string | null
          phone: string
          postal_code?: string | null
          registration_code?: string | null
          registration_date?: string | null
          registration_type?: string | null
          rental_days_count?: number | null
          residential_address?: Json | null
          residential_complement?: string | null
          residential_neighborhood?: string | null
          residential_number?: string | null
          residential_phone?: string | null
          rg?: string | null
          state?: string | null
          status?: string | null
          total_rentals?: number | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          birth_date?: string | null
          city?: string | null
          commercial_address?: Json | null
          commercial_city?: string | null
          commercial_complement?: string | null
          commercial_neighborhood?: string | null
          commercial_number?: string | null
          commercial_phone?: string | null
          commercial_postal_code?: string | null
          commercial_state?: string | null
          contract_count?: number | null
          correspondence_address?: string | null
          cpf?: string
          created_at?: string | null
          drivers_license?: Json | null
          email?: string
          full_name?: string
          gender?: string | null
          id?: string
          last_rental_date?: string | null
          license_category?: string | null
          license_expiry?: string | null
          license_number?: string | null
          license_record?: string | null
          mobile_phone?: string | null
          nationality?: string | null
          other_phone?: string | null
          phone?: string
          postal_code?: string | null
          registration_code?: string | null
          registration_date?: string | null
          registration_type?: string | null
          rental_days_count?: number | null
          residential_address?: Json | null
          residential_complement?: string | null
          residential_neighborhood?: string | null
          residential_number?: string | null
          residential_phone?: string | null
          rg?: string | null
          state?: string | null
          status?: string | null
          total_rentals?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      customers_backup: {
        Row: {
          address: string | null
          birth_date: string | null
          city: string | null
          commercial_address: Json | null
          contract_count: number | null
          correspondence_address: string | null
          cpf: string | null
          created_at: string | null
          drivers_license: Json | null
          email: string | null
          full_name: string | null
          gender: string | null
          id: string | null
          last_rental_date: string | null
          mobile_phone: string | null
          nationality: string | null
          other_phone: string | null
          phone: string | null
          postal_code: string | null
          registration_code: string | null
          registration_date: string | null
          registration_type: string | null
          rental_days_count: number | null
          residential_address: Json | null
          rg: string | null
          state: string | null
          status: string | null
          total_rentals: number | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          birth_date?: string | null
          city?: string | null
          commercial_address?: Json | null
          contract_count?: number | null
          correspondence_address?: string | null
          cpf?: string | null
          created_at?: string | null
          drivers_license?: Json | null
          email?: string | null
          full_name?: string | null
          gender?: string | null
          id?: string | null
          last_rental_date?: string | null
          mobile_phone?: string | null
          nationality?: string | null
          other_phone?: string | null
          phone?: string | null
          postal_code?: string | null
          registration_code?: string | null
          registration_date?: string | null
          registration_type?: string | null
          rental_days_count?: number | null
          residential_address?: Json | null
          rg?: string | null
          state?: string | null
          status?: string | null
          total_rentals?: number | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          birth_date?: string | null
          city?: string | null
          commercial_address?: Json | null
          contract_count?: number | null
          correspondence_address?: string | null
          cpf?: string | null
          created_at?: string | null
          drivers_license?: Json | null
          email?: string | null
          full_name?: string | null
          gender?: string | null
          id?: string | null
          last_rental_date?: string | null
          mobile_phone?: string | null
          nationality?: string | null
          other_phone?: string | null
          phone?: string | null
          postal_code?: string | null
          registration_code?: string | null
          registration_date?: string | null
          registration_type?: string | null
          rental_days_count?: number | null
          residential_address?: Json | null
          rg?: string | null
          state?: string | null
          status?: string | null
          total_rentals?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      driver_details: {
        Row: {
          address: string | null
          auth_user_id: string | null
          birth_date: string
          city: string | null
          cpf: string
          created_at: string
          crm_status: string | null
          document_back_url: string | null
          document_front_url: string | null
          email: string
          full_name: string
          id: string
          is_guest: boolean | null
          kyc_rejection_reason: string | null
          kyc_status: Database["public"]["Enums"]["kyc_status"] | null
          kyc_submitted_at: string | null
          kyc_verified_at: string | null
          lead_status: string | null
          license_expiry: string
          license_number: string
          phone: string
          postal_code: string | null
          proof_of_address_url: string | null
          selfie_url: string | null
          state: string | null
        }
        Insert: {
          address?: string | null
          auth_user_id?: string | null
          birth_date: string
          city?: string | null
          cpf: string
          created_at?: string
          crm_status?: string | null
          document_back_url?: string | null
          document_front_url?: string | null
          email: string
          full_name: string
          id?: string
          is_guest?: boolean | null
          kyc_rejection_reason?: string | null
          kyc_status?: Database["public"]["Enums"]["kyc_status"] | null
          kyc_submitted_at?: string | null
          kyc_verified_at?: string | null
          lead_status?: string | null
          license_expiry: string
          license_number: string
          phone: string
          postal_code?: string | null
          proof_of_address_url?: string | null
          selfie_url?: string | null
          state?: string | null
        }
        Update: {
          address?: string | null
          auth_user_id?: string | null
          birth_date?: string
          city?: string | null
          cpf?: string
          created_at?: string
          crm_status?: string | null
          document_back_url?: string | null
          document_front_url?: string | null
          email?: string
          full_name?: string
          id?: string
          is_guest?: boolean | null
          kyc_rejection_reason?: string | null
          kyc_status?: Database["public"]["Enums"]["kyc_status"] | null
          kyc_submitted_at?: string | null
          kyc_verified_at?: string | null
          lead_status?: string | null
          license_expiry?: string
          license_number?: string
          phone?: string
          postal_code?: string | null
          proof_of_address_url?: string | null
          selfie_url?: string | null
          state?: string | null
        }
        Relationships: []
      }
      driver_uber_integrations: {
        Row: {
          access_token: string
          created_at: string | null
          driver_id: string
          id: string
          is_active: boolean | null
          refresh_token: string
          token_expires_at: string
          uber_driver_id: string
          updated_at: string | null
        }
        Insert: {
          access_token: string
          created_at?: string | null
          driver_id: string
          id?: string
          is_active?: boolean | null
          refresh_token: string
          token_expires_at: string
          uber_driver_id: string
          updated_at?: string | null
        }
        Update: {
          access_token?: string
          created_at?: string | null
          driver_id?: string
          id?: string
          is_active?: boolean | null
          refresh_token?: string
          token_expires_at?: string
          uber_driver_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "driver_uber_integrations_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: true
            referencedRelation: "driver_details"
            referencedColumns: ["id"]
          },
        ]
      }
      fipe_cache: {
        Row: {
          brand: string
          created_at: string | null
          fipe_code: string
          fuel: string | null
          id: string
          model: string
          price: number | null
          raw_data: Json | null
          reference_month: string | null
          updated_at: string | null
          vehicle_type: Database["public"]["Enums"]["vehicle_type"]
          year: string
        }
        Insert: {
          brand: string
          created_at?: string | null
          fipe_code: string
          fuel?: string | null
          id?: string
          model: string
          price?: number | null
          raw_data?: Json | null
          reference_month?: string | null
          updated_at?: string | null
          vehicle_type: Database["public"]["Enums"]["vehicle_type"]
          year: string
        }
        Update: {
          brand?: string
          created_at?: string | null
          fipe_code?: string
          fuel?: string | null
          id?: string
          model?: string
          price?: number | null
          raw_data?: Json | null
          reference_month?: string | null
          updated_at?: string | null
          vehicle_type?: Database["public"]["Enums"]["vehicle_type"]
          year?: string
        }
        Relationships: []
      }
      fleet_vehicles: {
        Row: {
          branch: string | null
          car_model_id: string | null
          chassis_number: string | null
          color: string | null
          contract_number: string | null
          created_at: string | null
          current_km: number
          customer_id: string | null
          id: string
          is_available: boolean | null
          last_revision_date: string
          next_revision_date: string
          plate: string
          renavam_number: string | null
          state: string | null
          status: Database["public"]["Enums"]["vehicle_status"] | null
          updated_at: string | null
          year: string
        }
        Insert: {
          branch?: string | null
          car_model_id?: string | null
          chassis_number?: string | null
          color?: string | null
          contract_number?: string | null
          created_at?: string | null
          current_km: number
          customer_id?: string | null
          id?: string
          is_available?: boolean | null
          last_revision_date: string
          next_revision_date: string
          plate: string
          renavam_number?: string | null
          state?: string | null
          status?: Database["public"]["Enums"]["vehicle_status"] | null
          updated_at?: string | null
          year: string
        }
        Update: {
          branch?: string | null
          car_model_id?: string | null
          chassis_number?: string | null
          color?: string | null
          contract_number?: string | null
          created_at?: string | null
          current_km?: number
          customer_id?: string | null
          id?: string
          is_available?: boolean | null
          last_revision_date?: string
          next_revision_date?: string
          plate?: string
          renavam_number?: string | null
          state?: string | null
          status?: Database["public"]["Enums"]["vehicle_status"] | null
          updated_at?: string | null
          year?: string
        }
        Relationships: [
          {
            foreignKeyName: "fleet_vehicles_car_model_id_fkey"
            columns: ["car_model_id"]
            isOneToOne: false
            referencedRelation: "car_models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fleet_vehicles_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      group_fares: {
        Row: {
          base_price: number
          car_group_id: string
          created_at: string | null
          extra_km_price: number | null
          id: string
          is_active: boolean | null
          km_included: number | null
          plan_type: string
          price_period: string
          updated_at: string | null
        }
        Insert: {
          base_price: number
          car_group_id: string
          created_at?: string | null
          extra_km_price?: number | null
          id?: string
          is_active?: boolean | null
          km_included?: number | null
          plan_type: string
          price_period: string
          updated_at?: string | null
        }
        Update: {
          base_price?: number
          car_group_id?: string
          created_at?: string | null
          extra_km_price?: number | null
          id?: string
          is_active?: boolean | null
          km_included?: number | null
          plan_type?: string
          price_period?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "group_fares_car_group_id_fkey"
            columns: ["car_group_id"]
            isOneToOne: false
            referencedRelation: "car_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      insurance_options: {
        Row: {
          category_id: string | null
          coverage_details: Json
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          price: number
          updated_at: string | null
        }
        Insert: {
          category_id?: string | null
          coverage_details?: Json
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          price: number
          updated_at?: string | null
        }
        Update: {
          category_id?: string | null
          coverage_details?: Json
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "insurance_options_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          driver_id: string
          due_date: string
          id: string
          invoice_number: number
          payment_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          driver_id: string
          due_date: string
          id?: string
          invoice_number?: number
          payment_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          driver_id?: string
          due_date?: string
          id?: string
          invoice_number?: number
          payment_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "driver_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_records: {
        Row: {
          cost: number | null
          created_at: string
          description: string
          driver_id: string
          id: string
          service_date: string
          service_type: string
          status: string
          updated_at: string
          vehicle_id: string | null
        }
        Insert: {
          cost?: number | null
          created_at?: string
          description: string
          driver_id: string
          id?: string
          service_date: string
          service_type: string
          status?: string
          updated_at?: string
          vehicle_id?: string | null
        }
        Update: {
          cost?: number | null
          created_at?: string
          description?: string
          driver_id?: string
          id?: string
          service_date?: string
          service_type?: string
          status?: string
          updated_at?: string
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_records_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "driver_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_records_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "fleet_vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          driver_id: string
          id: string
          is_read: boolean
          message: string
          title: string
          type: string
        }
        Insert: {
          created_at?: string
          driver_id: string
          id?: string
          is_read?: boolean
          message: string
          title: string
          type: string
        }
        Update: {
          created_at?: string
          driver_id?: string
          id?: string
          is_read?: boolean
          message?: string
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "driver_details"
            referencedColumns: ["id"]
          },
        ]
      }
      offers: {
        Row: {
          availability: string | null
          badge_text: string | null
          banner_image: string | null
          category_id: string | null
          created_at: string | null
          description: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          name: string
          price: number
          price_period: string
          specs: Json | null
          template_type: string | null
        }
        Insert: {
          availability?: string | null
          badge_text?: string | null
          banner_image?: string | null
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          price: number
          price_period: string
          specs?: Json | null
          template_type?: string | null
        }
        Update: {
          availability?: string | null
          badge_text?: string | null
          banner_image?: string | null
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          price?: number
          price_period?: string
          specs?: Json | null
          template_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "offers_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          additional_services: Json | null
          created_at: string
          customer_id: string | null
          driver_id: string | null
          id: string
          insurance_details: Json | null
          notes: string | null
          order_number: number
          payment_method: string | null
          payment_status: string
          pickup_date: string | null
          return_date: string | null
          status: string
          total_amount: number
          updated_at: string
          vehicle_id: string | null
        }
        Insert: {
          additional_services?: Json | null
          created_at?: string
          customer_id?: string | null
          driver_id?: string | null
          id?: string
          insurance_details?: Json | null
          notes?: string | null
          order_number?: number
          payment_method?: string | null
          payment_status?: string
          pickup_date?: string | null
          return_date?: string | null
          status?: string
          total_amount: number
          updated_at?: string
          vehicle_id?: string | null
        }
        Update: {
          additional_services?: Json | null
          created_at?: string
          customer_id?: string | null
          driver_id?: string | null
          id?: string
          insurance_details?: Json | null
          notes?: string | null
          order_number?: number
          payment_method?: string | null
          payment_status?: string
          pickup_date?: string | null
          return_date?: string | null
          status?: string
          total_amount?: number
          updated_at?: string
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "driver_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "fleet_vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_methods: {
        Row: {
          card_brand: string
          card_token: string
          created_at: string
          driver_id: string
          holder_name: string
          id: string
          is_default: boolean | null
          last_four: string
          updated_at: string
        }
        Insert: {
          card_brand: string
          card_token: string
          created_at?: string
          driver_id: string
          holder_name: string
          id?: string
          is_default?: boolean | null
          last_four: string
          updated_at?: string
        }
        Update: {
          card_brand?: string
          card_token?: string
          created_at?: string
          driver_id?: string
          holder_name?: string
          id?: string
          is_default?: boolean | null
          last_four?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_methods_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "driver_details"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          appmax_transaction_id: string | null
          created_at: string
          description: string | null
          driver_id: string
          id: string
          installments: number | null
          payment_type: string
          status: string
          updated_at: string
        }
        Insert: {
          amount: number
          appmax_transaction_id?: string | null
          created_at?: string
          description?: string | null
          driver_id: string
          id?: string
          installments?: number | null
          payment_type: string
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          appmax_transaction_id?: string | null
          created_at?: string
          description?: string | null
          driver_id?: string
          id?: string
          installments?: number | null
          payment_type?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "driver_details"
            referencedColumns: ["id"]
          },
        ]
      }
      pix_payments: {
        Row: {
          created_at: string
          expiration_date: string
          id: string
          payment_id: string
          qr_code: string
          qr_code_url: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          expiration_date: string
          id?: string
          payment_id: string
          qr_code: string
          qr_code_url: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          expiration_date?: string
          id?: string
          payment_id?: string
          qr_code?: string
          qr_code_url?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pix_payments_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      plans: {
        Row: {
          base_price: number
          bullet_points: Json | null
          conditions: Json | null
          created_at: string | null
          description: string | null
          display_order: number | null
          extra_km_price: number | null
          features: Json | null
          highlight: boolean | null
          id: string
          included_km: number
          is_active: boolean | null
          name: string
          period: string
          type: string
          updated_at: string | null
        }
        Insert: {
          base_price: number
          bullet_points?: Json | null
          conditions?: Json | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          extra_km_price?: number | null
          features?: Json | null
          highlight?: boolean | null
          id?: string
          included_km: number
          is_active?: boolean | null
          name: string
          period: string
          type: string
          updated_at?: string | null
        }
        Update: {
          base_price?: number
          bullet_points?: Json | null
          conditions?: Json | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          extra_km_price?: number | null
          features?: Json | null
          highlight?: boolean | null
          id?: string
          included_km?: number
          is_active?: boolean | null
          name?: string
          period?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      stripe_customers: {
        Row: {
          created_at: string | null
          driver_id: string
          id: string
          stripe_customer_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          driver_id: string
          id?: string
          stripe_customer_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          driver_id?: string
          id?: string
          stripe_customer_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stripe_customers_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "driver_details"
            referencedColumns: ["id"]
          },
        ]
      }
      stripe_payment_intents: {
        Row: {
          amount: number
          created_at: string | null
          currency: string
          driver_id: string
          id: string
          payment_intent_id: string
          status: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string
          driver_id: string
          id?: string
          payment_intent_id: string
          status: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string
          driver_id?: string
          id?: string
          payment_intent_id?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stripe_payment_intents_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "driver_details"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          category: string
          created_at: string
          description: string
          driver_id: string
          id: string
          status: string
          title: string
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          driver_id: string
          id?: string
          status?: string
          title: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          driver_id?: string
          id?: string
          status?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_tickets_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "driver_details"
            referencedColumns: ["id"]
          },
        ]
      }
      uber_vehicle_registrations: {
        Row: {
          created_at: string | null
          document_urls: Json | null
          fleet_vehicle_id: string
          id: string
          inspection_status: string | null
          last_sync_attempt: string | null
          last_sync_error: string | null
          sync_status: string
          uber_vehicle_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          document_urls?: Json | null
          fleet_vehicle_id: string
          id?: string
          inspection_status?: string | null
          last_sync_attempt?: string | null
          last_sync_error?: string | null
          sync_status?: string
          uber_vehicle_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          document_urls?: Json | null
          fleet_vehicle_id?: string
          id?: string
          inspection_status?: string | null
          last_sync_attempt?: string | null
          last_sync_error?: string | null
          sync_status?: string
          uber_vehicle_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "uber_vehicle_registrations_fleet_vehicle_id_fkey"
            columns: ["fleet_vehicle_id"]
            isOneToOne: true
            referencedRelation: "fleet_vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_fines: {
        Row: {
          created_at: string | null
          fine_amount: number | null
          fine_code: string | null
          fine_date: string | null
          fine_description: string | null
          fine_location: string | null
          fine_points: number | null
          fine_status: string | null
          id: string
          last_sinesp_check: string | null
          raw_data: Json | null
          sinesp_data: Json | null
          source_url: string | null
          updated_at: string | null
          vehicle_id: string | null
        }
        Insert: {
          created_at?: string | null
          fine_amount?: number | null
          fine_code?: string | null
          fine_date?: string | null
          fine_description?: string | null
          fine_location?: string | null
          fine_points?: number | null
          fine_status?: string | null
          id?: string
          last_sinesp_check?: string | null
          raw_data?: Json | null
          sinesp_data?: Json | null
          source_url?: string | null
          updated_at?: string | null
          vehicle_id?: string | null
        }
        Update: {
          created_at?: string | null
          fine_amount?: number | null
          fine_code?: string | null
          fine_date?: string | null
          fine_description?: string | null
          fine_location?: string | null
          fine_points?: number | null
          fine_status?: string | null
          id?: string
          last_sinesp_check?: string | null
          raw_data?: Json | null
          sinesp_data?: Json | null
          source_url?: string | null
          updated_at?: string | null
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_fines_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "fleet_vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_profitability: {
        Row: {
          common_issues: Json | null
          created_at: string | null
          fipe_price: number | null
          id: string
          last_fipe_update: string | null
          monthly_metrics: Json | null
          total_days_rented: number | null
          total_maintenance_cost: number | null
          total_revenue: number | null
          updated_at: string | null
          vehicle_id: string
        }
        Insert: {
          common_issues?: Json | null
          created_at?: string | null
          fipe_price?: number | null
          id?: string
          last_fipe_update?: string | null
          monthly_metrics?: Json | null
          total_days_rented?: number | null
          total_maintenance_cost?: number | null
          total_revenue?: number | null
          updated_at?: string | null
          vehicle_id: string
        }
        Update: {
          common_issues?: Json | null
          created_at?: string | null
          fipe_price?: number | null
          id?: string
          last_fipe_update?: string | null
          monthly_metrics?: Json | null
          total_days_rented?: number | null
          total_maintenance_cost?: number | null
          total_revenue?: number | null
          updated_at?: string | null
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_profitability_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "fleet_vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles: {
        Row: {
          car_group_id: string | null
          category: string
          consumption: string
          created_at: string
          doors: number
          engine_size: string
          features: string[]
          fuel_type: string
          id: string
          image_url: string
          name: string
          passengers: number
          transmission: string
        }
        Insert: {
          car_group_id?: string | null
          category: string
          consumption: string
          created_at?: string
          doors: number
          engine_size: string
          features?: string[]
          fuel_type: string
          id?: string
          image_url: string
          name: string
          passengers: number
          transmission: string
        }
        Update: {
          car_group_id?: string | null
          category?: string
          consumption?: string
          created_at?: string
          doors?: number
          engine_size?: string
          features?: string[]
          fuel_type?: string
          id?: string
          image_url?: string
          name?: string
          passengers?: number
          transmission?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_car_group_id_fkey"
            columns: ["car_group_id"]
            isOneToOne: false
            referencedRelation: "car_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      wallet: {
        Row: {
          balance: number
          created_at: string
          driver_id: string
          id: string
          updated_at: string
        }
        Insert: {
          balance?: number
          created_at?: string
          driver_id: string
          id?: string
          updated_at?: string
        }
        Update: {
          balance?: number
          created_at?: string
          driver_id?: string
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "wallet_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: true
            referencedRelation: "driver_details"
            referencedColumns: ["id"]
          },
        ]
      }
      website_settings: {
        Row: {
          created_at: string
          id: string
          settings: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          settings?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          settings?: Json
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      export_fleet_data: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          car_model_name: string
          year: string
          current_km: number
          last_revision_date: string
          next_revision_date: string
          plate: string
          is_available: boolean
          color: string
          state: string
          chassis_number: string
          renavam_number: string
          status: Database["public"]["Enums"]["vehicle_status"]
          contract_number: string
          customer_name: string
          branch: string
        }[]
      }
    }
    Enums: {
      check_in_status: "pending" | "in_progress" | "completed" | "cancelled"
      kyc_status: "pending" | "submitted" | "verified" | "rejected"
      vehicle_status:
        | "available"
        | "rented"
        | "maintenance"
        | "body_shop"
        | "deactivated"
        | "management"
        | "accident"
        | "electric"
        | "mechanic"
        | "other_maintenance"
        | "for_sale"
        | "preparing"
      vehicle_type: "cars" | "motorcycles" | "trucks"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
