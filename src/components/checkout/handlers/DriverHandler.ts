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
}

export const createDriverDetails = async (customerData: CustomerData) => {
  const { data: driverData, error: driverError } = await supabase
    .from('driver_details')
    .insert([{
      full_name: customerData.full_name,
      email: customerData.email,
      cpf: customerData.cpf,
      phone: customerData.phone,
      birth_date: new Date().toISOString().split('T')[0],
      license_number: 'PENDING',
      license_expiry: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      address: customerData.address,
      city: customerData.city,
      state: customerData.state,
      postal_code: customerData.postal_code,
    }])
    .select()
    .single()

  if (driverError) throw driverError
  return driverData
}