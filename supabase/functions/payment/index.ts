import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const APPMAX_API_URL = 'https://api.appmax.com.br/api/v3'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { action, payload } = await req.json()
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    switch (action) {
      case 'create_payment':
        console.log('Creating payment:', payload)
        let appmaxPayload = {
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
              new Date(Date.now() + 30 * 60000).toISOString() : undefined, // 30 minutes
            boleto_expiration_date: payload.payment_type === 'boleto' ? 
              new Date(Date.now() + 3 * 24 * 60 * 60000).toISOString() : undefined // 3 days
          }
        }

        const appmaxApiKey = Deno.env.get('APPMAX_API_KEY')
        if (!appmaxApiKey) {
          throw new Error('APPMAX_API_KEY is not set')
        }

        console.log('Sending to Appmax:', appmaxPayload)
        const paymentResponse = await fetch(`${APPMAX_API_URL}/payments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': appmaxApiKey // Removed Bearer prefix as Appmax expects just the key
          },
          body: JSON.stringify(appmaxPayload)
        })

        const paymentData = await paymentResponse.json()
        console.log('Appmax response:', paymentData)

        if (!paymentResponse.ok) {
          throw new Error(`Appmax error: ${JSON.stringify(paymentData)}`)
        }

        // Create payment record
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
        
        if (paymentError) throw paymentError

        // Handle specific payment type records
        if (payload.payment_type === 'boleto' && paymentData.boleto) {
          const { error: boletoError } = await supabase
            .from('boletos')
            .insert({
              payment_id: payment.id,
              barcode: paymentData.boleto.barcode,
              due_date: new Date(paymentData.boleto.due_date),
              pdf_url: paymentData.boleto.pdf_url
            })
          
          if (boletoError) throw boletoError
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
          
          if (pixError) throw pixError
        }

        return new Response(JSON.stringify({
          id: payment.id,
          ...paymentData
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      default:
        throw new Error('Invalid action')
    }
  } catch (error) {
    console.error('Payment processing error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})