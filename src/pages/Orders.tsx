import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/dashboard/Header";
import Sidebar from "@/components/dashboard/Sidebar";
import { OrderList } from "@/components/orders/OrderList";
import { OrderStats } from "@/components/orders/OrderStats";
import { OrderFilters } from "@/components/orders/OrderFilters";

const Orders = () => {
  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          customer:customers(full_name, email, phone),
          driver:driver_details(full_name, email, phone),
          vehicle:fleet_vehicles(
            plate,
            car_model:car_models(name, image_url)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <motion.main 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="p-6 lg:p-8"
        >
          <div className="max-w-[1600px] mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Orders
              </h1>
              <p className="text-muted-foreground">
                Manage and track all vehicle rental orders
              </p>
            </div>

            <OrderStats orders={orders || []} />
            <OrderFilters />
            <OrderList orders={orders || []} isLoading={isLoading} />
          </div>
        </motion.main>
      </div>
    </div>
  );
};

export default Orders;