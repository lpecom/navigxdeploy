export interface CarModel {
  id: string;
  name: string;
  category: string;
  engine_size: string;
  transmission: string;
  fuel_type: string;
  consumption: string;
  doors: number;
  passengers: number;
  image_url: string;
  features: string[];
  car_group_id: string | null;
  car_groups?: {
    name: string;
  };
}

export interface CarModelResponse extends Omit<CarModel, 'optionals'> {
  optionals: Record<string, any> | null;
}