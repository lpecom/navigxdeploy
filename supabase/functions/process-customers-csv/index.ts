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
    const rows = await csv.parse(text, {
      skipFirstRow: true,
      columns: [
        'code', 'registration_type', 'full_name', 'cpf', 'col1', 'gender',
        'rg', 'birth_date', 'email', 'nationality', 'address', 'number',
        'complement', 'neighborhood', 'postal_code', 'city', 'state',
        'residential_phone', 'mobile_phone', 'other_phone'
      ],
    })

    console.log(`Processing ${rows.length} customers`)

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    let processedCount = 0
    const errors = []
    const BATCH_SIZE = 5 // Reduced batch size
    const BATCH_DELAY = 300 // Increased delay between batches

    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
      const batch = rows.slice(i, Math.min(i + BATCH_SIZE, rows.length))
        .map((row: any) => {
          try {
            const cpf = String(row.cpf || '').replace(/[^\d]/g, '')
            if (!cpf) {
              throw new Error('CPF is required')
            }

            // Clean and format phone numbers
            const cleanPhone = (phone: string) => phone?.replace(/[^\d]/g, '') || ''
            const phone = cleanPhone(row.mobile_phone) || cleanPhone(row.residential_phone) || ''
            
            // Build complete address
            const address = [
              row.address,
              row.number,
              row.complement
            ].filter(Boolean).join(' ')

            // Parse date with better error handling
            const parseBirthDate = (dateStr: string) => {
              if (!dateStr) return null
              const [day, month, year] = dateStr.split('/').map(Number)
              if (!day || !month || !year) return null
              return new Date(year, month - 1, day).toISOString()
            }

            return {
              full_name: (row.full_name || '').trim(),
              email: row.email || `${cpf}@placeholder.com`,
              cpf: cpf,
              phone: phone,
              address: address || null,
              city: row.city || null,
              state: row.state || null,
              postal_code: (row.postal_code || '').replace(/[^\d]/g, ''),
              gender: row.gender === 'M' ? 'male' : row.gender === 'F' ? 'female' : null,
              rg: (row.rg || '').replace(/[^\d]/g, ''),
              birth_date: parseBirthDate(row.birth_date),
              nationality: (row.nationality || '').trim(),
              registration_type: row.registration_type || null,
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

      // Add delay between batches to prevent resource exhaustion
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