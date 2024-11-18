import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useCustomers = (searchTerm: string, statusFilter: string[]) => {
  // First fetch fleet vehicles to get customers with active rentals
  const { data: fleetVehicles } = useQuery({
    queryKey: ['fleet-vehicles'],
    queryFn: async () => {
      // First, let's check all fleet vehicles with customers
      const { data: allVehicles, error } = await supabase
        .from('fleet_vehicles')
        .select(`
          id,
          plate,
          customer_id,
          status,
          customers (
            id,
            full_name,
            email,
            cpf
          )
        `)
        .eq('status', 'rented');
      
      if (error) {
        console.error('Error fetching fleet vehicles:', error);
        throw error;
      }
      
      console.log('All fleet vehicles:', allVehicles);
      return allVehicles || [];
    },
  });

  // Get array of customer IDs with active rentals
  const activeRentalCustomerIds = fleetVehicles
    ?.filter(v => v.customer_id && v.customers)
    .map(v => v.customer_id) || [];

  console.log('Active rental customer IDs:', activeRentalCustomerIds);

  // Then fetch all customers and update their status based on fleet data
  const { data: customers, isLoading } = useQuery({
    queryKey: ['customers', activeRentalCustomerIds, searchTerm, statusFilter],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;

      const mappedCustomers = data?.map(customer => ({
        ...customer,
        status: activeRentalCustomerIds.includes(customer.id) 
          ? 'active_rental'
          : customer.status || 'active'
      }));

      console.log('Mapped customers:', mappedCustomers);
      return mappedCustomers;
    },
    enabled: true, // Always run this query
  });

  // Filter customers based on search and status
  const filteredCustomers = customers?.filter(customer => {
    // Filter out placeholder emails unless explicitly searching for them
    const isPlaceholder = customer.email?.includes('@placeholder.com');
    if (isPlaceholder && !searchTerm) return false;

    const matchesSearch = !searchTerm || 
      customer.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.cpf?.includes(searchTerm);

    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(customer.status);

    return matchesSearch && matchesStatus;
  });

  // Calculate counts excluding placeholder emails
  const validCustomers = customers?.filter(c => !c.email?.includes('@placeholder.com')) || [];
  const counts = {
    activeRental: validCustomers.filter(c => c.status === 'active_rental').length,
    active: validCustomers.filter(c => c.status === 'active').length,
    inactive: validCustomers.filter(c => c.status === 'inactive').length
  };

  return {
    customers: filteredCustomers,
    isLoading,
    counts,
    fleetVehicles
  };
};