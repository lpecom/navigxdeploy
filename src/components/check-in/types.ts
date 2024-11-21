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
  [key: string]: any;
}

export interface PhotosState {
  [key: string]: string[];
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
  selected_optionals: Array<{
    name: string;
    price: number;
  }>;
}