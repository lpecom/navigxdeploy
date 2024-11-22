import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
})

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { action, payload } = await req.json()
    console.log('Received request:', { action, payload })

    if (action === 'create_payment_intent') {
      const { amount, driver_id, metadata } = payload

      // Create payment intent
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