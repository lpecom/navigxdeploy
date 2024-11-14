import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, MessageSquare, PhoneCall, Plus, Settings, Search, Clock, BarChart, Filter, Zap } from "lucide-react";
import Sidebar from "@/components/dashboard/Sidebar";
import { useState } from "react";

const AutomationCard = ({
  title,
  description,
  type,
  status,
  triggers,
  analytics,
}: {
  title: string;
  description: string;
  type: "Email" | "SMS" | "WhatsApp" | "Call";
  status: "Active" | "Inactive" | "Draft";
  triggers: string[];
  analytics: { sent: number; opened: number; converted: number };
}) => {
  const [isEnabled, setIsEnabled] = useState(status === "Active");

  return (
    <Card className="w-full animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-xl font-semibold">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <div className="flex items-center space-x-4">
          <Badge
            variant={status === "Active" ? "default" : status === "Draft" ? "secondary" : "outline"}
            className="font-normal"
          >
            {status}
          </Badge>
          <Switch checked={isEnabled} onCheckedChange={setIsEnabled} />
          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Triggers: {triggers.join(", ")}</span>
          </div>
          <div className="grid grid-cols-3 gap-4 pt-4">
            <div className="flex flex-col items-center space-y-2">
              <span className="text-2xl font-bold">{analytics.sent}</span>
              <span className="text-sm text-muted-foreground">Sent</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <span className="text-2xl font-bold">{analytics.opened}</span>
              <span className="text-sm text-muted-foreground">Opened</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <span className="text-2xl font-bold">{analytics.converted}</span>
              <span className="text-sm text-muted-foreground">Converted</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Automations = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const automationTemplates = [
    {
      title: "Welcome Series",
      description: "Send a series of welcome emails to new customers",
      type: "Email",
      status: "Active",
      triggers: ["New Sign Up", "Profile Complete"],
      analytics: { sent: 1234, opened: 856, converted: 234 },
    },
    {
      title: "Appointment Reminder",
      description: "Send SMS reminders before scheduled appointments",
      type: "SMS",
      status: "Active",
      triggers: ["24h Before", "1h Before"],
      analytics: { sent: 567, opened: 432, converted: 198 },
    },
    {
      title: "Follow-up Campaign",
      description: "Automated WhatsApp follow-up after service completion",
      type: "WhatsApp",
      status: "Draft",
      triggers: ["Service Complete", "7 Days After"],
      analytics: { sent: 789, opened: 654, converted: 123 },
    },
    {
      title: "Customer Feedback",
      description: "Automated calls to collect customer feedback",
      type: "Call",
      status: "Inactive",
      triggers: ["Service Complete", "No Response"],
      analytics: { sent: 345, opened: 234, converted: 89 },
    },
  ];

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
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
              <Button>
                <Zap className="mr-2 h-4 w-4" />
                Templates
              </Button>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nova Automação
              </Button>
            </div>
          </div>

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
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="active">Ativos</SelectItem>
                  <SelectItem value="inactive">Inativos</SelectItem>
                  <SelectItem value="draft">Rascunhos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline">
                <BarChart className="mr-2 h-4 w-4" />
                Analytics
              </Button>
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
        </div>
      </div>
    </div>
  );
};

export default Automations;