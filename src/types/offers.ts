export interface Category {
  id: string;
  name: string;
  description: string | null;
  badge_text: string | null;
  display_order: number | null;
  is_active: boolean | null;
  created_at?: string;
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
  banner_image: string | null;
  template_type: string;
  categories?: {
    name: string;
    badge_text: string | null;
  };
}