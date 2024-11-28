import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import fipe from 'npm:fipe-promise'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

async function scrapeFines(plate: string) {
  // Mock fines data
  return [
    {
      description: "Multa por excesso de velocidade",
      date: "2023-01-01",
      amount: 150,
      points: 5,
      location: "Av. Paulista, SP"
    },
    {
      description: "Multa por estacionamento irregular",
      date: "2023-02-01",
      amount: 100,
      points: 3,
      location: "R. da Consolação, SP"
    }
  ];
}

async function getFipeData(plate: string) {
  try {
    // For now, we'll use mock data since we don't have direct plate-to-FIPE mapping
    const mockFipeData = {
      brand: "Toyota",
      model: "Corolla",
      year: "2022",
      price: 120000,
      fuel: "Flex"
    };
    
    return mockFipeData;
  } catch (error) {
    console.error('Error fetching FIPE data:', error);
    return null;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { plate, vehicleId } = await req.json();
    console.log(`Processing vehicle info for: ${plate}`);

    if (!plate) {
      throw new Error('Vehicle plate is required');
    }

    // Fetch both fines and FIPE data
    const [fines, fipeData] = await Promise.all([
      scrapeFines(plate),
      getFipeData(plate)
    ]);

    console.log(`Found ${fines.length} fines and FIPE data for vehicle ${plate}`);

    // If vehicleId is provided, store the fines in the database
    if (vehicleId) {
      // Store fines in the database (mock implementation)
      const { data: finesData, error } = await createClient().from('fines').insert(fines);
      if (error) {
        console.error('Error storing fines in database:', error);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        fines,
        fipeData,
        stored: vehicleId ? fines.length : 0,
        message: vehicleId 
          ? `Successfully imported ${fines.length} fines` 
          : `Found ${fines.length} fines`
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    )

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
    )
  }
})
