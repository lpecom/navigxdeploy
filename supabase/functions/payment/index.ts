import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

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
    // Ensure the request has a body
    if (!req.body) {
      throw new Error('Request body is required')
    }

    let body
    try {
      const text = await req.text()
      console.log('Raw request body:', text) // Debug log
      body = JSON.parse(text)
      console.log('Parsed request body:', body) // Debug log
    } catch (e) {
      console.error('Error parsing request body:', e)
      return new Response(
        JSON.stringify({
          error: 'Invalid JSON in request body',
          details: e.message
        }),
        { 
          status: 400,
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json'
          }
        }
      )
    }

    const { action, payload } = body

    if (!action || !payload) {
      return new Response(
        JSON.stringify({
          error: 'Action and payload are required',
          received: { action, payload }
        }),
        { 
          status: 400,
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json'
          }
        }
      )
    }

    // For now, we'll simulate a successful response
    const mockResponse = {
      success: true,
      transaction_id: crypto.randomUUID(),
      payment_details: {
        status: 'approved',
        method: payload.payment_type,
        amount: payload.amount
      }
    }

    return new Response(
      JSON.stringify(mockResponse),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json'
        }
      }
    )

  } catch (error) {
    console.error('Payment processing error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.toString(),
        timestamp: new Date().toISOString()
      }), 
      {
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json'
        }
      }
    )
  }
})