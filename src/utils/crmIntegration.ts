import { DriverFormValues } from "@/pages/DriverDetails";
import { supabase } from "@/integrations/supabase/client";

export const sendToCRM = async (data: DriverFormValues) => {
  // In a real implementation, this would make an API call to your CRM system
  // For now, we'll just update the driver_details table with the CRM status
  const { error } = await supabase
    .from('driver_details')
    .update({ crm_status: 'pending_payment' })
    .eq('email', data.email);

  if (error) throw error;
  
  return true;
};