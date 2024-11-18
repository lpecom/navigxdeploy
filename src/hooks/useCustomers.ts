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
          status,
          car_model:car_models(name)
        `)
        .eq('status', 'rented');
      
      if (error) throw error;
      return data || [];
    },
  });

  // Get array of customer IDs with active rentals and their vehicle info
  const customerVehicleMap = new Map(
    fleetVehicles?.map(vehicle => [
      vehicle.customer_id,
      {
        vehicleId: vehicle.id,
        plate: vehicle.plate,
        model: vehicle.car_model?.name
      }
    ]) || []
  );

  // Then fetch all customers and update their status based on fleet data
  const { data: customers, isLoading } = useQuery({
    queryKey: ['customers', customerVehicleMap, searchTerm, statusFilter],
    queryFn: async () => {
      // First, get all customers
      const { data: allCustomers, error: customersError } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (customersError) throw customersError;

      // Update customer statuses based on fleet data
      const updatedCustomers = await Promise.all((allCustomers || []).map(async (customer) => {
        const hasActiveRental = customerVehicleMap.has(customer.id);
        const newStatus = hasActiveRental ? 'active_rental' : (customer.status || 'active');

        // If status needs to be updated in the database
        if (customer.status !== newStatus) {
          const { error: updateError } = await supabase
            .from('customers')
            .update({ 
              status: newStatus,
              last_rental_date: hasActiveRental ? new Date().toISOString() : customer.last_rental_date
            })
            .eq('id', customer.id);

          if (updateError) {
            console.error('Error updating customer status:', updateError);
          }
        }

        return {
          ...customer,
          status: newStatus,
          rented_vehicle: customerVehicleMap.get(customer.id)
        };
      }));

      return updatedCustomers;
    },
    refetchInterval: 30000, // Refetch every 30 seconds to keep statuses in sync
  });

  // Filter customers based on search and status
  const filteredCustomers = customers?.filter(customer => {
    const matchesSearch = !searchTerm || 
      customer.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.cpf?.includes(searchTerm) ||
      customer.rented_vehicle?.plate?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.rented_vehicle?.model?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(customer.status);

    return matchesSearch && matchesStatus;
  });

  // Calculate counts
  const counts = {
    activeRental: customers?.filter(c => c.status === 'active_rental').length || 0,
    active: customers?.filter(c => c.status === 'active').length || 0,
    inactive: customers?.filter(c => c.status === 'inactive').length || 0
  };

  return {
    customers: filteredCustomers,
    isLoading,
    counts,
    fleetVehicles
  };
};