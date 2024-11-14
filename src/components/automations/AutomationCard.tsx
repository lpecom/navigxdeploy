import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Settings, Clock } from "lucide-react";
import { AutomationType, AutomationStatus } from "./AutomationTemplates";

interface AutomationCardProps {
  title: string;
  description: string;
  type: AutomationType;
  status: AutomationStatus;
  triggers: string[];
  analytics: {
    sent: number;
    opened: number;
    converted: number;
  };
}

export const AutomationCard = ({
  title,
  description,
  type,
  status,
  triggers,
  analytics,
}: AutomationCardProps) => {
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
              <span className="text-sm text-muted-foreground">Enviados</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <span className="text-2xl font-bold">{analytics.opened}</span>
              <span className="text-sm text-muted-foreground">Abertos</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <span className="text-2xl font-bold">{analytics.converted}</span>
              <span className="text-sm text-muted-foreground">Convertidos</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};