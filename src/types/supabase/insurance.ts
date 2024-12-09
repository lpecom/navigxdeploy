import { Json } from "@/integrations/supabase/types";

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