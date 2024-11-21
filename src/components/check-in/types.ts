import { Json } from "@/integrations/supabase/types";
import type { CarModel } from "@/types/vehicles";

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

export interface CarGroup {
  id: string;
  name: string;
  description: string | null;
  display_order: number | null;
  is_active: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface FleetVehicleWithRelations {
  id: string;
  car_model_id: string | null;
  car_model?: {
    id: string;
    name: string;
    image_url: string | null;
    car_group: {
      id: string;
      name: string;
      description: string | null;
      display_order: number | null;
      is_active: boolean | null;
      created_at: string | null;
      updated_at: string | null;
    };
  };
  year: string;
  current_km: number;
  last_revision_date: string;
  next_revision_date: string;
  plate: string;
  is_available?: boolean;
  color?: string;
  state?: string;
  chassis_number?: string;
  renavam_number?: string;
  status?: string;
  contract_number?: string;
  customer_id?: string;
  branch?: string;
}