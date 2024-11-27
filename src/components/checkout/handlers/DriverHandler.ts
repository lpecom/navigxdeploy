import { supabase } from "@/integrations/supabase/client";

interface DriverData {
  full_name: string;
  email: string;
  cpf: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  auth_user_id?: string;
}

export const createDriverDetails = async (data: DriverData) => {
  // First check if driver exists by email or CPF
  const { data: existingDriver } = await supabase
    .from('driver_details')
    .select()
    .or(`email.eq.${data.email},cpf.eq.${data.cpf}`)
    .maybeSingle();

  if (existingDriver) {
    // Update existing driver with new information
    const { data: updatedDriver, error: updateError } = await supabase
      .from('driver_details')
      .update({
        full_name: data.full_name,
        email: data.email,
        cpf: data.cpf,
        phone: data.phone,
        address: data.address,
        city: data.city,
        state: data.state,
        postal_code: data.postal_code,
        auth_user_id: data.auth_user_id,
        // Set required fields with default values
        birth_date: existingDriver.birth_date || new Date().toISOString().split('T')[0],
        license_number: existingDriver.license_number || 'PENDING',
        license_expiry: existingDriver.license_expiry || new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
        crm_status: 'pending_approval'
      })
      .eq('id', existingDriver.id)
      .select()
      .single();

    if (updateError) throw updateError;
    return updatedDriver;
  }

  // Create new driver
  const { data: newDriver, error: insertError } = await supabase
    .from('driver_details')
    .insert([{
      full_name: data.full_name,
      email: data.email,
      cpf: data.cpf,
      phone: data.phone,
      address: data.address,
      city: data.city,
      state: data.state,
      postal_code: data.postal_code,
      auth_user_id: data.auth_user_id,
      // Set required fields with default values
      birth_date: new Date().toISOString().split('T')[0],
      license_number: 'PENDING',
      license_expiry: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      crm_status: 'pending_approval'
    }])
    .select()
    .single();

  if (insertError) throw insertError;
  return newDriver;
};