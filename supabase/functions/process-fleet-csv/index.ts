import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { csvUrl, importDate } = await req.json()
    
    if (!csvUrl) {
      throw new Error('CSV URL is required')
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')
    const supabase = createClient(supabaseUrl!, supabaseKey!)

    // Fetch CSV data
    const response = await fetch(csvUrl)
    if (!response.ok) {
      throw new Error(`Failed to fetch CSV: ${response.statusText}`)
    }

    const csvData = await response.text()
    const rows = csvData.split('\n').slice(1) // Skip header row
    let processed = 0
    const errors = []

    for (const row of rows) {
      try {
        const [
          plate, year, currentKm, lastRevisionDate, nextRevisionDate,
          color, state, chassisNumber, renavamNumber, status, contractNumber, branch
        ] = row.split(',').map(field => field.trim())

        const { error } = await supabase
          .from('fleet_vehicles')
          .upsert({
            plate,
            year,
            current_km: parseInt(currentKm),
            last_revision_date: lastRevisionDate,
            next_revision_date: nextRevisionDate,
            color,
            state,
            chassis_number: chassisNumber,
            renavam_number: renavamNumber,
            status,
            contract_number: contractNumber,
            branch,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'plate'
          })

        if (error) throw error
        processed++
      } catch (error) {
        errors.push(`Error processing row: ${row}. Error: ${error.message}`)
      }
    }

    return new Response(
      JSON.stringify({ processed, errors, success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message, success: false }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})