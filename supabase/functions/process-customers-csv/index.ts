import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import * as XLSX from 'https://esm.sh/xlsx@0.18.5'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const columnMappings = {
  'Cliente': 'full_name',
  'CPF/Passaporte': 'cpf',
  'Email': 'email',
  'Sexo': 'gender',
  'RG': 'rg',
  'Data Nascimento': 'birth_date',
  'Nacionalidade': 'nationality',
  'Endereço Residencial': 'address',
  'Num.': 'number',
  'Complemento': 'complement',
  'Bairro': 'neighborhood',
  'CEP': 'postal_code',
  'Cidade': 'city',
  'Estado': 'state',
  'Fone Residencial': 'phone',
  'Celular': 'mobile_phone',
  'Outro Fone': 'other_phone',
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
    const workbook = XLSX.read(new Uint8Array(buffer), { 
      type: 'array',
      raw: true,
      cellDates: true
    })
    
    const worksheet = workbook.Sheets[workbook.SheetNames[0]]
    const data = XLSX.utils.sheet_to_json(worksheet)

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    let processedCount = 0
    const errors = []
    const BATCH_SIZE = 5 // Very small batch size for stability

    for (let i = 0; i < data.length; i += BATCH_SIZE) {
      const batch = data.slice(i, Math.min(i + BATCH_SIZE, data.length))
        .map((row: any) => {
          try {
            const cpf = String(row['CPF/Passaporte'] || '').replace(/[^\d]/g, '')
            if (!cpf) {
              throw new Error('CPF is required')
            }

            const residentialAddress = {
              address: row['Endereço Residencial'] || '',
              number: row['Num.'] || '',
              complement: row['Complemento'] || '',
              neighborhood: row['Bairro'] || '',
              postal_code: row['CEP']?.replace(/[^\d]/g, '') || '',
              city: row['Cidade'] || '',
              state: row['Estado'] || '',
              phone: row['Fone Residencial'] || ''
            }

            const commercialAddress = {
              address: row['Endereço Comercial'] || '',
              number: row['Num.2'] || '',
              complement: '',
              neighborhood: '',
              postal_code: '',
              city: '',
              state: '',
              phone: ''
            }

            return {
              full_name: (row['Cliente'] || '').trim(),
              email: (row['Email'] || `${cpf}@placeholder.com`).trim(),
              cpf: cpf,
              phone: (row['Celular'] || row['Fone Residencial'] || '').replace(/[^\d]/g, ''),
              gender: row['Sexo'] === 'M' ? 'male' : row['Sexo'] === 'F' ? 'female' : null,
              rg: (row['RG'] || '').replace(/[^\d]/g, ''),
              birth_date: row['Data Nascimento'] ? new Date(row['Data Nascimento']) : null,
              nationality: (row['Nacionalidade'] || '').trim(),
              residential_address: residentialAddress,
              commercial_address: commercialAddress,
              mobile_phone: (row['Celular'] || '').replace(/[^\d]/g, ''),
              other_phone: (row['Outro Fone'] || '').replace(/[^\d]/g, ''),
              status: 'active',
              registration_type: row['Tipo Cadastro'] || 'Interno - Físico'
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
          console.log(`Processed ${processedCount} records`)
        } catch (error) {
          console.error('Unexpected error:', error)
          errors.push(`Unexpected error: ${error.message}`)
        }
      }

      // Longer delay between batches
      await new Promise(resolve => setTimeout(resolve, 300))
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