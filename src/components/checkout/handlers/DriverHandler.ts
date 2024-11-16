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
    .insert([{
      full_name: customer.full_name,
      email: customer.email,
      cpf: customer.cpf,
      phone: customer.phone,
      address: customer.address,
      city: customer.city,
      state: customer.state,
      postal_code: customer.postal_code,
      auth_user_id: customer.auth_user_id,
    }])
    .select()
    .single()

  if (insertError) throw insertError
  return newDriver
}