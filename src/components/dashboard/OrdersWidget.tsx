import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Phone, AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { DashboardCheckoutSession, SelectedCarData } from "@/types/dashboard";
import { Alert, AlertDescription } from "@/components/ui/alert";

const OrdersWidget = () => {
  const { data: orders, isLoading, error } = useQuery({
    queryKey: ['recent-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('checkout_sessions')
        .select(`
          id,
          reservation_number,
          driver:driver_details(full_name, phone),
          created_at,
          status,
          selected_car
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data as DashboardCheckoutSession[];
    },
  });

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load orders. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="flex flex-row items-center justify-between pb-2 px-0">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Orders</h3>
          <Badge variant="secondary" className="rounded-full">
            {isLoading ? '...' : orders?.length || 0}
          </Badge>
        </div>
        <Button 
          variant="ghost" 
          className="text-sm text-muted-foreground hover:text-primary"
          aria-label="View all orders"
        >
          See all <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </CardHeader>
      <CardContent className="px-0">
        <div className="space-y-1">
          {isLoading ? (
            <div className="animate-pulse space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
                    <div className="h-3 bg-gray-200 rounded w-1/3 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {orders?.map((order) => {
                const selectedCar = order.selected_car as unknown as SelectedCarData;
                
                return (
                  <div
                    key={order.id}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors animate-fade-up"
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">#{order.reservation_number}</span>
                          <span className="text-sm text-muted-foreground">·</span>
                          <span className="text-sm text-muted-foreground">
                            {selectedCar?.name || 'Vehicle not selected'}
                          </span>
                        </div>
                        <Badge 
                          variant={order.status === 'pending' ? 'secondary' : 'default'}
                          className="font-medium"
                        >
                          {order.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{order.driver?.full_name}</span>
                        </div>
                        {order.driver?.phone && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Phone className="w-3 h-3" />
                            <span>{order.driver.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrdersWidget;