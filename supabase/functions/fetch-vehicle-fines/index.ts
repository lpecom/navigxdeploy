import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"
import * as cheerio from "https://esm.sh/cheerio@1.0.0-rc.12"
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

    if (!plate) {
      throw new Error('Vehicle plate is required');
    }

    console.log(`Fetching fines for plate: ${plate}`);

    // Mock data for development/testing - remove this in production
    // This ensures the function works while we resolve the external API issues
    const mockFines: FineData[] = [
      {
        code: "5541-1",
        description: "Excesso de velocidade",
        date: "2024-01-15",
        location: "Av. Principal",
        amount: 150.50,
        points: 4,
        status: "pending"
      }
    ];

    console.log(`Using mock data with ${mockFines.length} fines for development`);

    // Store the fines in the database
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Insert or update fines in the database
    for (const fine of mockFines) {
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
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        fines: mockFines,
        message: "Mock data retrieved successfully for development" 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error.message);
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