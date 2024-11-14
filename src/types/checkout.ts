import { Json } from "@/integrations/supabase/types";

// This type represents the JSON structure we'll store in Supabase
export interface JsonCartItem {
  id: string;
  type: 'car' | 'optional';
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface CheckoutSession {
  id?: string;
  driver_id: string;
  selected_car: Json;  // Changed back to Json type for Supabase compatibility
  selected_optionals: Json;  // Changed back to Json type for Supabase compatibility
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