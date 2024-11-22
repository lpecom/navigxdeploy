import { Json } from "@/integrations/supabase/types";

export interface PhotoCategory {
  id: string;
  label: string;
}

export interface SelectedCar {
  name: string;
  category: string;
  group_id?: string;
  price?: number;
  period?: string;
}

export interface CheckInReservation {
  id: string;
  selected_car: SelectedCar;
  driver: {
    id: string;
    full_name: string;
    [key: string]: any;
  };
  reservation_number: number;
  pickup_date?: string;
  pickup_time?: string;
  status: string;
  check_in_status?: string;
  check_in_notes?: string;
  check_in_photos?: Json;
  check_in_completed_at?: string;
  check_in_completed_by?: string;
  assigned_vehicle_id?: string;
  [key: string]: any;
}

export interface PhotosState {
  [key: string]: string[];
}

export interface Optional {
  name: string;
  price: number;
}

export interface CheckoutSession {
  id: string;
  reservation_number: number;
  selected_car: SelectedCar;
  driver: {
    id: string;
    full_name: string;
  };
  pickup_date: string;
  pickup_time: string;
  status: string;
  selected_optionals: Optional[];
}