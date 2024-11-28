import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface FineData {
  code: string;
  description: string;
  date: string;
  location: string;
  amount: number;
  points: number;
  status: string;
}

async function scrapeFines(plate: string): Promise<FineData[]> {
  try {
    console.log(`Scraping fines for plate: ${plate}`);
    
    // Format plate to match expected format (remove spaces and special characters)
    const formattedPlate = plate.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    console.log(`Formatted plate: ${formattedPlate}`);
    
    // Mock response for development/testing
    // In production, you would make the actual HTTP request
    const mockFines: FineData[] = [
      {
        code: "123456",
        description: "Excesso de velocidade",
        date: new Date().toISOString(),
        location: "Av. Paulista, São Paulo",
        amount: 150.00,
        points: 4,
        status: "pending"
      }
    ];

    return mockFines;
  } catch (error) {
    console.error('Error scraping fines:', error);
    throw error;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { plate, vehicleId } = await req.json();
    console.log(`Processing fines for vehicle: ${plate}`);

    if (!plate) {
      throw new Error('Vehicle plate is required');
    }

    // Fetch fines (using mock data for now)
    const fines = await scrapeFines(plate);
    console.log(`Found ${fines.length} fines for vehicle ${plate}`);

    // If vehicleId is provided, store the fines in the database
    if (vehicleId) {
      const supabaseAdmin = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );

      let successCount = 0;
      
      for (const fine of fines) {
        console.log(`Processing fine: ${JSON.stringify(fine)}`);
        
        const { error } = await supabaseAdmin
          .from('vehicle_fines')
          .upsert({
            vehicle_id: vehicleId,
            fine_code: fine.code,
            fine_description: fine.description,
            fine_date: new Date(fine.date).toISOString(),
            fine_location: fine.location,
            fine_amount: fine.amount,
            fine_points: fine.points,
            fine_status: fine.status,
            source_url: `https://multa.consultaplacas.com.br/consulta/${plate}`,
            raw_data: fine
          }, {
            onConflict: 'vehicle_id,fine_code'
          });

        if (error) {
          console.error('Error storing fine:', error);
          throw error;
        }
        
        successCount++;
        console.log(`Successfully stored fine ${fine.code}`);
      }

      console.log(`Successfully stored ${successCount} fines for vehicle ${plate}`);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        fines,
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
    );

  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: `Error processing request: ${error.message}`,
        details: error.stack
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});