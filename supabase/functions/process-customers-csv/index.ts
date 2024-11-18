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

    const buffer = await file.arrayBuffer()
    const workbook = XLSX.read(new Uint8Array(buffer), { type: 'array' })
    const worksheet = workbook.Sheets[workbook.SheetNames[0]]
    const data = XLSX.utils.sheet_to_json(worksheet)

    console.log(`Processing ${data.length} customers`)

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    let processedCount = 0
    const errors = []
    const BATCH_SIZE = 5 // Reduced batch size
    const BATCH_DELAY = 300 // Increased delay between batches

    for (let i = 0; i < data.length; i += BATCH_SIZE) {
      const batch = data.slice(i, Math.min(i + BATCH_SIZE, data.length))
        .map((row: any) => {
          try {
            const cpf = String(row['CPF/Passaporte'] || '').replace(/[^\d]/g, '')
            if (!cpf) {
              throw new Error('CPF is required')
            }

            // Clean and format phone numbers
            const cleanPhone = (phone: string) => phone?.replace(/[^\d]/g, '') || ''
            const phone = cleanPhone(row['Celular']) || cleanPhone(row['Fone Residencial']) || ''
            
            // Build complete address
            const address = [
              row['Endereço Residencial'],
              row['Num.'],
              row['Complemento']
            ].filter(Boolean).join(' ')

            // Parse date with better error handling
            const parseBirthDate = (dateStr: string) => {
              if (!dateStr) return null
              const [day, month, year] = dateStr.split('/').map(Number)
              if (!day || !month || !year) return null
              return new Date(year, month - 1, day).toISOString()
            }

            return {
              full_name: (row['Cliente'] || '').trim(),
              email: row['Email'] || `${cpf}@placeholder.com`,
              cpf: cpf,
              phone: phone,
              address: address || null,
              city: row['Cidade'] || null,
              state: row['Estado'] || null,
              postal_code: (row['CEP'] || '').replace(/[^\d]/g, ''),
              gender: row['Sexo'] === 'M' ? 'male' : row['Sexo'] === 'F' ? 'female' : null,
              rg: (row['RG'] || '').replace(/[^\d]/g, ''),
              birth_date: parseBirthDate(row['Data Nascimento']),
              nationality: (row['Nacionalidade'] || '').trim(),
              registration_type: row['Tipo Cadastro'] || null,
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
          console.log(`Processed ${processedCount}/${data.length} records`)
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