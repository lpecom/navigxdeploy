import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import * as csv from 'https://deno.land/std@0.170.0/encoding/csv.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    if (req.method !== 'POST') {
      throw new Error('Method not allowed')
    }

    const formData = await req.formData()
    const file = formData.get('file')
    
    if (!file || !(file instanceof File)) {
      throw new Error('No file uploaded')
    }

    const text = await file.text()
    const lines = text.split('\n').filter(line => line.trim())
    
    if (lines.length === 0) {
      throw new Error('Empty CSV file')
    }

    const headers = lines[0].toLowerCase().split(',').map(h => h.trim())
    console.log('Original headers:', headers)

    const fieldMappings: { [key: string]: string[] } = {
      cpf: ['cpf', 'cpf/passport', 'document', 'documento', 'cpf/passaporte'],
      full_name: ['full_name', 'name', 'nome', 'full name', 'nome completo'],
      email: ['email', 'e-mail', 'correio'],
      phone: ['phone', 'telefone', 'celular', 'mobile'],
      address: ['address', 'endereco', 'endereço'],
      city: ['city', 'cidade'],
      state: ['state', 'estado', 'uf'],
      postal_code: ['postal_code', 'cep', 'zip', 'zip code']
    }

    const findColumnName = (field: string): string | undefined => {
      const variations = fieldMappings[field]
      if (!variations) return undefined
      return headers.find(header => variations.includes(header))
    }

    const rows = await csv.parse(text, {
      skipFirstRow: true,
      columns: headers,
    })

    console.log(`Processing ${rows.length} customers`)

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    let processedCount = 0
    const errors = []
    const BATCH_SIZE = 5
    const BATCH_DELAY = 300

    const cpfColumn = findColumnName('cpf')
    const nameColumn = findColumnName('full_name')
    const emailColumn = findColumnName('email')
    const phoneColumn = findColumnName('phone')
    const addressColumn = findColumnName('address')
    const cityColumn = findColumnName('city')
    const stateColumn = findColumnName('state')
    const postalCodeColumn = findColumnName('postal_code')

    console.log('Found columns:', {
      cpfColumn,
      nameColumn,
      emailColumn,
      phoneColumn,
      addressColumn,
      cityColumn,
      stateColumn,
      postalCodeColumn
    })

    // First, get all customers with active rentals from fleet_vehicles
    const { data: activeRentals } = await supabase
      .from('fleet_vehicles')
      .select('customer_id, customers!inner(cpf)')
      .not('customer_id', 'is', null)

    const activeRentalCpfs = new Set(activeRentals?.map(rental => 
      rental.customers?.cpf
    ).filter(Boolean))

    console.log('Active rental CPFs:', activeRentalCpfs)

    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
      const batch = rows.slice(i, Math.min(i + BATCH_SIZE, rows.length))
        .map((row: any) => {
          try {
            const cpf = String(row[cpfColumn || 'cpf'] || '').replace(/[^\d]/g, '')
            if (!cpf) {
              throw new Error('CPF is required')
            }

            const cleanPhone = (phone: string) => phone?.replace(/[^\d]/g, '') || ''

            return {
              full_name: row[nameColumn || 'full_name'] || row[nameColumn || 'name'] || '',
              email: row[emailColumn || 'email'] || `${cpf}@placeholder.com`,
              cpf,
              phone: cleanPhone(row[phoneColumn || 'phone']),
              address: row[addressColumn || 'address'] || null,
              city: row[cityColumn || 'city'] || null,
              state: row[stateColumn || 'state'] || null,
              postal_code: row[postalCodeColumn || 'postal_code'] || null,
              status: activeRentalCpfs.has(cpf) ? 'active_rental' : 'active'
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