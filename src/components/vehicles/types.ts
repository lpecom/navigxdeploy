export interface CarModel {
  id: string;
  name: string;
  category_id: string | null;
  description: string | null;
  image_url: string | null;
  brand_logo_url?: string | null;
  year: string | null;
  optionals: Record<string, any> | null;
  created_at: string | null;
  updated_at: string | null;
  engine_size?: string;
  transmission?: string;
  category?: {
    name: string;
  };
}

export interface CarModelResponse extends Omit<CarModel, 'optionals'> {
  optionals: Record<string, any> | null;
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
  status: string;
  branch?: string;
  chassis_number?: string;
  color?: string;
  contract_number?: string;
  customer_id?: string;
  renavam_number?: string;
  state?: string;
  car_model?: {
    name: string;
    year: string;
    image_url: string | null;
  };
  customer?: {
    full_name: string;
    email?: string;
    phone?: string;
  };
  maintenance_records?: MaintenanceRecord[];
}

export interface MaintenanceRecord {
  id: string;
  vehicle_id: string;
  driver_id: string;
  service_type: string;
  description: string;
  service_date: string;
  cost: number | null;
  status: string;
  created_at: string;
  updated_at: string;
}