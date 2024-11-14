import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Mail, MessageSquare, PhoneCall, Plus, Settings } from "lucide-react";
import Sidebar from "@/components/dashboard/Sidebar";

const Automations = () => {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="container py-6 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Automações</h1>
              <p className="text-muted-foreground">
                Gerencie suas automações de comunicação com clientes
              </p>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Automação
            </Button>
          </div>

          <Tabs defaultValue="email" className="space-y-4">
            <TabsList>
              <TabsTrigger value="email" className="space-x-2">
                <Mail className="h-4 w-4" />
                <span>Email e SMS</span>
              </TabsTrigger>
              <TabsTrigger value="whatsapp" className="space-x-2">
                <MessageSquare className="h-4 w-4" />
                <span>WhatsApp</span>
              </TabsTrigger>
              <TabsTrigger value="calls" className="space-x-2">
                <PhoneCall className="h-4 w-4" />
                <span>Ligações</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="email" className="space-y-4">
              <AutomationCard
                title="Confirmação de Reserva"
                description="Envia um email de confirmação quando uma nova reserva é criada"
                type="Email"
                status="Ativo"
              />
              <AutomationCard
                title="Lembrete de Devolução"
                description="Envia SMS 24h antes do prazo de devolução do veículo"
                type="SMS"
                status="Ativo"
              />
              <AutomationCard
                title="Pesquisa de Satisfação"
                description="Envia email 2 dias após a devolução do veículo"
                type="Email"
                status="Inativo"
              />
            </TabsContent>

            <TabsContent value="whatsapp" className="space-y-4">
              <AutomationCard
                title="Boas-vindas WhatsApp"
                description="Envia mensagem de boas-vindas quando cliente inicia conversa"
                type="WhatsApp"
                status="Ativo"
              />
              <AutomationCard
                title="Atendimento 24h"
                description="Resposta automática fora do horário comercial"
                type="WhatsApp"
                status="Ativo"
              />
            </TabsContent>

            <TabsContent value="calls" className="space-y-4">
              <AutomationCard
                title="Confirmação por Voz"
                description="Liga para confirmar reserva 2h antes do horário"
                type="Call"
                status="Inativo"
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

const AutomationCard = ({
  title,
  description,
  type,
  status,
}: {
  title: string;
  description: string;
  type: "Email" | "SMS" | "WhatsApp" | "Call";
  status: "Ativo" | "Inativo";
}) => {
  return (
    <Card className="animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
        <div className="flex items-center space-x-4">
          <Badge
            variant={type === "Email" ? "default" : type === "SMS" ? "secondary" : "outline"}
            className="font-normal"
          >
            {type}
          </Badge>
          <Switch checked={status === "Ativo"} />
          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  );
};

export default Automations;