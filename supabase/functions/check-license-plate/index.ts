import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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

async function checkSinespPlate(plate: string): Promise<VehicleInfo> {
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
      status: 'regular',
      fines: []
    };
  } catch (error) {
    console.error('Error checking plate:', error);
    throw error;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { plate } = await req.json();
    console.log(`Checking plate: ${plate}`);

    if (!plate) {
      throw new Error('License plate is required');
    }

    // Search vehicle information
    console.log('Querying SINESP for plate:', plate);
    const vehicleInfo = await checkSinespPlate(plate);
    console.log('Vehicle info:', vehicleInfo);

    // Store the result in Supabase for caching
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Store the vehicle info in the database
    const { error: dbError } = await supabaseClient
      .from('vehicle_fines')
      .upsert([
        {
          vehicle_id: null,
          fine_code: 'PLATE_CHECK',
          fine_description: 'License plate verification',
          fine_location: `${vehicleInfo.city}, ${vehicleInfo.state}`,
          raw_data: vehicleInfo
        }
      ]);

    if (dbError) {
      console.error('Error storing vehicle info:', dbError);
    }

    return new Response(
      JSON.stringify(vehicleInfo),
      { 
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );

  } catch (error) {
    console.error('Error processing request:', error);
    
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
    );
  }
});