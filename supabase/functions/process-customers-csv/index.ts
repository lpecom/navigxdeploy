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
    
    if (!file) {
      throw new Error('No file uploaded')
    }

    const text = await file.text()
    console.log('CSV Content Preview:', text.substring(0, 200))

    // First, parse the header row to get column names
    const lines = text.split('\n')
    if (lines.length === 0) {
      throw new Error('Empty CSV file')
    }

    const headerRow = lines[0].trim()
    console.log('Header row:', headerRow)

    // Parse CSV data
    const rows = await csv.parse(text, {
      skipFirstRow: true,
      separator: ',',
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

    // Get header columns for mapping
    const headers = headerRow.split(',').map(h => h.trim().toLowerCase())

    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
      const batch = rows.slice(i, Math.min(i + BATCH_SIZE, rows.length))
        .map((row: string[]) => {
          try {
            // Create an object mapping headers to values
            const rowData = headers.reduce((acc: any, header, index) => {
              acc[header] = row[index]
              return acc
            }, {})

            // Clean and validate CPF
            const cpf = String(rowData.cpf || '').replace(/[^\d]/g, '')
            if (!cpf) {
              throw new Error('CPF is required')
            }

            // Clean phone numbers
            const cleanPhone = (phone: string) => phone?.replace(/[^\d]/g, '') || ''
            const phone = cleanPhone(rowData.phone || rowData.telefone)

            // Parse date with better error handling
            const parseBirthDate = (dateStr: string) => {
              if (!dateStr) return null
              try {
                const [day, month, year] = dateStr.split('/').map(Number)
                if (!day || !month || !year) return null
                const date = new Date(year, month - 1, day)
                return date.toISOString()
              } catch {
                return null
              }
            }

            // Map fields to customer table structure
            return {
              full_name: (rowData.full_name || rowData.name || rowData.nome || '').trim(),
              email: rowData.email || `${cpf}@placeholder.com`,
              cpf: cpf,
              phone: phone,
              address: rowData.address || rowData.endereco || null,
              city: rowData.city || rowData.cidade || null,
              state: rowData.state || rowData.estado || null,
              postal_code: (rowData.postal_code || rowData.cep || '').replace(/[^\d]/g, ''),
              gender: rowData.gender === 'M' || rowData.gender === 'Masculino' ? 'male' 
                : rowData.gender === 'F' || rowData.gender === 'Feminino' ? 'female' 
                : null,
              rg: (rowData.rg || '').replace(/[^\d]/g, ''),
              birth_date: parseBirthDate(rowData.birth_date || rowData.data_nascimento),
              nationality: (rowData.nationality || rowData.nacionalidade || 'Brasileira').trim(),
              mobile_phone: cleanPhone(rowData.mobile_phone || rowData.celular),
              other_phone: cleanPhone(rowData.other_phone || rowData.outro_telefone),
              status: rowData.status || 'active',
              residential_address: {},
              commercial_address: {},
              correspondence_address: null
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

          if (error) {
            console.error('Batch error:', error)
            errors.push(`Batch error: ${error.message}`)
            continue
          }

          processedCount += batch.length
          console.log(`Processed ${processedCount}/${rows.length} records`)
        } catch (error) {
          console.error('Unexpected error:', error)
          errors.push(`Unexpected error: ${error.message}`)
        }
      }

      // Add delay between batches
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