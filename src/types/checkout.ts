import { Json } from "@/integrations/supabase/types";

export interface CheckoutSession {
  id?: string;
  driver_id?: string;
  selected_car: Json;
  selected_optionals: Json;
  total_amount: number;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CheckoutFormData {
  fullName: string;
  birthDate: string;
  licenseNumber: string;
  licenseExpiry: string;
  cpf: string;
  phone: string;
  email: string;
}