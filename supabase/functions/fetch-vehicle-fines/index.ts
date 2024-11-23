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

    // Fetch the webpage with proper headers and timeout
    const response = await fetch(`https://multa.consultaplacas.com.br/consulta/${plate}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      },
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });

    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      throw new Error(`HTTP error! status: ${response.status}`);
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
          amount: parseFloat($cols.eq(4).text().replace('R$', '').trim().replace(',', '.')) || 0,
          points: parseInt($cols.eq(5).text().trim()) || 0,
          status: 'pending'
        };
        
        if (fine.code && fine.description) { // Only add if we have at least these basic fields
          fines.push(fine);
        }
      }
    });

    console.log(`Found ${fines.length} fines`);

    // If no fines were found but the page loaded, return empty array instead of error
    if (fines.length === 0) {
      return new Response(
        JSON.stringify({ success: true, fines: [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

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