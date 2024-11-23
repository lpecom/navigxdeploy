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
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { plate, vehicleId } = await req.json();

    if (!plate) {
      throw new Error('Vehicle plate is required');
    }

    console.log(`Fetching fines for plate: ${plate}`);

    // Fetch the webpage
    const response = await fetch(`https://multa.consultaplacas.com.br/consulta/${plate}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    const fines: FineData[] = [];

    // Parse the fines table
    $('.fines-table tr').each((_, element) => {
      const $row = $(element);
      const $cols = $row.find('td');

      if ($cols.length >= 6) {
        const fine: FineData = {
          code: $cols.eq(0).text().trim(),
          description: $cols.eq(1).text().trim(),
          date: $cols.eq(2).text().trim(),
          location: $cols.eq(3).text().trim(),
          amount: parseFloat($cols.eq(4).text().replace('R$', '').trim()) || 0,
          points: parseInt($cols.eq(5).text().trim()) || 0,
          status: 'pending'
        };
        fines.push(fine);
      }
    });

    console.log(`Found ${fines.length} fines`);

    // Store the fines in the database
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Insert or update fines in the database
    for (const fine of fines) {
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
          source_url: `https://multa.consultaplacas.com.br/consulta/${plate}`,
          raw_data: fine
        }, {
          onConflict: 'vehicle_id,fine_code'
        });

      if (error) {
        console.error('Error storing fine:', error);
      }
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