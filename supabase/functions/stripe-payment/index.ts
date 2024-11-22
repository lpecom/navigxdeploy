import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
})

// This is needed for webhook verification
const cryptoProvider = Stripe.createSubtleCryptoProvider()

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const url = new URL(req.url)

  try {
    // Handle webhooks on /webhook path
    if (url.pathname === '/webhook') {
      const signature = req.headers.get('stripe-signature')
      
      if (!signature) {
        throw new Error('No Stripe signature found')
      }

      const body = await req.text()
      
      let event
      try {
        event = await stripe.webhooks.constructEventAsync(
          body,
          signature,
          Deno.env.get('STRIPE_WEBHOOK_SIGNING_SECRET') || '',
          undefined,
          cryptoProvider
        )
      } catch (err) {
        console.error('Webhook signature verification failed:', err)
        return new Response(JSON.stringify({ error: 'Invalid signature' }), { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      console.log('Webhook event received:', event.type)

      // Handle specific webhook events
      switch (event.type) {
        case 'payment_intent.succeeded':
          const paymentIntent = event.data.object
          console.log('Payment succeeded:', paymentIntent.id)
          
          // Update payment status in database
          const { error: dbError } = await supabase
            .from('stripe_payment_intents')
            .update({ status: 'succeeded' })
            .eq('payment_intent_id', paymentIntent.id)

          if (dbError) {
            console.error('Database update failed:', dbError)
          }
          break

        case 'payment_intent.payment_failed':
          const failedPayment = event.data.object
          console.log('Payment failed:', failedPayment.id)
          break

        // Add more webhook event handlers as needed
      }

      return new Response(JSON.stringify({ received: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Handle regular payment creation requests
    const { action, payload } = await req.json()
    console.log('Received request:', { action, payload })

    if (action === 'create_payment_intent') {
      const { amount, driver_id, metadata } = payload

      // Create payment intent in test mode
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: 'brl',
        metadata: {
          driver_id,
          ...metadata
        },
        automatic_payment_methods: {
          enabled: true,
        },
      })

      // Store payment intent in database
      const { error: dbError } = await supabase
        .from('stripe_payment_intents')
        .insert({
          driver_id,
          payment_intent_id: paymentIntent.id,
          amount: Math.round(amount * 100),
          status: paymentIntent.status
        })

      if (dbError) {
        console.error('Database error:', dbError)
        throw new Error('Failed to store payment intent')
      }

      return new Response(
        JSON.stringify({
          clientSecret: paymentIntent.client_secret,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    throw new Error(`Invalid action: ${action}`)
  } catch (error) {
    console.error('Error processing payment:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})