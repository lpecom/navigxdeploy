export interface CarModel {
  id: string;
  category_id: string;
  name: string;
  image_url: string | null;
  year: string | null;
  description: string | null;
  optionals: Record<string, boolean> | null;
  categories?: {
    name: string;
  };
}

export interface CarModelResponse extends Omit<CarModel, 'optionals'> {
  optionals: Record<string, any> | null;
}