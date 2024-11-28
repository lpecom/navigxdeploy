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

async function getMaintenanceSchedule(supabase: any) {
  const { data: vehicles } = await supabase
    .from('fleet_vehicles')
    .select(`
      *,
      car_model:car_models (name)
    `)
    .order('next_revision_date', { ascending: true })
    .limit(5);

  return vehicles;
}

async function getFinancialMetrics(supabase: any) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data: payments } = await supabase
    .from('payments')
    .select('amount, status, payment_type, created_at')
    .gte('created_at', thirtyDaysAgo.toISOString());

  const metrics = {
    totalRevenue: payments?.reduce((sum, p) => sum + (p.status === 'completed' ? Number(p.amount) : 0), 0) || 0,
    pendingPayments: payments?.filter(p => p.status === 'pending').length || 0,
    paymentMethods: payments?.reduce((acc, p) => {
      acc[p.payment_type] = (acc[p.payment_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {},
  };

  return metrics;
}

async function getCustomerTrends(supabase: any) {
  const { data: customers } = await supabase
    .from('customers')
    .select('created_at, status')
    .order('created_at', { ascending: false })
    .limit(100);

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const trends = {
    newCustomers30Days: customers?.filter(c => 
      new Date(c.created_at) >= thirtyDaysAgo
    ).length || 0,
    activeCustomers: customers?.filter(c => 
      c.status === 'active' || c.status === 'active_rental'
    ).length || 0,
  };

  return trends;
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

    // Get all the business metrics
    const fleetStats = await getFleetStats(supabase);
    const maintenanceSchedule = await getMaintenanceSchedule(supabase);
    const financialMetrics = await getFinancialMetrics(supabase);
    const customerTrends = await getCustomerTrends(supabase);
    
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

Maintenance Schedule (Next 5 vehicles due):
${maintenanceSchedule?.map(v => `- ${v.car_model.name} (Plate: ${v.plate}) - Due: ${new Date(v.next_revision_date).toLocaleDateString()}`).join('\n')}

Financial Metrics (Last 30 days):
- Total Revenue: R$ ${financialMetrics.totalRevenue.toFixed(2)}
- Pending Payments: ${financialMetrics.pendingPayments}
- Payment Methods Distribution: ${Object.entries(financialMetrics.paymentMethods)
  .map(([method, count]) => `${method}: ${count}`).join(', ')}

Customer Trends:
- New Customers (30 days): ${customerTrends.newCustomers30Days}
- Active Customers: ${customerTrends.activeCustomers}

${customerInfo ? `Customer Information for "${customerNameMatch[1].trim()}":
${customerInfo.map(c => `- Name: ${c.full_name}
- Total rentals: ${c.total_rentals || 0}
- Last rental: ${c.last_rental_date ? new Date(c.last_rental_date).toLocaleDateString() : 'Never'}
- Status: ${c.status}
`).join('\n')}` : ''}

Please use this information to provide accurate responses about the business status. You can help with:
1. Fleet management and vehicle status
2. Maintenance scheduling and alerts
3. Financial analysis and revenue tracking
4. Customer behavior and rental patterns
5. Operational efficiency suggestions based on the data

When discussing money values, always format them in Brazilian Real (R$).`
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