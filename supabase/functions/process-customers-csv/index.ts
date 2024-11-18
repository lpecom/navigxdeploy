import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import * as csv from 'https://deno.land/std@0.170.0/encoding/csv.ts'

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
    
    if (!file || !(file instanceof File)) {
      throw new Error('No file uploaded')
    }

    const text = await file.text()
    console.log('CSV Content Preview:', text.substring(0, 200))

    const lines = text.split('\n')
    if (lines.length === 0) {
      throw new Error('Empty CSV file')
    }

    const headerRow = lines[0].trim()
    console.log('Header row:', headerRow)

    const rows = await csv.parse(text, {
      skipFirstRow: true,
    })

    console.log(`Processing ${rows.length} customers`)
    if (rows.length > 0) {
      console.log('Sample row:', rows[0])
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    let processedCount = 0
    const errors = []
    const BATCH_SIZE = 5
    const BATCH_DELAY = 300

    const headers = headerRow.split(',').map(h => h.trim().toLowerCase())

    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
      const batch = rows.slice(i, Math.min(i + BATCH_SIZE, rows.length))
        .map((row: string[]) => {
          try {
            const rowData = headers.reduce((acc: any, header, index) => {
              acc[header] = row[index]?.trim() || null
              return acc
            }, {})

            const cpf = String(rowData.cpf || '').replace(/[^\d]/g, '')
            if (!cpf) {
              throw new Error('CPF is required')
            }

            const cleanPhone = (phone: string) => phone?.replace(/[^\d]/g, '') || ''

            return {
              full_name: rowData.full_name || rowData.name || rowData.nome || '',
              email: rowData.email || `${cpf}@placeholder.com`,
              cpf,
              phone: cleanPhone(rowData.phone || rowData.telefone),
              address: rowData.address || rowData.endereco || null,
              city: rowData.city || rowData.cidade || null,
              state: rowData.state || rowData.estado || null,
              postal_code: rowData.postal_code || rowData.cep || null,
              status: 'active'
            }
          } catch (error) {
            console.error(`Error processing row ${i}:`, error)
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

          if (error) throw error
          processedCount += batch.length
          console.log(`Processed ${processedCount}/${rows.length} records`)
        } catch (error) {
          console.error('Batch error:', error)
          errors.push(`Batch error: ${error.message}`)
        }
      }

      await new Promise(resolve => setTimeout(resolve, BATCH_DELAY))
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        processed: processedCount,
        errors: errors,
        message: `Successfully processed ${processedCount} customers` 
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
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
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})