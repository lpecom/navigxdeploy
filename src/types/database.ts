import { Json } from "@/integrations/supabase/types";

export interface Plans {
  id: string;
  name: string;
  description?: string;
  type: 'flex' | 'monthly' | 'black';
  period: 'week' | 'month';
  base_price: number;
  included_km: number;
  extra_km_price?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface InsuranceOptions {
  id: string;
  name: string;
  description?: string;
  coverage_details: Record<string, boolean>;
  price: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CheckoutSession {
  id: string;
  driver_id?: string;
  selected_car: Json;
  selected_optionals: Json;
  total_amount: number;
  status: string;
  created_at: string;
  updated_at: string;
  pickup_date?: string;
  pickup_time?: string;
  reservation_number: number;
  assigned_vehicle_id?: string;
  check_in_status?: string;
  check_in_notes?: string;
  check_in_photos?: Json;
  check_in_completed_at?: string;
  check_in_completed_by?: string;
}

export interface DriverDetails {
  id: string;
  full_name: string;
  birth_date: string;
  license_number: string;
  license_expiry: string;
  cpf: string;
  phone: string;
  email: string;
  created_at: string;
  crm_status?: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  auth_user_id?: string;
}

export interface Wallet {
  id: string;
  driver_id: string;
  balance: number;
  created_at: string;
  updated_at: string;
}