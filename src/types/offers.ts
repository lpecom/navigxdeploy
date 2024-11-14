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