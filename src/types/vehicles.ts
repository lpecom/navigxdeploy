export interface CarModel {
  id: string;
  category_id: string | null;
  name: string;
  image_url: string | null;
  year: string | null;
  brand_logo_url: string | null;
  description?: string | null;
  engine_size?: string | null;
  transmission?: string | null;
  optionals?: Record<string, any> | null;
  created_at?: string | null;
  updated_at?: string | null;
  category?: {
    name: string;
  };
}

export interface CarModelResponse extends CarModel {
  optionals: Record<string, any> | null;
}

export interface MaintenanceRecord {
  id: string;
  vehicle_id?: string;
  driver_id: string;
  service_type: string;
  description: string;
  service_date: string;
  cost?: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface FleetVehicle {
  id: string;
  car_model_id?: string;
  car_model?: CarModel;
  year: string;
  current_km: number;
  last_revision_date: string;
  next_revision_date: string;
  plate: string;
  is_available?: boolean;
  created_at?: string;
  updated_at?: string;
  color?: string;
  state?: string;
  chassis_number?: string;
  renavam_number?: string;
  status?: string;
  contract_number?: string;
  customer_id?: string;
  customer?: {
    full_name: string;
    email?: string;
    phone?: string;
  };
  branch?: string;
}
