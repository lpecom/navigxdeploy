import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Car, Calendar, Tool, AlertTriangle, User } from "lucide-react";

interface FleetVehicleProfileProps {
  vehicleId: string;
}

export const FleetVehicleProfile = ({ vehicleId }: FleetVehicleProfileProps) => {
  const { data: vehicleDetails } = useQuery({
    queryKey: ['fleet-vehicle-details', vehicleId],
    queryFn: async () => {
      const { data: vehicle } = await supabase
        .from('fleet_vehicles')
        .select(`
          *,
          car_model:car_models(
            name,
            year,
            image_url
          ),
          customer:customers(
            id,
            full_name,
            email,
            phone
          )
        `)
        .eq('id', vehicleId)
        .single();

      return vehicle;
    },
  });

  const { data: maintenanceHistory } = useQuery({
    queryKey: ['vehicle-maintenance', vehicleId],
    queryFn: async () => {
      const { data } = await supabase
        .from('maintenance_records')
        .select('*')
        .eq('vehicle_id', vehicleId)
        .order('service_date', { ascending: false });
      
      return data || [];
    },
  });

  const getStatusBadge = (status: string | null) => {
    if (!status) return <Badge variant="secondary">N/A</Badge>;
    
    const statusLower = status.toLowerCase();
    if (statusLower.includes('available')) {
      return <Badge className="bg-green-100 text-green-800">Disponível</Badge>;
    }
    if (statusLower.includes('maintenance')) {
      return <Badge className="bg-yellow-100 text-yellow-800">Em Manutenção</Badge>;
    }
    if (statusLower.includes('rented')) {
      return <Badge className="bg-blue-100 text-blue-800">Alugado</Badge>;
    }
    return <Badge variant="secondary">{status}</Badge>;
  };

  if (!vehicleDetails) return null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">
                {vehicleDetails.car_model?.name}
              </CardTitle>
              <p className="text-muted-foreground">
                Placa: {vehicleDetails.plate}
              </p>
            </div>
            {getStatusBadge(vehicleDetails.status)}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Quilometragem</p>
              <p className="text-lg font-semibold">
                {vehicleDetails.current_km?.toLocaleString()} km
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Última Revisão</p>
              <p className="text-lg font-semibold">
                {format(new Date(vehicleDetails.last_revision_date), 'dd/MM/yyyy')}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Próxima Revisão</p>
              <p className="text-lg font-semibold">
                {format(new Date(vehicleDetails.next_revision_date), 'dd/MM/yyyy')}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ano</p>
              <p className="text-lg font-semibold">{vehicleDetails.year}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="info" className="space-y-4">
        <TabsList>
          <TabsTrigger value="info">
            <Car className="w-4 h-4 mr-2" />
            Informações
          </TabsTrigger>
          <TabsTrigger value="maintenance">
            <Tool className="w-4 h-4 mr-2" />
            Manutenções
          </TabsTrigger>
          <TabsTrigger value="history">
            <Calendar className="w-4 h-4 mr-2" />
            Histórico
          </TabsTrigger>
          <TabsTrigger value="incidents">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Ocorrências
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>Detalhes do Veículo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Chassi</p>
                  <p className="font-medium">{vehicleDetails.chassis_number || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Renavam</p>
                  <p className="font-medium">{vehicleDetails.renavam_number || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Cor</p>
                  <p className="font-medium">{vehicleDetails.color || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Estado</p>
                  <p className="font-medium">{vehicleDetails.state || 'N/A'}</p>
                </div>
              </div>

              {vehicleDetails.customer && (
                <div className="pt-4 border-t">
                  <h3 className="font-semibold flex items-center gap-2 mb-3">
                    <User className="w-4 h-4" />
                    Cliente Atual
                  </h3>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="text-muted-foreground">Nome:</span>{' '}
                      {vehicleDetails.customer.full_name}
                    </p>
                    <p className="text-sm">
                      <span className="text-muted-foreground">Email:</span>{' '}
                      {vehicleDetails.customer.email}
                    </p>
                    <p className="text-sm">
                      <span className="text-muted-foreground">Telefone:</span>{' '}
                      {vehicleDetails.customer.phone}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Manutenções</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {maintenanceHistory?.map((record) => (
                  <div
                    key={record.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium">{record.service_type}</p>
                      <p className="text-sm text-muted-foreground">
                        {record.description}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(record.service_date), "PP", { locale: ptBR })}
                      </p>
                    </div>
                    <Badge
                      variant={record.status === 'completed' ? 'default' : 'secondary'}
                    >
                      {record.status === 'completed' ? 'Concluído' : 'Agendado'}
                    </Badge>
                  </div>
                ))}
                {(!maintenanceHistory || maintenanceHistory.length === 0) && (
                  <p className="text-center text-muted-foreground py-4">
                    Nenhum registro de manutenção encontrado
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Aluguéis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-4">
                Histórico de aluguéis em desenvolvimento
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="incidents">
          <Card>
            <CardHeader>
              <CardTitle>Registro de Ocorrências</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-4">
                Registro de ocorrências em desenvolvimento
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};