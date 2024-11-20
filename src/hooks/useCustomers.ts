import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { subDays } from "date-fns";

export const useCustomers = (searchTerm: string, statusFilter: string[]) => {
  // First fetch all customers with their rental status
  const { data: customers, isLoading } = useQuery({
    queryKey: ['customers', searchTerm, statusFilter],
    queryFn: async () => {
      // Get all customers with their active rentals
      const { data: customersWithRentals, error: customersError } = await supabase
        .from('customers')
        .select(`
          *,
          fleet_vehicles!fleet_vehicles_customer_id_fkey (
            id,
            plate,
            status,
            car_model:car_models (
              name
            )
          )
        `)
        .order('created_at', { ascending: false });
      
      if (customersError) throw customersError;

      const ninetyDaysAgo = subDays(new Date(), 90);

      // Process customers to determine their current status
      return (customersWithRentals || []).map(customer => {
        const activeRental = customer.fleet_vehicles?.find(
          vehicle => vehicle.status === 'rented'
        );

        let status = customer.status;
        
        // Only update status if it's not blocked
        if (customer.status !== 'blocked') {
          if (activeRental) {
            status = 'active_rental';
          } else if (customer.last_rental_date && new Date(customer.last_rental_date) > ninetyDaysAgo) {
            status = 'active';
          } else {
            status = 'inactive';
          }
        }

        return {
          ...customer,
          status,
          rented_vehicle: activeRental ? {
            vehicleId: activeRental.id,
            plate: activeRental.plate,
            model: activeRental.car_model?.name
          } : null
        };
      });
    },
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

  // Calculate counts based on actual rental data
  const counts = {
    activeRental: customers?.filter(c => c.status === 'active_rental').length || 0,
    active: customers?.filter(c => c.status === 'active').length || 0,
    inactive: customers?.filter(c => c.status === 'inactive').length || 0,
    blocked: customers?.filter(c => c.status === 'blocked').length || 0
  };

  return {
    customers: filteredCustomers,
    isLoading,
    counts
  };
};