import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { SinespClient } from 'npm:sinesp-client'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { plate } = await req.json()
    
    if (!plate) {
      throw new Error('Plate is required')
    }

    const client = new SinespClient()
    const vehicleInfo = await client.search(plate)

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Update the vehicle_fines table with the SINESP data
    const { error: updateError } = await supabaseClient
      .from('vehicle_fines')
      .update({
        sinesp_data: vehicleInfo,
        last_sinesp_check: new Date().toISOString()
      })
      .eq('fine_code', plate)

    if (updateError) {
      throw updateError
    }

    return new Response(
      JSON.stringify({ data: vehicleInfo }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})