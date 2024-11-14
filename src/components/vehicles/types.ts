import { Json } from "@/integrations/supabase/types";

export interface CarModel {
  id: string;
  name: string;
  category_id: string | null;
  description: string | null;
  image_url: string | null;
  year: string | null;
  optionals: Record<string, any> | null;
  created_at: string | null;
  updated_at: string | null;
  category?: {
    name: string;
  };
}

export interface CarModelResponse {
  id: string;
  name: string;
  category_id: string | null;
  description: string | null;
  image_url: string | null;
  year: string | null;
  optionals: Json;
  created_at: string | null;
  updated_at: string | null;
  category?: {
    name: string;
  };
}