import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ShoppingBag, TrendingUp, Clock, CheckCircle } from "lucide-react";

interface OrderStatsProps {
  orders: any[];
}

export const OrderStats = ({ orders }: OrderStatsProps) => {
  const stats = [
    {
      title: "Total Orders",
      value: orders.length,
      icon: ShoppingBag,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      title: "Active Rentals",
      value: orders.filter(o => o.status === 'active').length,
      icon: TrendingUp,
      color: "text-green-500",
      bgColor: "bg-green-50",
    },
    {
      title: "Pending",
      value: orders.filter(o => o.status === 'pending').length,
      icon: Clock,
      color: "text-yellow-500",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Completed",
      value: orders.filter(o => o.status === 'completed').length,
      icon: CheckCircle,
      color: "text-purple-500",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <h4 className="text-2xl font-bold">{stat.value}</h4>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};