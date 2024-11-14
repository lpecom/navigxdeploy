import { useQuery } from "@tanstack/react-query";
import { Car, AlertTriangle, Check, MapPin, Settings, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import Sidebar from "@/components/dashboard/Sidebar";

interface Vehicle {
  id: string;
  model: string;
  plate: string;
  status: "available" | "maintenance" | "rented";
  location: string;
  fuelLevel: number;
  nextMaintenance: string;
  insuranceStatus: "valid" | "expiring" | "expired";
  imageUrl: string;
}

const mockVehicles: Vehicle[] = [
  {
    id: "1",
    model: "Toyota Corolla 2023",
    plate: "ABC1234",
    status: "available",
    location: "São Paulo - SP",
    fuelLevel: 85,
    nextMaintenance: "2024-04-15",
    insuranceStatus: "valid",
    imageUrl: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800"
  },
  {
    id: "2",
    model: "Honda Civic 2023",
    plate: "XYZ5678",
    status: "maintenance",
    location: "Rio de Janeiro - RJ",
    fuelLevel: 30,
    nextMaintenance: "2024-02-28",
    insuranceStatus: "expiring",
    imageUrl: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800"
  },
  {
    id: "3",
    model: "Jeep Compass 2023",
    plate: "DEF9012",
    status: "rented",
    location: "Belo Horizonte - MG",
    fuelLevel: 60,
    nextMaintenance: "2024-05-20",
    insuranceStatus: "valid",
    imageUrl: "https://images.unsplash.com/photo-1533106418989-88406c7cc8ca?w=800"
  }
];

const fetchVehicles = async (): Promise<Vehicle[]> => {
  // Simulating API call
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockVehicles), 1000);
  });
};

const VehicleCard = ({ vehicle }: { vehicle: Vehicle }) => {
  const { toast } = useToast();

  const getStatusBadge = (status: Vehicle["status"]) => {
    const statusConfig = {
      available: { color: "bg-green-100 text-green-800", icon: Check },
      maintenance: { color: "bg-yellow-100 text-yellow-800", icon: Settings },
      rented: { color: "bg-blue-100 text-blue-800", icon: Car }
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} flex gap-1 items-center`}>
        <Icon className="w-3 h-3" />
        {status === "available" ? "Disponível" : 
         status === "maintenance" ? "Em Manutenção" : "Alugado"}
      </Badge>
    );
  };

  const handleMaintenanceClick = () => {
    toast({
      title: "Manutenção Agendada",
      description: `Agendamento realizado para ${vehicle.model}`,
    });
  };

  return (
    <Card className="w-full animate-fade-in hover:shadow-lg transition-shadow">
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold">{vehicle.model}</CardTitle>
            <p className="text-sm text-gray-500">Placa: {vehicle.plate}</p>
          </div>
          {getStatusBadge(vehicle.status)}
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-4">
        <img 
          src={vehicle.imageUrl} 
          alt={vehicle.model}
          className="w-full h-48 object-cover rounded-lg"
        />
        
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            {vehicle.location}
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Nível de Combustível</span>
              <span>{vehicle.fuelLevel}%</span>
            </div>
            <Progress value={vehicle.fuelLevel} className="h-2" />
          </div>

          <div className="flex items-center gap-2">
            <Shield className={`w-4 h-4 ${
              vehicle.insuranceStatus === "valid" ? "text-green-500" :
              vehicle.insuranceStatus === "expiring" ? "text-yellow-500" :
              "text-red-500"
            }`} />
            <span className="text-sm">
              {vehicle.insuranceStatus === "valid" ? "Seguro Válido" :
               vehicle.insuranceStatus === "expiring" ? "Seguro a Vencer" :
               "Seguro Vencido"}
            </span>
          </div>

          <div className="flex gap-2 mt-4">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={handleMaintenanceClick}
            >
              <Settings className="w-4 h-4 mr-2" />
              Agendar Manutenção
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Vehicles = () => {
  const { data: vehicles, isLoading, error } = useQuery({
    queryKey: ['vehicles'],
    queryFn: fetchVehicles,
  });

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-96 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            <span>Erro ao carregar veículos</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-2xl font-semibold mb-6">Gestão de Frota</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles?.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Vehicles;