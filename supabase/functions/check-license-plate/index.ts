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
}

async function checkPlate(plate: string): Promise<VehicleInfo> {
  // For now, return mock data since the external API is not reliable
  // In production, this should be replaced with a proper API integration
  return {
    plate: plate,
    model: "Não disponível",
    brand: "Não disponível",
    year: "Não disponível",
    color: "Não disponível",
    state: "Não disponível",
    city: "Não disponível",
    status: "regular"
  };
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

    // Get vehicle information
    const vehicleInfo = await checkPlate(plate);
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