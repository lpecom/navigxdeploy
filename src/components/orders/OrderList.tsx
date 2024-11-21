import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Car, Calendar, DollarSign, User } from "lucide-react";

interface OrderListProps {
  orders: any[];
  isLoading: boolean;
}

export const OrderList = ({ orders, isLoading }: OrderListProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4" />
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-4 bg-gray-200 rounded w-1/3" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order, index) => (
        <motion.div
          key={order.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-start gap-4">
                {order.vehicle?.car_model?.image_url ? (
                  <img
                    src={order.vehicle.car_model.image_url}
                    alt={order.vehicle.car_model.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Car className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg">
                      Order #{order.order_number}
                    </h3>
                    <Badge 
                      variant={order.status === 'completed' ? 'default' : 'secondary'}
                      className="capitalize"
                    >
                      {order.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Car className="w-4 h-4" />
                      <span>
                        {order.vehicle?.car_model?.name || 'Vehicle not specified'} ({order.vehicle?.plate})
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{order.customer?.full_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {order.pickup_date ? format(new Date(order.pickup_date), 'PP') : 'Date not set'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <div className="text-2xl font-bold text-primary">
                  R$ {order.total_amount.toFixed(2)}
                </div>
                <Badge 
                  variant={order.payment_status === 'paid' ? 'success' : 'secondary'}
                  className="capitalize"
                >
                  {order.payment_status}
                </Badge>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};