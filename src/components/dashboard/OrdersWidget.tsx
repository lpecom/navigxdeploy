import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Phone, AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { DashboardCheckoutSession, SelectedCarData } from "@/types/dashboard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

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
      <Alert variant="destructive" className="mt-2">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Failed to load orders. Please try again later.</AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="border-0 shadow-none overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-6 space-y-0 px-6">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold tracking-tight">Recent Orders</h3>
          <Badge variant="secondary" className="rounded-full px-2.5">
            {isLoading ? '...' : orders?.length || 0}
          </Badge>
        </div>
        <Button 
          variant="ghost" 
          size="sm"
          className="text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          View all <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </CardHeader>
      <CardContent className="px-6">
        <div className="space-y-1">
          {isLoading ? (
            <div className="animate-pulse space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-gray-50/50">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/3" />
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
                    className="group flex items-center gap-4 p-4 -mx-2 rounded-lg hover:bg-gray-50/80 transition-all duration-200"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="font-medium text-gray-900">#{order.reservation_number}</span>
                          <span className="text-sm text-muted-foreground">·</span>
                          <span className="text-sm text-muted-foreground truncate">
                            {selectedCar?.name || 'Vehicle not selected'}
                          </span>
                        </div>
                        <Badge 
                          variant={order.status === 'pending' ? 'secondary' : 'default'}
                          className={cn(
                            "font-medium transition-colors",
                            order.status === 'pending' ? 'bg-gray-100 text-gray-900' : '',
                            order.status === 'active' ? 'bg-green-100 text-green-900' : '',
                            order.status === 'cancelled' ? 'bg-red-100 text-red-900' : ''
                          )}
                        >
                          {order.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span className="truncate">{order.driver?.full_name}</span>
                        </div>
                        {order.driver?.phone && (
                          <div className="flex items-center gap-1.5 text-sm text-muted-foreground group-hover:text-gray-900 transition-colors">
                            <Phone className="w-3 h-3" />
                            <span>{order.driver.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {(!orders || orders.length === 0) && (
                <div className="py-12 text-center">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">No orders found</p>
                  <p className="text-sm text-muted-foreground mt-1">New orders will appear here</p>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrdersWidget;