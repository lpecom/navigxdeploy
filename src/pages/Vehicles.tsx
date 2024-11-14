import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Car } from "lucide-react";
import Sidebar from "@/components/dashboard/Sidebar";
import VehicleList from "@/components/vehicles/VehicleList";

const Vehicles = () => {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto px-6 py-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-medium text-gray-900">Vehicles</h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Manage your vehicle fleet and availability
                </p>
              </div>
              <Badge 
                variant="secondary" 
                className="px-3 py-1.5 text-sm font-medium bg-secondary/10 text-secondary"
              >
                Fleet Status
              </Badge>
            </div>

            <Card className="shadow-sm border-muted">
              <CardHeader className="border-b border-muted/20 py-4">
                <CardTitle className="flex items-center gap-2 text-base font-medium">
                  <Car className="w-5 h-5 text-primary" />
                  Vehicle Fleet
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 px-4">
                <VehicleList />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Vehicles;