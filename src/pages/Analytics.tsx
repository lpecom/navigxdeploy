import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, TrendingUp, Users, DollarSign } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

const Analytics = () => {
  const data = [
    { name: "Jan", value: 400 },
    { name: "Fev", value: 300 },
    { name: "Mar", value: 600 },
    { name: "Abr", value: 800 },
    { name: "Mai", value: 500 },
  ];

  const stats = [
    {
      title: "Total de Reservas",
      value: "1,234",
      icon: FileText,
      description: "+20.1% em relação ao mês anterior",
    },
    {
      title: "Novos Clientes",
      value: "342",
      icon: Users,
      description: "+12.5% em relação ao mês anterior",
    },
    {
      title: "Taxa de Conversão",
      value: "24.3%",
      icon: TrendingUp,
      description: "+4.3% em relação ao mês anterior",
    },
    {
      title: "Receita Mensal",
      value: "R$ 123.456",
      icon: DollarSign,
      description: "+15.2% em relação ao mês anterior",
    },
  ];

  return (
    <DashboardLayout 
      title="Análise de Desempenho"
      subtitle="Acompanhe os principais indicadores do seu negócio"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tendência de Reservas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Analytics;