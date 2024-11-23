import { createClient } from '@supabase/supabase-js';
import { corsHeaders } from '../_shared/cors.ts';

const MULTAS_API_URL = 'https://multa.consultaplacas.com.br';

interface FineResponse {
  code: string;
  description: string;
  date: string;
  location: string;
  amount: number;
  points: number;
  status: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { plate, vehicleId } = await req.json();
    const apiKey = Deno.env.get('MULTAS_API_KEY');

    if (!apiKey) {
      throw new Error('MULTAS_API_KEY is not configured');
    }

    if (!plate) {
      throw new Error('Vehicle plate is required');
    }

    // Call the Multas API
    const response = await fetch(`${MULTAS_API_URL}/consulta`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ plate }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const fines: FineResponse[] = await response.json();

    // Store the fines in the database
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Insert or update fines in the database
    for (const fine of fines) {
      await supabaseAdmin
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
        }, {
          onConflict: 'vehicle_id,fine_code'
        });
    }

    return new Response(
      JSON.stringify({ success: true, fines }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});