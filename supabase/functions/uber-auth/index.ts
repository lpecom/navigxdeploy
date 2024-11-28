import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { code, driver_id, refresh_token, grant_type } = await req.json()
    console.log('Processing Uber auth for driver:', driver_id)

    if (!driver_id) {
      throw new Error('Missing driver_id')
    }

    const body = new URLSearchParams()
    if (grant_type === 'refresh_token') {
      if (!refresh_token) throw new Error('Missing refresh_token')
      body.append('grant_type', 'refresh_token')
      body.append('refresh_token', refresh_token)
    } else {
      if (!code) throw new Error('Missing code')
      body.append('grant_type', 'authorization_code')
      body.append('code', code)
      body.append('redirect_uri', Deno.env.get('UBER_REDIRECT_URI') || '')
    }

    body.append('client_id', Deno.env.get('UBER_CLIENT_ID') || '')
    body.append('client_secret', Deno.env.get('UBER_CLIENT_SECRET') || '')

    // Exchange code/refresh_token for tokens
    const tokenResponse = await fetch('https://auth.uber.com/oauth/v2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    })

    const tokens = await tokenResponse.json()
    console.log('Received tokens from Uber')

    if (!tokenResponse.ok) {
      console.error('Token exchange failed:', tokens)
      throw new Error('Failed to exchange authorization code/refresh token')
    }

    // Get Uber driver profile if this is initial auth
    let profile
    if (!grant_type || grant_type === 'authorization_code') {
      const profileResponse = await fetch('https://api.uber.com/v1/partners/me', {
        headers: {
          'Authorization': `Bearer ${tokens.access_token}`,
        },
      })

      profile = await profileResponse.json()
      console.log('Retrieved Uber profile')

      if (!profileResponse.ok) {
        console.error('Profile fetch failed:', profile)
        throw new Error('Failed to fetch Uber profile')
      }
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
        uber_driver_id: profile?.id,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        token_expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
        is_active: true,
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