import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Wrench } from "lucide-react";

interface MaintenanceItem {
  plate: string;
  date: string;
  model: string;
  customer: string | null;
}

interface MaintenanceListProps {
  data: MaintenanceItem[];
}

export const MaintenanceList = ({ data }: MaintenanceListProps) => {
  return (
    <Card className="bg-white">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold text-secondary-900">Próximas Manutenções</CardTitle>
        <Calendar className="h-4 w-4 text-secondary-600" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between border-b border-secondary-100 pb-4 last:border-0 last:pb-0"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-yellow-50 rounded-lg">
                  <Wrench className="h-4 w-4 text-yellow-600" />
                </div>
                <div>
                  <p className="font-medium text-secondary-900">{item.plate}</p>
                  <p className="text-sm text-secondary-600">{item.model}</p>
                  {item.customer && (
                    <p className="text-xs text-secondary-500">Cliente: {item.customer}</p>
                  )}
                </div>
              </div>
              <div className="text-sm font-medium text-secondary-900">{item.date}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};