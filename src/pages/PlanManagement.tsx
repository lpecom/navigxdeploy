import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PlanList } from "@/components/plans/management/PlanList";
import { InsuranceList } from "@/components/plans/management/InsuranceList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import Sidebar from "@/components/dashboard/Sidebar";

const PlanManagement = () => {
  const [activeTab, setActiveTab] = useState("plans");

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="container py-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Planos</h1>
            <p className="text-muted-foreground">
              Gerencie os planos e opções de seguro disponíveis
            </p>
          </div>

          <Card className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="plans">Planos</TabsTrigger>
                <TabsTrigger value="insurance">Seguros</TabsTrigger>
              </TabsList>
              <TabsContent value="plans">
                <PlanList />
              </TabsContent>
              <TabsContent value="insurance">
                <InsuranceList />
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PlanManagement;