import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { SinespClient } from 'npm:sinesp-client'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface VehicleInfo {
  plate: string;
  model: string;
  brand: string;
  year: string;
  color: string;
  state: string;
  city: string;
  status: string;
  fines?: any[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { plate } = await req.json()
    console.log(`Checking plate: ${plate}`)

    if (!plate) {
      throw new Error('License plate is required')
    }

    // Initialize SINESP client
    const client = new SinespClient()
    
    // Search vehicle information
    console.log('Querying SINESP for plate:', plate)
    const sinespData = await client.search(plate)
    console.log('SINESP response:', sinespData)

    // Transform SINESP response to our format
    const vehicleInfo: VehicleInfo = {
      plate: plate,
      model: sinespData.model,
      brand: sinespData.brand,
      year: sinespData.year,
      color: sinespData.color,
      state: sinespData.state,
      city: sinespData.city,
      status: sinespData.status.toLowerCase(),
      fines: [] // We'll implement fines in a separate step
    }

    // Store the result in Supabase for caching
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Store the vehicle info in the database
    const { error: dbError } = await supabaseClient
      .from('vehicle_fines')
      .upsert([
        {
          vehicle_id: null, // Will be linked later if vehicle exists in fleet
          fine_code: 'PLATE_CHECK',
          fine_description: 'License plate verification',
          fine_location: `${vehicleInfo.city}, ${vehicleInfo.state}`,
          raw_data: vehicleInfo
        }
      ])

    if (dbError) {
      console.error('Error storing vehicle info:', dbError)
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: vehicleInfo
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    )

  } catch (error) {
    console.error('Error processing request:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Error processing request',
        details: error.message
      }),
      { 
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  }
})