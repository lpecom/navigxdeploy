import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Filter, Zap, Mail, MessageSquare, PhoneCall } from "lucide-react";
import Sidebar from "@/components/dashboard/Sidebar";
import { useState } from "react";
import { AutomationCard } from "@/components/automations/AutomationCard";
import { AutomationTemplates } from "@/components/automations/AutomationTemplates";

const Automations = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showTemplates, setShowTemplates] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const automationTemplates = [
    {
      title: "Bem-vindo à nossa plataforma",
      description: "Envie um e-mail de boas-vindas assim que um usuário se inscrever.",
      type: "Email" as const,
      status: "Active" as const,
      triggers: ["Novo cadastro"],
      analytics: { sent: 0, opened: 0, converted: 0 },
    },
    {
      title: "Notificação de pedido",
      description: "Envia uma notificação para o cliente quando o pedido é enviado.",
      type: "SMS" as const,
      status: "Active" as const,
      triggers: ["Pedido enviado"],
      analytics: { sent: 0, opened: 0, converted: 0 },
    },
    {
      title: "Follow-up de feedback",
      description: "Solicitar feedback após a entrega do produto.",
      type: "WhatsApp" as const,
      status: "Draft" as const,
      triggers: ["Pedido entregue"],
      analytics: { sent: 0, opened: 0, converted: 0 },
    },
    {
      title: "Lembrete de renovação",
      description: "Envie um lembrete antes da renovação de um serviço.",
      type: "Call" as const,
      status: "Inactive" as const,
      triggers: ["Data de renovação"],
      analytics: { sent: 0, opened: 0, converted: 0 },
    },
  ];

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 overflow-auto">
        <div className="container py-6 space-y-6">
          <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:space-y-0">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Automações</h1>
              <p className="text-muted-foreground">
                Gerencie suas automações de comunicação com clientes
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button onClick={() => setShowTemplates(!showTemplates)}>
                <Zap className="mr-2 h-4 w-4" />
                {showTemplates ? "Voltar" : "Templates"}
              </Button>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nova Automação
              </Button>
            </div>
          </div>

          {showTemplates ? (
            <AutomationTemplates />
          ) : (
            <>
              <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar automações..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[180px]">
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Filtrar por status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os status</SelectItem>
                      <SelectItem value="active">Ativos</SelectItem>
                      <SelectItem value="inactive">Inativos</SelectItem>
                      <SelectItem value="draft">Rascunhos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
                  {automationTemplates
                    .filter((automation) => automation.type === "Email" || automation.type === "SMS")
                    .filter((automation) =>
                      filterStatus === "all" ? true : filterStatus === automation.status.toLowerCase()
                    )
                    .filter((automation) =>
                      automation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      automation.description.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((automation, index) => (
                      <AutomationCard key={index} {...automation} />
                    ))}
                </TabsContent>

                <TabsContent value="whatsapp" className="space-y-4">
                  {automationTemplates
                    .filter((automation) => automation.type === "WhatsApp")
                    .filter((automation) =>
                      filterStatus === "all" ? true : filterStatus === automation.status.toLowerCase()
                    )
                    .filter((automation) =>
                      automation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      automation.description.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((automation, index) => (
                      <AutomationCard key={index} {...automation} />
                    ))}
                </TabsContent>

                <TabsContent value="calls" className="space-y-4">
                  {automationTemplates
                    .filter((automation) => automation.type === "Call")
                    .filter((automation) =>
                      filterStatus === "all" ? true : filterStatus === automation.status.toLowerCase()
                    )
                    .filter((automation) =>
                      automation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      automation.description.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((automation, index) => (
                      <AutomationCard key={index} {...automation} />
                    ))}
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Automations;
