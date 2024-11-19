import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { modelName } = await req.json()
    
    if (!modelName) {
      throw new Error('Model name is required')
    }

    // Use Google Custom Search API to find car images
    const searchQuery = encodeURIComponent(`${modelName} car exterior official`)
    const searchUrl = `https://customsearch.googleapis.com/customsearch/v1?` + 
      `key=${Deno.env.get('GOOGLE_SEARCH_API_KEY')}` +
      `&cx=${Deno.env.get('GOOGLE_SEARCH_ENGINE_ID')}` +
      `&q=${searchQuery}` +
      `&searchType=image` +
      `&imgSize=large` +
      `&num=1`

    const response = await fetch(searchUrl)
    const data = await response.json()

    if (!data.items?.[0]?.link) {
      throw new Error('No image found')
    }

    const imageUrl = data.items[0].link

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Download image and upload to Supabase Storage
    const imageResponse = await fetch(imageUrl)
    const imageBlob = await imageResponse.blob()
    
    const fileName = `${modelName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.jpg`
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('vehicle-images')
      .upload(fileName, imageBlob, {
        contentType: 'image/jpeg',
        upsert: true
      })

    if (uploadError) {
      throw uploadError
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('vehicle-images')
      .getPublicUrl(fileName)

    // Update car_models table with new image URL
    const { error: updateError } = await supabase
      .from('car_models')
      .update({ image_url: publicUrl })
      .eq('name', modelName)

    if (updateError) {
      throw updateError
    }

    return new Response(
      JSON.stringify({ success: true, imageUrl: publicUrl }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})