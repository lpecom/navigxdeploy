import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { default as fipePromise } from 'npm:fipe-promise'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RequestParams {
  action: 'getBrands' | 'getModels' | 'getYears' | 'getVehicle'
  vehicleType: 'cars' | 'motorcycles' | 'trucks'
  brandId?: string
  modelId?: string
  year?: string
  fipeCode?: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { action, vehicleType, brandId, modelId, year, fipeCode } = await req.json() as RequestParams

    console.log(`Processing FIPE request: ${action} for ${vehicleType}`)
    
    // Initialize FIPE client
    const fipe = new fipePromise()
    
    // Handle different FIPE API actions
    let result
    switch (action) {
      case 'getBrands':
        result = await fipe.getBrands(vehicleType)
        break

      case 'getModels':
        if (!brandId) throw new Error('Brand ID is required')
        result = await fipe.getModels(vehicleType, brandId)
        break

      case 'getYears':
        if (!brandId || !modelId) throw new Error('Brand ID and Model ID are required')
        result = await fipe.getYears(vehicleType, brandId, modelId)
        break

      case 'getVehicle':
        if (!brandId || !modelId || !year) throw new Error('Brand ID, Model ID and Year are required')
        const vehicleData = await fipe.getVehicle(vehicleType, brandId, modelId, year)
        
        // Cache the vehicle data if we have a FIPE code
        if (vehicleData.fipeCode) {
          const { error } = await supabaseClient
            .from('fipe_cache')
            .upsert({
              fipe_code: vehicleData.fipeCode,
              vehicle_type: vehicleType,
              reference_month: vehicleData.referenceMonth,
              brand: vehicleData.brand,
              model: vehicleData.model,
              year: vehicleData.modelYear?.toString(),
              price: parseFloat(vehicleData.price.replace(/[^0-9.-]+/g, '')),
              fuel: vehicleData.fuel,
              raw_data: vehicleData
            })

          if (error) {
            console.error('Error caching FIPE data:', error)
          }
        }
        
        result = vehicleData
        break

      default:
        throw new Error('Invalid action')
    }

    return new Response(
      JSON.stringify(result),
      { 
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )

  } catch (error) {
    console.error('Error in FIPE data function:', error)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  }
})