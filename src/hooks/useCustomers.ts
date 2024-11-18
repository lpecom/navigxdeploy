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
        .eq('status', 'rented')
        .not('customer_id', 'is', null);
      
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
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;

      return data?.map(customer => ({
        ...customer,
        status: customerVehicleMap.has(customer.id) ? 'active_rental' : (customer.status || 'active'),
        rented_vehicle: customerVehicleMap.get(customer.id)
      }));
    },
  });

  // Filter customers based on search and status
  const filteredCustomers = customers?.filter(customer => {
    // Filter out placeholder emails unless explicitly searching for them
    const isPlaceholder = customer.email?.includes('@placeholder.com');
    if (isPlaceholder && !searchTerm) return false;

    const matchesSearch = !searchTerm || 
      customer.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.cpf?.includes(searchTerm) ||
      customer.rented_vehicle?.plate?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.rented_vehicle?.model?.toLowerCase().includes(searchTerm.toLowerCase());

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