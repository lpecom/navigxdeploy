import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import * as XLSX from 'https://esm.sh/xlsx@0.18.5'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file')

    if (!file) {
      throw new Error('No file uploaded')
    }

    // Read the file buffer
    const arrayBuffer = await file.arrayBuffer()
    const workbook = XLSX.read(arrayBuffer, { type: 'array' })
    
    // Get first worksheet
    const worksheet = workbook.Sheets[workbook.SheetNames[0]]
    const data = XLSX.utils.sheet_to_json(worksheet)

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    let processedCount = 0
    const errors = []

    // Process each row
    for (const row of data) {
      try {
        const customerData = {
          full_name: row.full_name || row.name || row.Nome,
          email: row.email || row.Email,
          cpf: row.cpf || row.CPF,
          phone: row.phone || row.telefone || row.Phone,
          address: row.address || row.endereco || row.Address,
          city: row.city || row.cidade || row.City,
          state: row.state || row.estado || row.State,
          postal_code: row.postal_code || row.cep || row.CEP,
          status: 'active',
        }

        // Validate required fields
        if (!customerData.full_name || !customerData.email || !customerData.cpf) {
          throw new Error('Missing required fields')
        }

        const { error } = await supabase
          .from('customers')
          .upsert(customerData, {
            onConflict: 'cpf',
            ignoreDuplicates: false
          })

        if (error) throw error
        processedCount++
      } catch (error) {
        errors.push(`Row ${processedCount + 1}: ${error.message}`)
      }
    }

    return new Response(
      JSON.stringify({ 
        message: 'Customers processed successfully',
        processed: processedCount,
        errors: errors
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 200 
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process customers',
        details: error.message 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 500 
      }
    )
  }
})