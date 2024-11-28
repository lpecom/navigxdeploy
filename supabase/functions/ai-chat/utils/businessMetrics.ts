import { SupabaseClient } from '@supabase/supabase-js';

export async function getFleetStats(supabase: SupabaseClient) {
  const { data: vehicles } = await supabase
    .from('fleet_vehicles')
    .select(`
      status,
      car_model:car_models (name)
    `);

  return {
    total: vehicles?.length || 0,
    maintenance: vehicles?.filter(v => v.status === 'maintenance').length || 0,
    available: vehicles?.filter(v => v.status === 'available').length || 0,
    rented: vehicles?.filter(v => v.status === 'rented').length || 0,
  };
}

export async function getMaintenanceSchedule(supabase: SupabaseClient) {
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

export async function getFinancialMetrics(supabase: SupabaseClient) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data: payments } = await supabase
    .from('payments')
    .select('amount, status, payment_type, created_at')
    .gte('created_at', thirtyDaysAgo.toISOString());

  return {
    totalRevenue: payments?.reduce((sum, p) => sum + (p.status === 'completed' ? Number(p.amount) : 0), 0) || 0,
    pendingPayments: payments?.filter(p => p.status === 'pending').length || 0,
    paymentMethods: payments?.reduce((acc, p) => {
      acc[p.payment_type] = (acc[p.payment_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {},
  };
}

export async function getCustomerTrends(supabase: SupabaseClient) {
  const { data: customers } = await supabase
    .from('customers')
    .select('created_at, status')
    .order('created_at', { ascending: false })
    .limit(100);

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  return {
    newCustomers30Days: customers?.filter(c => 
      new Date(c.created_at) >= thirtyDaysAgo
    ).length || 0,
    activeCustomers: customers?.filter(c => 
      c.status === 'active' || c.status === 'active_rental'
    ).length || 0,
  };
}

export async function getCustomerInfo(supabase: SupabaseClient, customerName: string) {
  const { data: customers } = await supabase
    .from('customers')
    .select(`
      *,
      fleet_vehicles!fleet_vehicles_customer_id_fkey (id)
    `)
    .ilike('full_name', `%${customerName}%`);

  return customers;
}