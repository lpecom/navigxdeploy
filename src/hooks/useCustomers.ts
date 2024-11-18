import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useCustomers = (searchTerm: string, statusFilter: string[]) => {
  // First fetch fleet vehicles to get customers with active rentals
  const { data: fleetVehicles } = useQuery({
    queryKey: ['fleet-vehicles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fleet_vehicles')
        .select(`
          id,
          plate,
          customer_id,
          customers!inner (
            id,
            full_name,
            email,
            cpf
          )
        `)
        .eq('status', 'RENTED')
        .not('customer_id', 'is', null);
      
      if (error) throw error;
      console.log('Fleet vehicles with customers:', data);
      return data;
    },
  });

  // Get array of customer IDs with active rentals
  const activeRentalCustomerIds = fleetVehicles
    ?.filter(v => v.customer_id && v.customers)
    .map(v => v.customer_id) || [];

  // Fetch all customers and update their status based on fleet data
  const { data: customers, isLoading } = useQuery({
    queryKey: ['customers', activeRentalCustomerIds],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;

      return data?.map(customer => ({
        ...customer,
        status: activeRentalCustomerIds.includes(customer.id) 
          ? 'active_rental' 
          : (customer.status || 'active')
      }));
    },
  });

  // Filter customers based on search term and status
  const filteredCustomers = customers?.filter(customer => {
    const matchesSearch = 
      customer.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.cpf?.includes(searchTerm);

    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(customer.status || 'active');
    const isValidCustomer = !customer.email?.includes('@placeholder.com');

    return matchesSearch && matchesStatus && isValidCustomer;
  });

  // Get customer counts by status
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