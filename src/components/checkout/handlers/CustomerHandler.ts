import { supabase } from "@/integrations/supabase/client"

interface CustomerData {
  full_name: string
  email: string
  cpf: string
  phone: string
  birth_date: string
  license_number: string
  license_expiry: string
  address?: string
  city?: string
  state?: string
  postal_code?: string
}

export const handleCustomerData = async (customerData: CustomerData) => {
  // First check if customer exists by email
  const { data: existingCustomerByEmail } = await supabase
    .from('driver_details')
    .select()
    .eq('email', customerData.email)
    .maybeSingle()

  // Then check if customer exists by CPF
  const { data: existingCustomerByCpf } = await supabase
    .from('driver_details')
    .select()
    .eq('cpf', customerData.cpf)
    .maybeSingle()

  const existingCustomer = existingCustomerByEmail || existingCustomerByCpf

  if (existingCustomer) {
    // Update existing customer
    const { data: updatedCustomer, error: updateError } = await supabase
      .from('driver_details')
      .update({
        ...customerData,
        kyc_status: 'pending',
        crm_status: 'pending_payment'
      })
      .eq('id', existingCustomer.id)
      .select()
      .single()

    if (updateError) throw updateError
    return updatedCustomer
  } else {
    // Insert new customer with temporary status
    const { data: newCustomer, error: insertError } = await supabase
      .from('driver_details')
      .insert([{
        ...customerData,
        kyc_status: 'pending',
        crm_status: 'pending_payment'
      }])
      .select()
      .single()

    if (insertError) throw insertError
    return newCustomer
  }
}