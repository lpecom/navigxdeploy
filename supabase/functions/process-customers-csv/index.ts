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

    // Process file in smaller chunks
    const buffer = await file.arrayBuffer()
    const workbook = XLSX.read(new Uint8Array(buffer), { type: 'array', cellDates: true })
    const worksheet = workbook.Sheets[workbook.SheetNames[0]]
    const data = XLSX.utils.sheet_to_json(worksheet, { raw: false })

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    let processedCount = 0
    const errors = []
    const BATCH_SIZE = 25 // Reduced batch size

    // Process in smaller batches
    for (let i = 0; i < data.length; i += BATCH_SIZE) {
      const batch = data.slice(i, Math.min(i + BATCH_SIZE, data.length))
        .map((row: any) => {
          try {
            if (!row.cpf && !row.CPF) {
              throw new Error('CPF is required')
            }
            
            return {
              full_name: row.full_name || row.name || row.Nome || '',
              email: row.email || row.Email || `${row.cpf || row.CPF}@placeholder.com`,
              cpf: row.cpf || row.CPF || '',
              phone: row.phone || row.telefone || row.Phone || '',
              address: row.address || row.endereco || row.Address || '',
              city: row.city || row.cidade || row.City || '',
              state: row.state || row.estado || row.State || '',
              postal_code: row.postal_code || row.cep || row.CEP || '',
              status: 'active',
            }
          } catch (error) {
            errors.push(`Row ${i}: ${error.message}`)
            return null
          }
        })
        .filter(Boolean)

      if (batch.length > 0) {
        const { error } = await supabase
          .from('customers')
          .upsert(batch, {
            onConflict: 'cpf',
            ignoreDuplicates: false
          })

        if (error) {
          console.error('Batch error:', error)
          errors.push(`Batch error: ${error.message}`)
          continue
        }

        processedCount += batch.length
      }

      // Small delay between batches to prevent resource exhaustion
      await new Promise(resolve => setTimeout(resolve, 100))
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
    console.error('Error processing customers:', error)
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
        status: 400 
      }
    )
  }
})