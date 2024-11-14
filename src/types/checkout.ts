import { Json } from "@/integrations/supabase/types";

interface JsonCartItem {
  id: string;
  type: 'car' | 'optional';
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface CheckoutSession {
  id?: string;
  driver_id: string;
  selected_car: JsonCartItem | null;
  selected_optionals: JsonCartItem[];
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