import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { History, FileText } from "lucide-react";

interface HistorySectionProps {
  history: string;
}

export const HistorySection = ({ history }: HistorySectionProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <History className="w-4 h-4 text-primary" />
          Histórico do Cliente
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {history}
        </p>
        <Separator className="my-4" />
        <div className="flex justify-end">
          <Button variant="outline" size="sm">
            <FileText className="w-4 h-4 mr-2" />
            Ver Histórico Completo
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};