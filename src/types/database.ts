import { Database as DatabaseGenerated } from "@/integrations/supabase/types";

// Extract specific table types
export type Tables = DatabaseGenerated["public"]["Tables"];
export type Plans = {
  id: string;
  name: string;
  description: string | null;
  type: 'flex' | 'monthly' | 'black';
  period: 'week' | 'month';
  base_price: number;
  included_km: number;
  extra_km_price: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};
export type InsuranceOptions = {
  id: string;
  name: string;
  description: string | null;
  coverage_details: Record<string, boolean>;
  price: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};