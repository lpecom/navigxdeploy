import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import * as fipe from 'npm:fipe-promise'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RequestParams {
  action: 'getBrands' | 'getModels' | 'getYears' | 'getVehicle' | 'getByPlateInfo'
  vehicleType: 'cars' | 'motorcycles' | 'trucks'
  brandId?: string
  modelId?: string
  year?: string
  plateInfo?: {
    brand: string
    model: string
    year: string
  }
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

    const params = await req.json() as RequestParams
    console.log(`Processing FIPE request:`, params)
    
    let result
    
    if (params.action === 'getByPlateInfo' && params.plateInfo) {
      // Search for the exact model using the plate info
      const brands = await fipe.getBrands('cars')
      const matchingBrand = brands.find(b => 
        b.name.toLowerCase() === params.plateInfo.brand.toLowerCase()
      )
      
      if (matchingBrand) {
        const models = await fipe.getModels('cars', matchingBrand.id)
        const matchingModel = models.find(m => 
          m.name.toLowerCase().includes(params.plateInfo.model.toLowerCase())
        )
        
        if (matchingModel) {
          const years = await fipe.getYears('cars', matchingBrand.id, matchingModel.id)
          const matchingYear = years.find(y => 
            y.name.includes(params.plateInfo.year)
          )
          
          if (matchingYear) {
            result = await fipe.getVehicle(
              'cars',
              matchingBrand.id,
              matchingModel.id,
              matchingYear.id
            )
          }
        }
      }
    } else {
      // Handle regular FIPE API actions
      switch (params.action) {
        case 'getBrands':
          result = await fipe.getBrands(params.vehicleType)
          break

        case 'getModels':
          if (!params.brandId) throw new Error('Brand ID is required')
          result = await fipe.getModels(params.vehicleType, params.brandId)
          break

        case 'getYears':
          if (!params.brandId || !params.modelId) 
            throw new Error('Brand ID and Model ID are required')
          result = await fipe.getYears(
            params.vehicleType, 
            params.brandId, 
            params.modelId
          )
          break

        case 'getVehicle':
          if (!params.brandId || !params.modelId || !params.year) 
            throw new Error('Brand ID, Model ID and Year are required')
          result = await fipe.getVehicle(
            params.vehicleType, 
            params.brandId, 
            params.modelId, 
            params.year
          )
          
          // Cache the vehicle data
          if (result?.fipeCode) {
            const { error } = await supabaseClient
              .from('fipe_cache')
              .upsert({
                fipe_code: result.fipeCode,
                vehicle_type: params.vehicleType,
                reference_month: result.referenceMonth,
                brand: result.brand,
                model: result.model,
                year: result.modelYear?.toString(),
                price: parseFloat(result.price.replace(/[^0-9.-]+/g, '')),
                fuel: result.fuel,
                raw_data: result
              })

            if (error) {
              console.error('Error caching FIPE data:', error)
            }
          }
          break

        default:
          throw new Error('Invalid action')
      }
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