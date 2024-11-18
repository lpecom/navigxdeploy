import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const normalizeStatus = (status: string) => {
  status = status.toUpperCase().trim();
  if (status.includes('MECANICA')) return 'MECHANICAL';
  if (status.includes('ELETRICA')) return 'ELECTRICAL';
  if (status.includes('PREPARACAO')) return 'PREPARATION';
  if (status.includes('FUNILARIA')) return 'BODY_SHOP';
  if (status.includes('VENDA')) return 'FOR_SALE';
  if (status.includes('DESATIVACAO')) return 'DEACTIVATION';
  if (status.includes('DIRETORIA')) return 'MANAGEMENT';
  if (status.includes('LOCADO')) return 'RENTED';
  if (status.includes('DISPONIVEL')) return 'AVAILABLE';
  if (status.includes('MANUTENCOES')) return 'OTHER_MAINTENANCE';
  return 'MAINTENANCE';
};

const normalizeGroup = (group: string) => {
  if (!group) return null;
  group = group.toUpperCase().trim();
  if (group.includes('HATCH')) return 'HATCH';
  if (group.includes('SEDAN')) return 'SEDAN';
  if (group.includes('SUV')) return 'SUV';
  if (group.includes('PREMIUM')) return 'PREMIUM';
  return 'OTHER';
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { htmlUrl } = await req.json()

    // Fetch HTML content
    const response = await fetch(htmlUrl);
    const htmlContent = await response.text();

    // Parse HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    if (!doc) throw new Error("Failed to parse HTML");

    // Extract table rows
    const rows = Array.from(doc.querySelectorAll('tr')).slice(1); // Skip header row
    const fleetData = rows.map(row => {
      const cells = Array.from(row.querySelectorAll('td'));
      return {
        fleet_number: cells[0]?.textContent?.trim(),
        plate: cells[1]?.textContent?.trim(),
        model: cells[2]?.textContent?.trim(),
        group: cells[3]?.textContent?.trim(),
        color: cells[4]?.textContent?.trim(),
        state: cells[5]?.textContent?.trim(),
        chassis_number: cells[6]?.textContent?.trim(),
        renavam_number: cells[7]?.textContent?.trim(),
        manufacture_year: cells[8]?.textContent?.trim(),
        model_year: cells[9]?.textContent?.trim(),
        manufacturer: cells[10]?.textContent?.trim(),
        contract_number: cells[11]?.textContent?.trim(),
        customer_name: cells[12]?.textContent?.trim(),
        customer_document: cells[13]?.textContent?.trim(),
        status: cells[14]?.textContent?.trim(),
      };
    }).filter(data => data.plate); // Only process rows with plate numbers

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // First, ensure we have all car groups
    const carGroups = [...new Set(fleetData.map(row => normalizeGroup(row.group)))].filter(Boolean);
    for (const groupName of carGroups) {
      const { error: groupError } = await supabase
        .from('car_groups')
        .upsert({
          name: groupName,
          description: `${groupName} vehicles group`,
          is_active: true
        }, {
          onConflict: 'name'
        });

      if (groupError) {
        console.error('Error upserting car group:', groupError);
      }
    }

    for (const row of fleetData) {
      // Create or update customer if we have customer data
      let customerId = null;
      if (row.customer_document) {
        const { data: customer, error: customerError } = await supabase
          .from('customers')
          .upsert({
            full_name: row.customer_name,
            cpf: row.customer_document,
            status: 'active',
            total_rentals: 1,
            last_rental_date: new Date().toISOString()
          }, {
            onConflict: 'cpf'
          })
          .select()
          .single();

        if (customerError) {
          console.error('Error upserting customer:', customerError);
          continue;
        }

        customerId = customer.id;
      }

      // Get car group
      const { data: carGroup } = await supabase
        .from('car_groups')
        .select('id')
        .eq('name', normalizeGroup(row.group))
        .single();

      // Get or create car model
      const { data: carModel, error: modelError } = await supabase
        .from('car_models')
        .upsert({
          name: row.model,
          year: row.model_year,
          description: `${row.manufacturer} ${row.model}`,
          category_id: carGroup?.id || null
        }, {
          onConflict: 'name'
        })
        .select()
        .single();

      if (modelError) {
        console.error('Error upserting car model:', modelError);
        continue;
      }

      // Create or update fleet vehicle
      const { error: vehicleError } = await supabase
        .from('fleet_vehicles')
        .upsert({
          car_model_id: carModel.id,
          year: row.manufacture_year,
          plate: row.plate,
          color: row.color,
          state: row.state,
          chassis_number: row.chassis_number,
          renavam_number: row.renavam_number,
          status: normalizeStatus(row.status || ''),
          contract_number: row.contract_number,
          customer_id: customerId,
          branch: 'MATRIZ',
          current_km: 0,
          last_revision_date: new Date().toISOString(),
          next_revision_date: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString(),
          is_available: (row.status || '').toLowerCase().includes('disponivel')
        }, {
          onConflict: 'plate'
        });

      if (vehicleError) {
        console.error('Error upserting vehicle:', vehicleError);
        continue;
      }
    }

    return new Response(
      JSON.stringify({ success: true, processed: fleetData.length }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error processing fleet data:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})