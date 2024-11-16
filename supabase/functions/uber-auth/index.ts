import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const UBER_API_URL = 'https://api.uber.com/v1'

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { code, driver_id } = await req.json()
    console.log('Received auth code for driver:', driver_id)

    if (!code || !driver_id) {
      throw new Error('Missing required parameters')
    }

    // Exchange authorization code for tokens
    const tokenResponse = await fetch('https://auth.uber.com/oauth/v2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: Deno.env.get('UBER_CLIENT_ID') || '',
        client_secret: Deno.env.get('UBER_CLIENT_SECRET') || '',
        grant_type: 'authorization_code',
        code,
        redirect_uri: Deno.env.get('UBER_REDIRECT_URI') || '',
      }),
    })

    const tokens = await tokenResponse.json()
    console.log('Received tokens from Uber')

    if (!tokenResponse.ok) {
      console.error('Token exchange failed:', tokens)
      throw new Error('Failed to exchange authorization code')
    }

    // Get Uber driver profile
    const profileResponse = await fetch(`${UBER_API_URL}/partners/me`, {
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`,
      },
    })

    const profile = await profileResponse.json()
    console.log('Retrieved Uber profile')

    if (!profileResponse.ok) {
      console.error('Profile fetch failed:', profile)
      throw new Error('Failed to fetch Uber profile')
    }

    // Store integration data in Supabase
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { error: upsertError } = await supabaseAdmin
      .from('driver_uber_integrations')
      .upsert({
        driver_id,
        uber_driver_id: profile.id,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        token_expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
      })

    if (upsertError) {
      console.error('Database update failed:', upsertError)
      throw upsertError
    }

    console.log('Successfully stored Uber integration data')

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in uber-auth function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})