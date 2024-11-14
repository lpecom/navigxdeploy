export interface Category {
  id: string;
  name: string;
  description: string | null;
  badge_text: string | null;
  display_order: number | null;
  is_active: boolean | null;
}

export interface Offer {
  id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  price: number;
  price_period: string;
  specs: Record<string, any> | null;
  availability: string | null;
  badge_text: string | null;
  display_order: number | null;
  is_active: boolean | null;
}

export interface CarModel {
  id: string;
  category_id: string | null;
  name: string;
  image_url: string | null;
  year: string | null;
  description: string | null;
  optionals: Record<string, any> | null;
  created_at: string | null;
  updated_at: string | null;
  categories?: {
    name: string;
  };
}