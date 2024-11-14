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
      case 'tokenize':
        const tokenizeResponse = await fetch(`${APPMAX_API_URL}/tokenize`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Deno.env.get('APPMAX_API_KEY')}`
          },
          body: JSON.stringify(payload)
        })
        const tokenData = await tokenizeResponse.json()
        
        if (tokenData.token) {
          const { error } = await supabase
            .from('payment_methods')
            .insert({
              driver_id: payload.driver_id,
              card_token: tokenData.token,
              card_brand: payload.card_brand,
              last_four: payload.card_number.slice(-4),
              holder_name: payload.holder_name
            })
          
          if (error) throw error
        }
        
        return new Response(JSON.stringify(tokenData), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      case 'create_payment':
        const paymentResponse = await fetch(`${APPMAX_API_URL}/payments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Deno.env.get('APPMAX_API_KEY')}`
          },
          body: JSON.stringify(payload)
        })
        const paymentData = await paymentResponse.json()
        
        // Create payment record
        const { data: payment, error: paymentError } = await supabase
          .from('payments')
          .insert({
            driver_id: payload.driver_id,
            amount: payload.amount,
            payment_type: payload.payment_type,
            installments: payload.installments,
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
              due_date: paymentData.boleto.due_date,
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
              expiration_date: paymentData.pix.expiration_date
            })
          
          if (pixError) throw pixError
        }

        return new Response(JSON.stringify(paymentData), {
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