import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartBar, DollarSign, Wrench, Car } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface VehicleProfitability {
  id: string;
  vehicle_id: string;
  fipe_price: number;
  last_fipe_update: string;
  total_maintenance_cost: number;
  total_revenue: number;
  total_days_rented: number;
  common_issues: any[];
  monthly_metrics: any[];
  vehicle?: {
    plate: string;
    car_model?: {
      name: string;
      year: string;
    };
  };
}

const VehicleProfitability = () => {
  const [selectedVehicle, setSelectedVehicle] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: profitabilityData, isLoading } = useQuery({
    queryKey: ['vehicle-profitability', selectedVehicle],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vehicle_profitability')
        .select(`
          *,
          vehicle:fleet_vehicles(
            plate,
            car_model:car_models(
              name,
              year
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as VehicleProfitability[];
    },
  });

  const filteredData = profitabilityData?.filter(item => 
    item.vehicle?.car_model?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.vehicle?.plate?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const metrics = [
    {
      title: "Valor FIPE Médio",
      value: "R$ " + (filteredData?.[0]?.fipe_price || 0).toLocaleString(),
      icon: DollarSign,
      description: "Última atualização: " + new Date(filteredData?.[0]?.last_fipe_update || "").toLocaleDateString(),
    },
    {
      title: "Custo de Manutenção",
      value: "R$ " + (filteredData?.[0]?.total_maintenance_cost || 0).toLocaleString(),
      icon: Wrench,
      description: "Total acumulado",
    },
    {
      title: "Receita Total",
      value: "R$ " + (filteredData?.[0]?.total_revenue || 0).toLocaleString(),
      icon: ChartBar,
      description: `${filteredData?.[0]?.total_days_rented || 0} dias alugados`,
    },
    {
      title: "ROI",
      value: ((filteredData?.[0]?.total_revenue || 0) / (filteredData?.[0]?.fipe_price || 1) * 100).toFixed(1) + "%",
      icon: Car,
      description: "Retorno sobre investimento",
    },
  ];

  const monthlyData = filteredData?.[0]?.monthly_metrics || [];

  return (
    <div className="space-y-6 p-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Lucratividade da Frota</h1>
        <div className="flex items-center gap-4">
          <Input
            placeholder="Buscar por modelo ou placa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
          <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrar por veículo" />
            </SelectTrigger>
            <SelectContent>
              {profitabilityData?.map((item) => (
                <SelectItem key={item.vehicle_id} value={item.vehicle_id}>
                  {item.vehicle?.car_model?.name} - {item.vehicle?.plate}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline">Exportar Relatório</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.title} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{metric.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Evolução da Receita</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#0ea5e9" 
                    fill="#0ea5e9" 
                    fillOpacity={0.1} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Problemas Comuns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredData?.[0]?.common_issues.map((issue: any, index: number) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                  <Wrench className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h4 className="font-medium">{issue.title}</h4>
                    <p className="text-sm text-muted-foreground">{issue.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Ocorrências: {issue.occurrences}
                    </p>
                  </div>
                </div>
              ))}
              {(!filteredData?.[0]?.common_issues || filteredData[0].common_issues.length === 0) && (
                <p className="text-center text-muted-foreground py-8">
                  Nenhum problema comum registrado
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VehicleProfitability;