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
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { action, payload } = await req.json()
    console.log('Received request:', { action, payload })

    if (action === 'create_payment_intent') {
      const { amount, driver_id, metadata } = payload

      // Create or retrieve Stripe customer
      const { data: existingCustomer } = await supabase
        .from('stripe_customers')
        .select('stripe_customer_id')
        .eq('driver_id', driver_id)
        .single()

      let stripeCustomerId
      if (existingCustomer) {
        stripeCustomerId = existingCustomer.stripe_customer_id
      } else {
        const { data: driverDetails } = await supabase
          .from('driver_details')
          .select('email, full_name')
          .eq('id', driver_id)
          .single()

        const customer = await stripe.customers.create({
          email: driverDetails.email,
          name: driverDetails.full_name,
          metadata: { driver_id }
        })

        await supabase.from('stripe_customers').insert({
          driver_id,
          stripe_customer_id: customer.id
        })

        stripeCustomerId = customer.id
      }

      // Create payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: 'brl',
        customer: stripeCustomerId,
        metadata: {
          driver_id,
          ...metadata
        },
        automatic_payment_methods: {
          enabled: true,
        },
      })

      // Store payment intent in database
      await supabase.from('stripe_payment_intents').insert({
        driver_id,
        payment_intent_id: paymentIntent.id,
        amount: Math.round(amount * 100),
        status: paymentIntent.status
      })

      return new Response(
        JSON.stringify({
          clientSecret: paymentIntent.client_secret,
          customerId: stripeCustomerId
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