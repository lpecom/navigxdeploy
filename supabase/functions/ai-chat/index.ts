import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { 
  getFleetStats, 
  getMaintenanceSchedule, 
  getFinancialMetrics, 
  getCustomerTrends,
  getCustomerInfo 
} from './utils/businessMetrics.ts';
import { searchWeb } from './utils/webSearch.ts';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey || !supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing required configuration');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { message, conversationId, userId, isAdmin } = await req.json();

    if (!message || !userId) {
      throw new Error('Missing required parameters');
    }

    // Create or get conversation
    let currentConversationId = conversationId;
    if (!currentConversationId) {
      const { data: conversation, error: convError } = await supabase
        .from('chat_conversations')
        .insert(isAdmin ? { admin_user_id: userId } : { driver_id: userId })
        .select()
        .single();

      if (convError) throw convError;
      currentConversationId = conversation.id;
    }

    // Save user message
    await supabase.from('chat_messages').insert({
      conversation_id: currentConversationId,
      role: 'user',
      content: message
    });

    // Get conversation history
    const { data: messages } = await supabase
      .from('chat_messages')
      .select('role, content')
      .eq('conversation_id', currentConversationId)
      .order('created_at', { ascending: true });

    // Gather business metrics
    const fleetStats = await getFleetStats(supabase);
    const maintenanceSchedule = await getMaintenanceSchedule(supabase);
    const financialMetrics = await getFinancialMetrics(supabase);
    const customerTrends = await getCustomerTrends(supabase);
    
    // Check for customer-specific queries
    const customerNameMatch = message.match(/customer\s+([^?\.]+)/i);
    const customerInfo = customerNameMatch ? 
      await getCustomerInfo(supabase, customerNameMatch[1].trim()) : null;

    // Perform web search for relevant information
    const webSearchResults = await searchWeb(message);

    // Format system message with all available data
    const systemMessage = `You are a helpful assistant for a car rental company administrator. You have access to the following information:

${JSON.stringify({ fleetStats, maintenanceSchedule, financialMetrics, customerTrends, customerInfo }, null, 2)}

${webSearchResults ? `\nRelevant web search results:
${webSearchResults.map(r => `- ${r.title}: ${r.snippet}`).join('\n')}` : ''}

Please use this information to provide accurate responses about the business status and industry context. When discussing money values, always format them in Brazilian Real (R$).`;

    // Get AI response
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemMessage },
          ...(messages?.map(msg => ({
            role: msg.role,
            content: msg.content
          })) || []),
          { role: 'user', content: message }
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const aiMessage = data.choices[0].message.content;

    // Save AI response
    await supabase.from('chat_messages').insert({
      conversation_id: currentConversationId,
      role: 'assistant',
      content: aiMessage
    });

    return new Response(
      JSON.stringify({ message: aiMessage, conversationId: currentConversationId }), 
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in ai-chat function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'An unexpected error occurred' }), 
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});