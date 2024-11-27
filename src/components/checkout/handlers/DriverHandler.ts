import { supabase } from "@/integrations/supabase/client"

export const createDriverDetails = async (customer: any) => {
  const { data: existingDriver } = await supabase
    .from('driver_details')
    .select()
    .eq('email', customer.email)
    .maybeSingle()

  if (existingDriver) {
    // Update existing driver
    const { data: updatedDriver, error: updateError } = await supabase
      .from('driver_details')
      .update({
        full_name: customer.full_name,
        email: customer.email,
        cpf: customer.cpf,
        phone: customer.phone,
        address: customer.address,
        city: customer.city,
        state: customer.state,
        postal_code: customer.postal_code,
        auth_user_id: customer.auth_user_id,
        // Set required fields with default values if not provided
        birth_date: customer.birth_date || new Date().toISOString().split('T')[0],
        license_number: customer.license_number || 'PENDING',
        license_expiry: customer.license_expiry || new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
      })
      .eq('id', existingDriver.id)
      .select()
      .single()

    if (updateError) throw updateError
    return updatedDriver
  }

  // Create new driver
  const { data: newDriver, error: insertError } = await supabase
    .from('driver_details')
    .insert({
      full_name: customer.full_name,
      email: customer.email,
      cpf: customer.cpf,
      phone: customer.phone,
      address: customer.address,
      city: customer.city,
      state: customer.state,
      postal_code: customer.postal_code,
      auth_user_id: customer.auth_user_id,
      // Set required fields with default values
      birth_date: customer.birth_date || new Date().toISOString().split('T')[0],
      license_number: customer.license_number || 'PENDING',
      license_expiry: customer.license_expiry || new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
    })
    .select()
    .single()

  if (insertError) throw insertError
  return newDriver
}