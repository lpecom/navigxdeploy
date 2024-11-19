import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Car, Wrench, AlertTriangle, CheckCircle, TrendingUp, Calendar } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export const FleetOverview = () => {
  const { data: fleetStats } = useQuery({
    queryKey: ['fleet-stats'],
    queryFn: async () => {
      const { data: vehicles, error } = await supabase
        .from('fleet_vehicles')
        .select(`
          *,
          car_model:car_models(
            name,
            year
          )
        `);

      if (error) throw error;

      const stats = {
        total: vehicles?.length || 0,
        available: vehicles?.filter(v => v.status === 'available').length || 0,
        maintenance: vehicles?.filter(v => v.status?.includes('maintenance')).length || 0,
        rented: vehicles?.filter(v => v.status === 'rented').length || 0,
        inactive: vehicles?.filter(v => v.status === 'inactive').length || 0,
        maintenanceData: vehicles?.filter(v => v.next_revision_date)
          .map(v => ({
            plate: v.plate,
            date: new Date(v.next_revision_date).toLocaleDateString(),
          }))
          .slice(0, 5) || [],
        statusDistribution: [
          { name: 'Available', value: vehicles?.filter(v => v.status === 'available').length || 0 },
          { name: 'Maintenance', value: vehicles?.filter(v => v.status?.includes('maintenance')).length || 0 },
          { name: 'Rented', value: vehicles?.filter(v => v.status === 'rented').length || 0 },
          { name: 'Inactive', value: vehicles?.filter(v => v.status === 'inactive').length || 0 },
        ],
        monthlyStats: [
          { name: 'Jan', rentals: 4, maintenance: 2 },
          { name: 'Feb', rentals: 6, maintenance: 1 },
          { name: 'Mar', rentals: 8, maintenance: 3 },
          { name: 'Apr', rentals: 10, maintenance: 2 },
          { name: 'May', rentals: 7, maintenance: 4 },
          { name: 'Jun', rentals: 9, maintenance: 1 },
        ],
      };

      return stats;
    },
  });

  if (!fleetStats) {
    return null;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Fleet</CardTitle>
            <Car className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{fleetStats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">Vehicles registered</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/50 dark:to-green-800/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{fleetStats.available}</div>
            <p className="text-xs text-muted-foreground mt-1">Ready for rental</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/50 dark:to-yellow-800/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">In Maintenance</CardTitle>
            <Wrench className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{fleetStats.maintenance}</div>
            <p className="text-xs text-muted-foreground mt-1">Under service</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/50 dark:to-purple-800/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Rented</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{fleetStats.rented}</div>
            <p className="text-xs text-muted-foreground mt-1">Currently in use</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status Distribution Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Fleet Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={fleetStats.statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label
                >
                  {fleetStats.statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Activity</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fleetStats.monthlyStats}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="rentals" fill="#8884d8" name="Rentals" />
                <Bar dataKey="maintenance" fill="#82ca9d" name="Maintenance" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Maintenance */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Upcoming Maintenance</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {fleetStats.maintenanceData.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Wrench className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-medium">{item.plate}</p>
                    <p className="text-sm text-muted-foreground">Next service</p>
                  </div>
                </div>
                <div className="text-sm font-medium">{item.date}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};