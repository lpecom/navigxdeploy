import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Clock, TrendingUp, Car, Users } from "lucide-react";
import Sidebar from "@/components/dashboard/Sidebar";

const Performance = () => {
  const metrics = [
    {
      title: "Tempo Médio de Resposta",
      value: "2.3 horas",
      target: "Meta: 3 horas",
      progress: 85,
      status: "success",
      icon: Clock,
    },
    {
      title: "Taxa de Conversão",
      value: "24.8%",
      target: "Meta: 20%",
      progress: 95,
      status: "success",
      icon: TrendingUp,
    },
    {
      title: "Ocupação da Frota",
      value: "78%",
      target: "Meta: 80%",
      progress: 78,
      status: "warning",
      icon: Car,
    },
    {
      title: "Satisfação do Cliente",
      value: "4.8/5.0",
      target: "Meta: 4.5",
      progress: 92,
      status: "success",
      icon: Users,
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-2xl font-semibold mb-6">Indicadores de Performance</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {metrics.map((metric) => (
            <Card key={metric.title} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium">
                  {metric.title}
                </CardTitle>
                <metric.icon className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-2xl font-bold">{metric.value}</span>
                  <Badge variant={metric.status === "success" ? "default" : "secondary"}>
                    {metric.target}
                  </Badge>
                </div>
                <Progress value={metric.progress} className="h-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Performance;