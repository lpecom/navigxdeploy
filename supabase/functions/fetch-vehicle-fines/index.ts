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
    
    // Construct URL with proper encoding
    const url = `https://multa.consultaplacas.com.br/consulta/${encodeURIComponent(formattedPlate)}`;
    console.log(`Requesting URL: ${url}`);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Referer': 'https://multa.consultaplacas.com.br/'
      },
      redirect: 'follow'
    });

    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      console.error('Response headers:', Object.fromEntries(response.headers.entries()));
      throw new Error(`Failed to fetch data: ${response.status}`);
    }

    const html = await response.text();
    console.log('Received HTML length:', html.length);

    if (html.length === 0) {
      console.error('Received empty HTML response');
      return [];
    }

    const parser = new DOMParser();
    const document = parser.parseFromString(html, "text/html");

    if (!document) {
      console.error('Failed to parse HTML document');
      throw new Error("Failed to parse HTML");
    }

    const fines: FineData[] = [];
    const fineElements = document.querySelectorAll('.multa-item');

    console.log(`Found ${fineElements.length} fine elements`);

    fineElements.forEach((element, index) => {
      try {
        const valueText = element.querySelector('.valor')?.textContent || '0';
        const cleanedValue = valueText.replace('R$', '').replace('.', '').replace(',', '.').trim();
        
        const fine: FineData = {
          code: element.querySelector('.codigo')?.textContent?.trim() || '',
          description: element.querySelector('.descricao')?.textContent?.trim() || '',
          date: element.querySelector('.data')?.textContent?.trim() || '',
          location: element.querySelector('.local')?.textContent?.trim() || '',
          amount: parseFloat(cleanedValue),
          points: parseInt(element.querySelector('.pontos')?.textContent?.trim() || '0'),
          status: element.querySelector('.status')?.textContent?.trim().toLowerCase() || 'pending'
        };

        console.log(`Processing fine ${index + 1}:`, fine);

        if (fine.code && fine.description) {
          fines.push(fine);
        }
      } catch (error) {
        console.error('Error parsing fine element:', error);
      }
    });

    return fines;
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
    console.log(`Processing fines for vehicle: ${plate}, ID: ${vehicleId}`);

    if (!plate || !vehicleId) {
      throw new Error('Vehicle plate and ID are required');
    }

    // Initialize Supabase client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch fines from the website
    const fines = await scrapeFines(plate);
    console.log(`Found ${fines.length} fines for vehicle ${plate}`);

    let successCount = 0;
    
    // Store the fines in the database
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

    return new Response(
      JSON.stringify({ 
        success: true, 
        fines,
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