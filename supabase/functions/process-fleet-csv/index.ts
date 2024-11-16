import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    // Process each row
    for (const row of csvData) {
      // Find car model ID
      const { data: carModel } = await supabase
        .from('car_models')
        .select('id')
        .ilike('name', row['CAR MODEL'])
        .single()

      if (!carModel) continue

      // Upsert fleet vehicle
      const { error } = await supabase
        .from('fleet_vehicles')
        .upsert({
          car_model_id: carModel.id,
          year: row['YEAR'],
          current_km: parseInt(row['CURRENT KM']),
          last_revision_date: row['LAST REVISION'],
          next_revision_date: row['NEXT REVISION'],
          plate: row['PLATE'],
          is_available: row['AVAILABLE'].toLowerCase() === 'yes'
        }, {
          onConflict: 'plate'
        })

      if (error) throw error
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})