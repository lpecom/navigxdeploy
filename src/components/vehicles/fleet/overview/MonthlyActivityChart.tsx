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
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-secondary-900">Atividade Mensal</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="rentals" name="Aluguéis" fill="#8b5cf6" />
            <Bar dataKey="maintenance" name="Manutenções" fill="#22c55e" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};