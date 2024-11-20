import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Mock data for demonstration - replace with actual data source
    const fleetData = [
      {
        plate: 'ABC1234',
        year: '2023',
        current_km: 15000,
        last_revision_date: new Date().toISOString().split('T')[0],
        next_revision_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'available',
      },
      // Add more mock vehicles as needed
    ]

    let processedCount = 0
    const errors = []

    for (const vehicle of fleetData) {
      try {
        const { error } = await supabase
          .from('fleet_vehicles')
          .upsert(
            { 
              ...vehicle,
              updated_at: new Date().toISOString()
            },
            { 
              onConflict: 'plate',
              ignoreDuplicates: false
            }
          )

        if (error) throw error
        processedCount++
      } catch (error) {
        console.error('Error processing vehicle:', error)
        errors.push(`Error processing vehicle ${vehicle.plate}: ${error.message}`)
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        processed: processedCount,
        errors,
        message: `Successfully processed ${processedCount} vehicles`
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )

  } catch (error) {
    console.error('Error syncing fleet:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})