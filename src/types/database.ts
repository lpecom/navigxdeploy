import { Json } from "@/integrations/supabase/types";
import { Plans, InsuranceOptions } from './supabase/plans';

export interface Database {
  public: {
    Tables: {
      plans: {
        Row: {
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
        Insert: Omit<Database['public']['Tables']['plans']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['plans']['Insert']>;
      };
      insurance_options: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          coverage_details: Record<string, boolean>;
          price: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['insurance_options']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['insurance_options']['Insert']>;
      };
    };
    Enums: {
      check_in_status: "pending" | "in_progress" | "completed" | "cancelled";
      vehicle_status:
        | "available"
        | "rented"
        | "maintenance"
        | "body_shop"
        | "deactivated"
        | "management"
        | "accident"
        | "electric"
        | "mechanic"
        | "other_maintenance"
        | "for_sale"
        | "preparing";
    };
    Functions: {
      export_fleet_data: {
        Args: Record<PropertyKey, never>;
        Returns: {
          id: string;
          car_model_name: string;
          year: string;
          current_km: number;
          last_revision_date: string;
          next_revision_date: string;
          plate: string;
          is_available: boolean;
          color: string;
          state: string;
          chassis_number: string;
          renavam_number: string;
          status: Database["public"]["Enums"]["vehicle_status"];
          contract_number: string;
          customer_name: string;
          branch: string;
        }[];
      };
    };
  };
}

export type { Plans, InsuranceOptions };