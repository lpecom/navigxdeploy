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

    console.log('Searching images for model:', modelName)

    const searchQuery = `${modelName} carro novo oficial`
    const searchUrl = `https://customsearch.googleapis.com/customsearch/v1?q=${encodeURIComponent(searchQuery)}&cx=${Deno.env.get('GOOGLE_SEARCH_ENGINE_ID')}&searchType=image&key=${Deno.env.get('GOOGLE_SEARCH_API_KEY')}&num=5`

    const response = await fetch(searchUrl)
    const data = await response.json()

    if (!response.ok) {
      console.error('Google API error:', data)
      throw new Error('Failed to fetch images')
    }

    if (!data.items || data.items.length === 0) {
      throw new Error('No images found')
    }

    const images = data.items
      .filter((item: any) => item.link && (
        item.link.endsWith('.jpg') || 
        item.link.endsWith('.jpeg') || 
        item.link.endsWith('.png')
      ))
      .map((item: any) => ({
        url: item.link,
        thumbnail: item.image.thumbnailLink,
        title: item.title,
      }))

    if (images.length === 0) {
      throw new Error('No valid images found')
    }

    return new Response(
      JSON.stringify({ images }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})