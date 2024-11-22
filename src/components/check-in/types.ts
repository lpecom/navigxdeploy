import type { Json } from "@/integrations/supabase/types";

export type PhotoCategories = "exterior" | "interior" | "documents";

export interface CheckInReservation {
  id: string;
  driver_id: string;
  selected_car: Json;
  selected_optionals: Json[];
  total_amount: number;
  status: string;
  pickup_date: string;
  pickup_time: string;
  reservation_number: number;
  assigned_vehicle_id: string | null;
  check_in_status: string | null;
  check_in_notes: string | null;
  check_in_photos: Record<PhotoCategories, string[]> | null;
  check_in_completed_at: string | null;
  check_in_completed_by: string | null;
  driver: {
    full_name: string;
    email: string | null;
    phone: string | null;
  };
}

export interface FleetVehicleWithRelations {
  id: string;
  car_model_id: string;
  year: string;
  current_km: number;
  last_revision_date: string;
  next_revision_date: string;
  plate: string;
  is_available: boolean;
  status: string;
  car_model?: {
    id: string;
    name: string;
    image_url: string | null;
  };
}