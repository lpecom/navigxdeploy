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

    console.log('Searching for images of:', modelName)

    // Use Google Custom Search API
    const searchQuery = encodeURIComponent(`${modelName} carro exterior`)
    const searchUrl = `https://customsearch.googleapis.com/customsearch/v1?` + 
      `key=${Deno.env.get('GOOGLE_SEARCH_API_KEY')}` +
      `&cx=${Deno.env.get('GOOGLE_SEARCH_ENGINE_ID')}` +
      `&q=${searchQuery}` +
      `&searchType=image` +
      `&imgSize=large` +
      `&num=5` // Increased to get more results

    console.log('Fetching from URL:', searchUrl)

    const response = await fetch(searchUrl)
    const data = await response.json()

    console.log('Search API response:', JSON.stringify(data, null, 2))

    if (!data.items || data.items.length === 0) {
      throw new Error('No images found for this model')
    }

    // Try to find a suitable image from the results
    const imageUrl = data.items.find(item => 
      item.link && 
      (item.link.endsWith('.jpg') || 
       item.link.endsWith('.jpeg') || 
       item.link.endsWith('.png'))
    )?.link || data.items[0].link

    if (!imageUrl) {
      throw new Error('No suitable image found')
    }

    console.log('Found image URL:', imageUrl)

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Download image and upload to Supabase Storage
    const imageResponse = await fetch(imageUrl)
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.statusText}`)
    }

    const imageBlob = await imageResponse.blob()
    const fileName = `${modelName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.jpg`
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('vehicle-images')
      .upload(fileName, imageBlob, {
        contentType: 'image/jpeg',
        upsert: true
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      throw uploadError
    }

    console.log('Image uploaded successfully:', fileName)

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
      console.error('Update error:', updateError)
      throw updateError
    }

    console.log('Database updated with new image URL:', publicUrl)

    return new Response(
      JSON.stringify({ success: true, imageUrl: publicUrl }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in crawl-car-images:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    )
  }
})