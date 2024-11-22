import { Json } from "@/integrations/supabase/types";

// This type represents the JSON structure we'll store in Supabase
export interface JsonCartItem {
  id: string;
  type: 'car' | 'optional';
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface SelectedCar {
  name: string;
  category: string;
  price: number;
  period: string;
  group_id?: string;
}

export interface Optional {
  id: string;
  name: string;
  totalPrice: number;
}

export interface CheckoutSession {
  id?: string;
  driver_id: string;
  selected_car: SelectedCar;
  selected_optionals: Optional[];
  total_amount: number;
  status?: string;
  created_at?: string;
  updated_at?: string;
  pickup_date?: string;
  pickup_time?: string;
  reservation_number?: number;
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