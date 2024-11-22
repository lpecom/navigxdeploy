import { Json } from "@/integrations/supabase/types";

export interface Plans {
  id: string;
  name: string;
  description?: string | null;
  type: 'flex' | 'monthly' | 'black';
  period: 'week' | 'month';
  base_price: number;
  included_km: number;
  extra_km_price?: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  features: string[];
  bullet_points: { km: string; price: string; }[];
  highlight: boolean;
  display_order: number;
  conditions?: Json | null;
}

export interface InsuranceOptions {
  id: string;
  name: string;
  description?: string | null;
  coverage_details: Record<string, boolean>;
  price: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}