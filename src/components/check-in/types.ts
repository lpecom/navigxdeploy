import { Json } from "@/integrations/supabase/types";
import type { CarModel, FleetVehicle } from "@/types/vehicles";

export interface PhotoCategory {
  id: string;
  label: string;
}

export interface SelectedCar {
  name: string;
  category: string;
  plan_type?: string;
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
  check_in_damages?: Json;
  check_in_fuel_level?: number;
  check_in_initial_km?: number;
  check_in_contract_signed?: boolean;
  check_in_documents_verified?: boolean;
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

export interface FleetVehicleWithRelations extends FleetVehicle {
  car_model?: CarModel & {
    car_group?: {
      id: string;
      name: string;
      description?: string;
      display_order?: number;
      is_active?: boolean;
      created_at?: string;
      updated_at?: string;
    };
  };
}

export interface InspectionItem {
  id: string;
  name: string;
  category: string;
  display_order: number;
  is_active: boolean;
}