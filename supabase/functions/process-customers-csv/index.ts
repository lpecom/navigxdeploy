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

    // Read file with minimal memory usage
    const buffer = await file.arrayBuffer()
    const workbook = XLSX.read(new Uint8Array(buffer), { 
      type: 'array',
      cellDates: true,
      cellNF: false,
      cellText: false
    })
    const worksheet = workbook.Sheets[workbook.SheetNames[0]]
    
    // Convert to JSON with minimal options
    const data = XLSX.utils.sheet_to_json(worksheet, { 
      raw: true,
      defval: '',
      header: 'A'
    })

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    let processedCount = 0
    const errors = []
    const BATCH_SIZE = 10 // Further reduced batch size

    // Process in smaller batches with minimal memory allocation
    for (let i = 0; i < data.length; i += BATCH_SIZE) {
      const batch = data.slice(i, Math.min(i + BATCH_SIZE, data.length))
        .map((row: any) => {
          try {
            const cpf = row.cpf || row.CPF || row.C || ''
            if (!cpf) {
              throw new Error('CPF is required')
            }
            
            return {
              full_name: (row.full_name || row.name || row.Nome || row.A || '').trim(),
              email: (row.email || row.Email || row.B || `${cpf}@placeholder.com`).trim(),
              cpf: cpf.trim(),
              phone: (row.phone || row.telefone || row.Phone || row.D || '').trim(),
              address: (row.address || row.endereco || row.Address || row.E || '').trim(),
              city: (row.city || row.cidade || row.City || row.F || '').trim(),
              state: (row.state || row.estado || row.State || row.G || '').trim(),
              postal_code: (row.postal_code || row.cep || row.CEP || row.H || '').trim(),
              status: 'active'
            }
          } catch (error) {
            errors.push(`Row ${i + 1}: ${error.message}`)
            return null
          }
        })
        .filter(Boolean)

      if (batch.length > 0) {
        try {
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
        } catch (error) {
          console.error('Unexpected error:', error)
          errors.push(`Unexpected error: ${error.message}`)
        }
      }

      // Longer delay between batches
      await new Promise(resolve => setTimeout(resolve, 200))
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