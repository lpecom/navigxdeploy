import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const APPMAX_API_URL = 'https://sandbox.appmax.com.br/api/v3'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    if (!req.body) {
      throw new Error('Request body is required')
    }

    const bodyText = await req.text()
    console.log('Raw request body:', bodyText)

    let body
    try {
      body = JSON.parse(bodyText)
    } catch (e) {
      console.error('Error parsing request body:', e)
      throw new Error('Invalid JSON in request body')
    }

    const { action, payload } = body

    if (!action || !payload) {
      throw new Error('Action and payload are required')
    }

    console.log('Parsed request:', { action, payload })

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
            card_token: payload.card_token,
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
          throw new Error(`Appmax error: ${JSON.stringify(paymentData)}`)
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

        if (payload.payment_type === 'boleto' && paymentData.boleto) {
          const { error: boletoError } = await supabase
            .from('boletos')
            .insert({
              payment_id: payment.id,
              barcode: paymentData.boleto.barcode,
              due_date: new Date(paymentData.boleto.due_date),
              pdf_url: paymentData.boleto.pdf_url
            })
          
          if (boletoError) {
            console.error('Error creating boleto record:', boletoError)
            throw boletoError
          }
        }
        
        if (payload.payment_type === 'pix' && paymentData.pix) {
          const { error: pixError } = await supabase
            .from('pix_payments')
            .insert({
              payment_id: payment.id,
              qr_code: paymentData.pix.qr_code,
              qr_code_url: paymentData.pix.qr_code_url,
              expiration_date: new Date(paymentData.pix.expiration_date)
            })
          
          if (pixError) {
            console.error('Error creating pix record:', pixError)
            throw pixError
          }
        }

        return new Response(JSON.stringify({
          id: payment.id,
          ...paymentData
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      default:
        throw new Error('Invalid action')
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