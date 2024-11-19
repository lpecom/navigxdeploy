import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

interface MonthlyActivityChartProps {
  data: Array<{
    name: string;
    rentals: number;
    maintenance: number;
  }>;
}

export const MonthlyActivityChart = ({ data }: MonthlyActivityChartProps) => {
  return (
    <Card className="bg-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium text-gray-900">
          Atividade Mensal
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip />
            <Legend />
            <Bar 
              dataKey="rentals" 
              name="Aluguéis" 
              fill="#000000" 
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
            <Bar 
              dataKey="maintenance" 
              name="Manutenções" 
              fill="#666666"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};