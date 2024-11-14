import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const APPMAX_API_URL = 'https://sandbox.appmax.com.br/api/v3'

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    if (!req.body) {
      throw new Error('Request body is required')
    }

    let body
    try {
      body = await req.json()
      console.log('Received request body:', JSON.stringify(body))
    } catch (e) {
      console.error('Error parsing request body:', e)
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const { action, payload } = body

    if (!action || !payload) {
      return new Response(
        JSON.stringify({ error: 'Action and payload are required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('Processing request:', { action, payload })

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    switch (action) {
      case 'create_payment': {
        console.log('Creating payment:', payload)
        const appmaxPayload = {
          external_id: crypto.randomUUID(),
          customer: {
            name: payload.customer_name || 'Test Customer',
            email: payload.customer_email || 'test@example.com',
            phone: payload.customer_phone || '11999999999',
            cpf: payload.customer_cpf || '12345678909'
          },
          payment: {
            type: payload.payment_type,
            amount: payload.amount,
            installments: payload.installments || 1,
            card_number: payload.card_number,
            card_holder: payload.holder_name,
            card_expiry: payload.expiry,
            card_cvv: payload.cvv,
            pix_expiration_date: payload.payment_type === 'pix' ? 
              new Date(Date.now() + 30 * 60000).toISOString() : undefined,
            boleto_expiration_date: payload.payment_type === 'boleto' ? 
              new Date(Date.now() + 3 * 24 * 60 * 60000).toISOString() : undefined
          }
        }

        const appmaxApiKey = Deno.env.get('APPMAX_API_KEY')
        if (!appmaxApiKey) {
          throw new Error('APPMAX_API_KEY is not set')
        }

        console.log('Sending to Appmax with payload:', JSON.stringify(appmaxPayload))
        
        const paymentResponse = await fetch(`${APPMAX_API_URL}/payments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${btoa(appmaxApiKey + ':')}`
          },
          body: JSON.stringify(appmaxPayload)
        })

        const paymentData = await paymentResponse.json()
        console.log('Appmax response:', paymentData)

        if (!paymentResponse.ok) {
          console.error('Appmax error response:', paymentData)
          return new Response(
            JSON.stringify({ error: `Payment processing failed: ${paymentData.message || 'Unknown error'}` }),
            { 
              status: paymentResponse.status,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          )
        }

        const { data: payment, error: paymentError } = await supabase
          .from('payments')
          .insert({
            driver_id: payload.driver_id,
            amount: payload.amount,
            payment_type: payload.payment_type,
            installments: payload.installments || 1,
            appmax_transaction_id: paymentData.transaction_id,
            description: payload.description
          })
          .select()
          .single()
        
        if (paymentError) {
          console.error('Error creating payment record:', paymentError)
          throw paymentError
        }

        return new Response(
          JSON.stringify({
            id: payment.id,
            ...paymentData
          }), 
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
    }
  } catch (error) {
    console.error('Payment processing error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.toString(),
        timestamp: new Date().toISOString()
      }), 
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})