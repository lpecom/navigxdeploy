import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const mapVehicleStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    'disponível': 'available',
    'disponivel': 'available',
    'alugado': 'rented',
    'manutenção': 'maintenance',
    'manutencao': 'maintenance',
    'funilaria': 'body_shop',
    'acidente': 'accident',
    'desativado': 'deactivated',
    'diretoria': 'management',
    'elétrico': 'electric',
    'eletrico': 'electric',
    'mecânica': 'mechanic',
    'mecanica': 'mechanic',
    'outras manutenções': 'other_maintenance',
    'outras manutencoes': 'other_maintenance',
    'à venda': 'for_sale',
    'a venda': 'for_sale',
    'preparando': 'preparing',
    'em preparação': 'preparing',
    'em preparacao': 'preparing'
  }

  const normalizedStatus = status.toLowerCase().trim()
  return statusMap[normalizedStatus] || 'available'
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Starting fleet data sync')
    
    // Update the URL to use HTTPS and remove the trailing colon
    const fleetDataUrl = 'https://brown-georgeanne-53.tiiny.site'
    console.log('Fetching data from:', fleetDataUrl)
    
    const response = await fetch(fleetDataUrl)
    if (!response.ok) {
      throw new Error(`Failed to fetch fleet data: ${response.status} ${response.statusText}`)
    }

    const fleetData = await response.text()
    console.log('Fleet data fetched successfully')

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Parse the CSV data
    const rows = fleetData.split('\n')
      .map(row => row.split(','))
      .filter(row => row.length > 1)

    // Remove header row
    const [headers, ...dataRows] = rows
    
    let processedCount = 0
    const errors = []

    for (const row of dataRows) {
      try {
        const rawStatus = row[5]?.trim() || 'available'
        const vehicle = {
          plate: row[0]?.trim(),
          year: row[1]?.trim(),
          current_km: parseInt(row[2]?.trim() || '0'),
          last_revision_date: row[3]?.trim() || new Date().toISOString().split('T')[0],
          next_revision_date: row[4]?.trim() || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: mapVehicleStatus(rawStatus),
          chassis_number: row[6]?.trim(),
          renavam_number: row[7]?.trim(),
          color: row[8]?.trim(),
          updated_at: new Date().toISOString()
        }

        if (!vehicle.plate) {
          console.warn('Skipping row due to missing plate number')
          continue
        }

        console.log(`Processing vehicle: ${vehicle.plate} with status: ${vehicle.status}`)

        const { error } = await supabase
          .from('fleet_vehicles')
          .upsert(vehicle, { 
            onConflict: 'plate',
            ignoreDuplicates: false 
          })

        if (error) throw error
        processedCount++
        console.log(`Successfully processed vehicle: ${vehicle.plate}`)
      } catch (error) {
        console.error('Error processing vehicle row:', error)
        errors.push(`Error processing row ${processedCount + 1}: ${error.message}`)
      }
    }

    console.log(`Sync completed. Processed ${processedCount} vehicles`)

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
        error: error.message,
        details: error.stack
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})