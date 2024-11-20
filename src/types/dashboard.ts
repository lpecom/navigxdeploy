import { Json } from "@/integrations/supabase/types";

export interface DashboardCheckoutSession {
  id: string;
  reservation_number: number;
  pickup_date: string;
  pickup_time: string;
  driver: {
    full_name: string;
    phone?: string;
  };
  created_at: string;
  status: string;
  selected_car: Json;
}

export interface SelectedCarData {
  name: string;
  category?: string;
  price?: number;
  period?: string;
}