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
  auth_user_id?: string
}

export const handleCustomerData = async (customerData: CustomerData) => {
  // First check if customer exists by email or CPF
  const { data: existingCustomer } = await supabase
    .from('driver_details')
    .select()
    .or(`email.eq.${customerData.email},cpf.eq.${customerData.cpf}`)
    .maybeSingle()

  if (existingCustomer) {
    throw new Error('Customer already exists')
  }

  // Insert new customer with temporary status
  const { data: newCustomer, error: insertError } = await supabase
    .from('driver_details')
    .insert([{
      ...customerData,
      kyc_status: 'pending',
      crm_status: 'pending_payment',
      auth_user_id: customerData.auth_user_id
    }])
    .select()
    .single()

  if (insertError) throw insertError
  return newCustomer
}