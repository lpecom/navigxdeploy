import { DriverFormValues } from "@/pages/DriverDetails";
import { supabase } from "@/integrations/supabase/client";

export const sendToCRM = async (data: DriverFormValues) => {
  const { error } = await supabase
    .from('driver_details')
    .update({
      crm_status: 'pending_payment',
      birth_date: new Date().toISOString(),
      license_number: 'PENDING',
      license_expiry: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
      phone: 'PENDING'
    })
    .eq('email', data.email);

  if (error) throw error;
  
  return true;
};