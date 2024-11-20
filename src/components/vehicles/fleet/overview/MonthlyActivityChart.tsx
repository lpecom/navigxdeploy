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
            <XAxis 
              dataKey="name" 
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
            />
            <YAxis 
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            />
            <Legend 
              verticalAlign="top" 
              height={36}
              formatter={(value) => (
                <span className="text-sm text-gray-600">{value}</span>
              )}
            />
            <Bar 
              dataKey="rentals" 
              name="Aluguéis" 
              fill="#000000" 
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
              className="hover:opacity-80 transition-opacity"
            />
            <Bar 
              dataKey="maintenance" 
              name="Manutenções" 
              fill="#666666"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
              className="hover:opacity-80 transition-opacity"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};