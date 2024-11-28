import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

async function checkSinespPlate(plate: string) {
  const url = "https://apicarros.com/v1/consulta/" + plate.toLowerCase();
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      plate: plate,
      model: data.modelo || 'N/A',
      brand: data.marca || 'N/A',
      year: data.ano || 'N/A',
      color: data.cor || 'N/A',
      state: data.uf || 'N/A',
      city: data.municipio || 'N/A',
      status: 'regular'
    };
  } catch (error) {
    console.error('Error checking plate:', error);
    throw error;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { plate } = await req.json()
    console.log(`Checking plate: ${plate}`);
    
    if (!plate) {
      throw new Error('Plate is required')
    }

    // Search vehicle information
    console.log('Querying SINESP for plate:', plate);
    const vehicleInfo = await checkSinespPlate(plate);
    console.log('Vehicle info:', vehicleInfo);

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
    console.error('Error processing request:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})