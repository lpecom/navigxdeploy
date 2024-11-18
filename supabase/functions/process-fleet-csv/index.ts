import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface FleetData {
  Frota: string;
  Placa: string;
  Modelo: string;
  Grupo: string;
  Cor: string;
  'UF Emplac.': string;
  'Número do Chassi': string;
  'Número do Renavan': string;
  'Ano do Veículo': string;
  'Ano do Modelo': string;
  Fabricante: string;
  Contrato: string;
  Cliente: string;
  'CPF/CNPJ Cliente/Contrato': string;
  Status: string;
  Filial: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { csvData } = await req.json()

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('Processing fleet data:', csvData.length, 'vehicles')

    // Process each row
    for (const row of csvData) {
      const data = row as FleetData

      // Skip empty rows
      if (!data.Placa) continue

      // Find or create car model
      const { data: carModel, error: modelError } = await supabase
        .from('car_models')
        .select('id')
        .ilike('name', data.Modelo)
        .single()

      if (modelError) {
        console.error('Error finding car model:', modelError)
        continue
      }

      // Find customer if exists
      let customerId = null
      if (data.Cliente && data['CPF/CNPJ Cliente/Contrato']) {
        const { data: customer } = await supabase
          .from('customers')
          .select('id')
          .eq('cpf', data['CPF/CNPJ Cliente/Contrato'])
          .single()

        if (customer) {
          customerId = customer.id
        }
      }

      // Map status
      let status = 'available'
      if (data.Status?.includes('LOCADO')) status = 'rented'
      else if (data.Status?.includes('MECANICA')) status = 'maintenance'
      else if (data.Status?.includes('PREPARAÇÃO')) status = 'preparation'
      else if (data.Status?.includes('PARA VENDA')) status = 'for_sale'
      else if (data.Status?.includes('OUTRAS')) status = 'other_maintenance'
      else if (data.Status?.includes('DIRETORIA')) status = 'management'

      // Upsert fleet vehicle
      const { error: vehicleError } = await supabase
        .from('fleet_vehicles')
        .upsert({
          car_model_id: carModel?.id,
          year: data['Ano do Veículo'],
          plate: data.Placa,
          color: data.Cor,
          state: data['UF Emplac.'],
          chassis_number: data['Número do Chassi'],
          renavam_number: data['Número do Renavan'],
          status,
          contract_number: data.Contrato,
          customer_id: customerId,
          branch: data.Filial,
          is_available: status === 'available'
        }, {
          onConflict: 'plate'
        })

      if (vehicleError) {
        console.error('Error upserting vehicle:', vehicleError)
        continue
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error processing fleet data:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})