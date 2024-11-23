import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"
import { corsHeaders } from '../_shared/cors.ts'

interface FineData {
  code: string;
  description: string;
  date: string;
  location: string;
  amount: number;
  points: number;
  status: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { plate, vehicleId } = await req.json();
    console.log(`Processing fines for vehicle: ${plate}, ID: ${vehicleId}`);

    if (!plate || !vehicleId) {
      throw new Error('Vehicle plate and ID are required');
    }

    // Mock data for development
    const mockFines: FineData[] = [
      {
        code: "5541-1",
        description: "Excesso de velocidade",
        date: new Date().toISOString(),
        location: "Av. Principal",
        amount: 150.50,
        points: 4,
        status: "pending"
      }
    ];

    console.log(`Found ${mockFines.length} fines for vehicle ${plate}`);

    // Initialize Supabase client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    let successCount = 0;
    
    // Store the fines in the database
    for (const fine of mockFines) {
      console.log(`Storing fine: ${JSON.stringify(fine)}`);
      
      const { error } = await supabaseAdmin
        .from('vehicle_fines')
        .upsert({
          vehicle_id: vehicleId,
          fine_code: fine.code,
          fine_description: fine.description,
          fine_date: fine.date,
          fine_location: fine.location,
          fine_amount: fine.amount,
          fine_points: fine.points,
          fine_status: fine.status,
          source_url: `https://consulta-fines.example.com/${plate}`,
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

    return new Response(
      JSON.stringify({ 
        success: true, 
        fines: mockFines,
        stored: successCount,
        message: `Successfully imported ${successCount} fines` 
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