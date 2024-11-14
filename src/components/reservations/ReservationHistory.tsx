import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar } from "lucide-react";

const ReservationHistory = () => {
  const historyItems = [
    {
      id: 1,
      customer: "Maria Santos",
      vehicle: "Honda Civic 2023",
      period: "15/01/2024 - 20/01/2024",
      status: "Concluído",
      totalValue: "R$ 1.500,00"
    },
    {
      id: 2,
      customer: "Carlos Oliveira",
      vehicle: "Jeep Compass 2023",
      period: "05/01/2024 - 10/01/2024",
      status: "Cancelado",
      totalValue: "R$ 2.000,00"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Reservas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {historyItems.map(item => (
            <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg animate-fade-in">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <div>
                  <h3 className="font-medium">{item.customer}</h3>
                  <p className="text-sm text-gray-500">{item.vehicle}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                    <Calendar className="w-4 h-4" />
                    {item.period}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge variant={item.status === "Concluído" ? "default" : "secondary"}>
                  {item.status}
                </Badge>
                <span className="text-sm font-medium">{item.totalValue}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReservationHistory;