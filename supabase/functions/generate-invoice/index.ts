import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { driver_id, amount, description } = await req.json()

    // Create invoice with due date 5 days from now
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + 5)

    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .insert({
        driver_id,
        amount,
        description,
        due_date: dueDate.toISOString(),
      })
      .select()
      .single()

    if (invoiceError) throw invoiceError

    // Create notification for the driver
    const { error: notificationError } = await supabase
      .from('notifications')
      .insert({
        driver_id,
        title: 'Nova Fatura',
        message: `Uma nova fatura no valor de R$ ${amount.toFixed(2)} foi gerada.`,
        type: 'payment'
      })

    if (notificationError) throw notificationError

    return new Response(
      JSON.stringify({ success: true, data: invoice }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})