import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

interface StatusDistributionChartProps {
  data: Array<{ name: string; value: number }>;
}

// Using a monochromatic color scheme based on black
const COLORS = [
  '#000000', // Pure black
  '#1a1a1a', // Very dark gray
  '#333333', // Dark gray
  '#4d4d4d', // Medium dark gray
  '#666666', // Medium gray
  '#808080', // Gray
  '#999999'  // Light gray
];

export const StatusDistributionChart = ({ data }: StatusDistributionChartProps) => {
  return (
    <Card className="bg-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium text-gray-900">
          Distribuição de Status da Frota
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data.filter(item => item.value > 0)}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={3}
              dataKey="value"
              label={({ name, value }) => `${name}: ${value}`}
              strokeWidth={1}
              stroke="#fff"
            >
              {data.map((_, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]}
                  className="hover:opacity-80 transition-opacity"
                />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value) => (
                <span className="text-sm text-gray-600">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};