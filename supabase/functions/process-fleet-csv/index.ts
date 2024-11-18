import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface FleetData {
  customer_name: string;
  customer_cpf: string;
  model: string;
  category: string;
  color: string;
  year: string;
  brand: string;
  status: string;
  contract?: string;
  plate: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { csvData } = await req.json()

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('Processing fleet data:', csvData.length, 'vehicles')

    for (const row of csvData) {
      const data = row as FleetData

      // Skip empty rows
      if (!data.plate || !data.model) {
        console.log('Skipping empty row')
        continue
      }

      // 1. Create or update customer if we have customer data
      let customerId = null
      if (data.customer_cpf) {
        const { data: customer, error: customerError } = await supabase
          .from('customers')
          .upsert({
            full_name: data.customer_name,
            cpf: data.customer_cpf,
            status: 'active'
          }, {
            onConflict: 'cpf'
          })
          .select()
          .single()

        if (customerError) {
          console.error('Error upserting customer:', customerError)
          continue
        }

        customerId = customer.id
      }

      // 2. Ensure we have the category
      const { data: category, error: categoryError } = await supabase
        .from('categories')
        .upsert({
          name: data.category,
          description: `${data.category} vehicles`
        }, {
          onConflict: 'name'
        })
        .select()
        .single()

      if (categoryError) {
        console.error('Error upserting category:', categoryError)
        continue
      }

      // 3. Create or update car model
      const { data: carModel, error: modelError } = await supabase
        .from('car_models')
        .upsert({
          name: data.model,
          category_id: category.id,
          year: data.year,
          description: `${data.brand} ${data.model}`
        }, {
          onConflict: 'name'
        })
        .select()
        .single()

      if (modelError) {
        console.error('Error upserting car model:', modelError)
        continue
      }

      // 4. Create or update fleet vehicle
      const { error: vehicleError } = await supabase
        .from('fleet_vehicles')
        .upsert({
          car_model_id: carModel.id,
          year: data.year,
          plate: data.plate,
          color: data.color,
          status: data.status.toLowerCase(),
          contract_number: data.contract,
          customer_id: customerId,
          current_km: 0,
          last_revision_date: new Date().toISOString(),
          next_revision_date: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString(),
          is_available: data.status.toLowerCase() === 'available'
        }, {
          onConflict: 'plate'
        })

      if (vehicleError) {
        console.error('Error upserting vehicle:', vehicleError)
        continue
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error processing fleet data:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})