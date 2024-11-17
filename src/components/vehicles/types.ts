export interface CarModel {
  id: string;
  name: string;
  category_id: string | null;
  description: string | null;
  image_url: string | null;
  year: string | null;
  optionals: Record<string, any> | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface FleetVehicle {
  id: string;
  car_model_id: string;
  year: string;
  current_km: number;
  last_revision_date: string;
  next_revision_date: string;
  plate: string;
  is_available: boolean;
  created_at?: string;
  updated_at?: string;
  car_model?: {
    name: string;
    year: string;
    image_url?: string | null;
  };
}