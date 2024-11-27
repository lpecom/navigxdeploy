import { supabase } from "@/integrations/supabase/client";

export interface DriverData {
  full_name: string;
  email: string;
  cpf: string;
  phone: string;
  birth_date: string;
  license_number: string;
  license_expiry: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  auth_user_id?: string;
}

export const createDriverDetails = async (data: DriverData) => {
  try {
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
          birth_date: data.birth_date,
          license_number: data.license_number,
          license_expiry: data.license_expiry,
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
        birth_date: data.birth_date,
        license_number: data.license_number,
        license_expiry: data.license_expiry,
        crm_status: 'pending_approval'
      }])
      .select()
      .single();

    if (insertError) throw insertError;
    return newDriver;
  } catch (error) {
    console.error('Error in createDriverDetails:', error);
    throw error;
  }
};