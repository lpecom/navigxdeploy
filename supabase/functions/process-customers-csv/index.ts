import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import * as csv from 'https://deno.land/std@0.170.0/encoding/csv.ts'
import { processCustomerBatch } from './utils/customerProcessor.ts'
import { createColumnMappings } from './utils/columnMapper.ts'

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
    const lines = text.split('\n').filter(line => line.trim())
    
    if (lines.length === 0) {
      throw new Error('Empty CSV file')
    }

    const headers = lines[0].toLowerCase().split(',').map(h => h.trim())
    console.log('Processing CSV with headers:', headers)

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get active rentals
    const { data: activeRentals } = await supabase
      .from('fleet_vehicles')
      .select('customer_id, customers!inner(cpf)')
      .not('customer_id', 'is', null)

    const activeRentalCpfs = new Set(
      activeRentals?.map(rental => rental.customers?.cpf).filter(Boolean)
    )

    const rows = await csv.parse(text, {
      skipFirstRow: true,
      columns: headers,
    })

    console.log(`Processing ${rows.length} customers`)

    const columnMappings = createColumnMappings(headers)
    console.log('Column mappings:', columnMappings)

    let processedCount = 0
    const errors = []
    const BATCH_SIZE = 5
    const BATCH_DELAY = 300

    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
      const batch = rows.slice(i, Math.min(i + BATCH_SIZE, rows.length))
      const { processed, errors: batchErrors } = await processCustomerBatch(
        batch,
        columnMappings,
        supabase,
        activeRentalCpfs
      )
      
      processedCount += processed
      errors.push(...batchErrors)
      console.log(`Processed ${processedCount}/${rows.length} records`)
      
      if (i + BATCH_SIZE < rows.length) {
        await new Promise(resolve => setTimeout(resolve, BATCH_DELAY))
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        processed: processedCount,
        errors,
        message: `Successfully processed ${processedCount} customers` 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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