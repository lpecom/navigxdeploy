import { supabase } from "@/integrations/supabase/client"

interface CustomerData {
  full_name: string
  email: string
  cpf: string
  phone: string
  address?: string
  city?: string
  state?: string
  postal_code?: string
  auth_user_id?: string
}

export const handleCustomerData = async (customerData: CustomerData) => {
  // First check if customer exists by email
  const { data: existingCustomerByEmail } = await supabase
    .from('customers')
    .select()
    .eq('email', customerData.email)
    .maybeSingle()

  // Then check if customer exists by CPF
  const { data: existingCustomerByCpf } = await supabase
    .from('customers')
    .select()
    .eq('cpf', customerData.cpf)
    .maybeSingle()

  const existingCustomer = existingCustomerByEmail || existingCustomerByCpf

  if (existingCustomer) {
    // Update existing customer
    const { data: updatedCustomer, error: updateError } = await supabase
      .from('customers')
      .update(customerData)
      .eq('id', existingCustomer.id)
      .select()
      .single()

    if (updateError) throw updateError
    return updatedCustomer
  } else {
    // Insert new customer
    const { data: newCustomer, error: insertError } = await supabase
      .from('customers')
      .insert([customerData])
      .select()
      .single()

    if (insertError) throw insertError
    return newCustomer
  }
}