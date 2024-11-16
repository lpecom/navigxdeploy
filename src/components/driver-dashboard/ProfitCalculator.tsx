import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ProfitCalculatorProps {
  driverId: string;
}

export const ProfitCalculator = ({ driverId }: ProfitCalculatorProps) => {
  const [hoursPerDay, setHoursPerDay] = useState("8");
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [estimatedProfit, setEstimatedProfit] = useState<number | null>(null);

  const { data: vehicles } = useQuery({
    queryKey: ['vehicles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });

  const calculateProfit = () => {
    const hours = parseFloat(hoursPerDay);
    if (isNaN(hours) || hours <= 0) return;

    // Base calculations (these could be adjusted based on real data)
    const averageRidePerHour = 2; // Average rides per hour
    const averageFarePerRide = 30; // Average fare per ride in BRL
    const fuelCostPerDay = 50; // Average fuel cost per day in BRL
    const maintenanceCostPerDay = 20; // Average maintenance cost per day in BRL

    const dailyRides = hours * averageRidePerHour;
    const dailyGrossIncome = dailyRides * averageFarePerRide;
    const dailyExpenses = fuelCostPerDay + maintenanceCostPerDay;
    const dailyNetIncome = dailyGrossIncome - dailyExpenses;
    const weeklyProfit = dailyNetIncome * 7;

    setEstimatedProfit(weeklyProfit);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-primary" />
          Calculadora de Lucros
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="vehicle">Veículo</Label>
            <Select
              value={selectedVehicle}
              onValueChange={setSelectedVehicle}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um veículo" />
              </SelectTrigger>
              <SelectContent>
                {vehicles?.map((vehicle) => (
                  <SelectItem key={vehicle.id} value={vehicle.id}>
                    {vehicle.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hours">Horas por dia</Label>
            <Input
              id="hours"
              type="number"
              min="1"
              max="24"
              value={hoursPerDay}
              onChange={(e) => setHoursPerDay(e.target.value)}
              placeholder="8"
            />
          </div>
        </div>

        <Button 
          onClick={calculateProfit}
          className="w-full"
          disabled={!selectedVehicle || !hoursPerDay}
        >
          Calcular Lucro Estimado
        </Button>

        {estimatedProfit !== null && (
          <div className="mt-6 p-4 bg-primary/5 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Estimativa Semanal</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>Lucro Estimado:</span>
                <span className="text-xl font-bold text-primary">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(estimatedProfit)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                *Esta é uma estimativa baseada em médias. Os resultados reais podem variar dependendo
                de diversos fatores como localização, demanda e condições do trânsito.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};