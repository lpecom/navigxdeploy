import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const UBER_API_URL = 'https://api.uber.com/v1'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { code, driver_id } = await req.json()

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

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange authorization code')
    }

    // Get Uber driver profile
    const profileResponse = await fetch(`${UBER_API_URL}/partners/me`, {
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`,
      },
    })

    const profile = await profileResponse.json()

    if (!profileResponse.ok) {
      throw new Error('Failed to fetch Uber profile')
    }

    // Store integration data in Supabase
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { error } = await supabaseClient
      .from('driver_uber_integrations')
      .upsert({
        driver_id,
        uber_driver_id: profile.id,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        token_expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
      })

    if (error) throw error

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})