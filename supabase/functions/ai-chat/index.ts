import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function getFleetStats(supabase: any) {
  const { data: vehicles } = await supabase
    .from('fleet_vehicles')
    .select(`
      status,
      car_model:car_models (
        name
      )
    `);

  const stats = {
    total: vehicles?.length || 0,
    maintenance: vehicles?.filter(v => v.status === 'maintenance').length || 0,
    available: vehicles?.filter(v => v.status === 'available').length || 0,
    rented: vehicles?.filter(v => v.status === 'rented').length || 0,
  };

  return stats;
}

async function getCustomerInfo(supabase: any, customerName: string) {
  const { data: customers } = await supabase
    .from('customers')
    .select(`
      *,
      fleet_vehicles!fleet_vehicles_customer_id_fkey (
        id
      )
    `)
    .ilike('full_name', `%${customerName}%`);

  return customers;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase configuration is missing');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { message, conversationId, userId, isAdmin } = await req.json();

    if (!message || !userId) {
      throw new Error('Missing required parameters');
    }

    // Create a new conversation if none exists
    let currentConversationId = conversationId;
    if (!currentConversationId) {
      const { data: conversation, error: convError } = await supabase
        .from('chat_conversations')
        .insert(
          isAdmin 
            ? { admin_user_id: userId }
            : { driver_id: userId }
        )
        .select()
        .single();

      if (convError) throw convError;
      currentConversationId = conversation.id;
    }

    // Save user message
    const { error: msgError } = await supabase.from('chat_messages').insert({
      conversation_id: currentConversationId,
      role: 'user',
      content: message
    });

    if (msgError) throw msgError;

    // Get conversation history
    const { data: messages, error: historyError } = await supabase
      .from('chat_messages')
      .select('role, content')
      .eq('conversation_id', currentConversationId)
      .order('created_at', { ascending: true });

    if (historyError) throw historyError;

    // Get fleet stats and format them
    const fleetStats = await getFleetStats(supabase);
    
    // Extract customer name if the question is about a specific customer
    const customerNameMatch = message.match(/customer\s+([^?\.]+)/i);
    let customerInfo = null;
    if (customerNameMatch) {
      customerInfo = await getCustomerInfo(supabase, customerNameMatch[1].trim());
    }

    // Format messages for OpenAI
    const formattedMessages = [
      {
        role: 'system',
        content: `You are a helpful assistant for a car rental company administrator. You have access to the following real-time information:

Fleet Statistics:
- Total vehicles: ${fleetStats.total}
- Vehicles in maintenance: ${fleetStats.maintenance}
- Available vehicles: ${fleetStats.available}
- Rented vehicles: ${fleetStats.rented}

${customerInfo ? `Customer Information for "${customerNameMatch[1].trim()}":
${customerInfo.map(c => `- Name: ${c.full_name}
- Total rentals: ${c.total_rentals || 0}
- Last rental: ${c.last_rental_date ? new Date(c.last_rental_date).toLocaleDateString() : 'Never'}
- Status: ${c.status}
`).join('\n')}` : ''}

Please use this information to provide accurate responses about the fleet and customer status.`
      },
      ...messages?.map(msg => ({
        role: msg.role,
        content: msg.content
      })) || [],
      { role: 'user', content: message }
    ];

    // Get AI response
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: formattedMessages,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const aiMessage = data.choices[0].message.content;

    // Save AI response
    const { error: aiMsgError } = await supabase.from('chat_messages').insert({
      conversation_id: currentConversationId,
      role: 'assistant',
      content: aiMessage
    });

    if (aiMsgError) throw aiMsgError;

    return new Response(
      JSON.stringify({ 
        message: aiMessage, 
        conversationId: currentConversationId 
      }), 
      {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
      }
    );
  } catch (error) {
    console.error('Error in ai-chat function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An unexpected error occurred' 
      }), 
      {
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
      }
    );
  }
});