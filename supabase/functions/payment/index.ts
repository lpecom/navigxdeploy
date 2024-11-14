import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

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
    // Parse request body
    const text = await req.text()
    console.log('Raw request body:', text)
    
    if (!text) {
      throw new Error('Request body is required')
    }

    let body
    try {
      body = JSON.parse(text)
    } catch (e) {
      console.error('JSON parse error:', e)
      throw new Error('Invalid JSON in request body')
    }

    console.log('Parsed request body:', body)

    const { action, payload } = body

    if (!action || !payload) {
      throw new Error('Action and payload are required')
    }

    // Process payment based on action
    if (action === 'create_payment') {
      // Mock successful payment response
      const response = {
        success: true,
        transaction_id: crypto.randomUUID(),
        payment_details: {
          status: 'approved',
          method: payload.payment_type,
          amount: payload.amount
        }
      }

      return new Response(
        JSON.stringify(response),
        { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json'
          }
        }
      )
    }

    throw new Error(`Invalid action: ${action}`)

  } catch (error) {
    console.error('Payment processing error:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        timestamp: new Date().toISOString()
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
})