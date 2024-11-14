import { supabase } from "@/integrations/supabase/client";

export interface CRMLead {
  driver_id: string;
  checkout_session_id: string;
  status: 'pending_payment' | 'paid' | 'cancelled';
  notes?: string;
}

export const createCRMLead = async (lead: CRMLead) => {
  const { data, error } = await supabase
    .from('crm_leads')
    .insert(lead)
    .select()
    .single();

  if (error) throw error;
  return data;
};