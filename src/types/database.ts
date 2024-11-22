import { Database as DatabaseGenerated } from "@/integrations/supabase/types";

// Extract specific table types
export type Tables = DatabaseGenerated["public"]["Tables"];
export type Plans = Tables["plans"]["Row"];
export type InsuranceOptions = Tables["insurance_options"]["Row"];