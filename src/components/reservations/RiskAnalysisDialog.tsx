import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ShieldAlert, AlertCircle, Flag, Check, X } from "lucide-react";
import type { Reservation } from "@/types/reservation";

interface RiskAnalysisDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reservation: Reservation;
  onApprove: () => void;
  onReject: () => void;
}

export const RiskAnalysisDialog = ({
  open,
  onOpenChange,
  reservation,
  onApprove,
  onReject,
}: RiskAnalysisDialogProps) => {
  // Mock risk scores - in a real app, these would come from your backend
  const riskScores = {
    overall: 65,
    identity: 85,
    financial: 70,
    behavioral: 40,
  };

  const getRiskColor = (score: number) => {
    if (score >= 70) return "bg-emerald-500";
    if (score >= 40) return "bg-amber-500";
    return "bg-red-500";
  };

  const getRiskBadge = (score: number) => {
    if (score >= 70) return "bg-emerald-100 text-emerald-800";
    if (score >= 40) return "bg-amber-100 text-amber-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <ShieldAlert className="w-5 h-5 text-amber-500" />
            Análise de Risco
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Overall Risk Score */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Pontuação Geral de Risco</h3>
                <Badge className={getRiskBadge(riskScores.overall)}>
                  {riskScores.overall} pontos
                </Badge>
              </div>
              <Progress value={riskScores.overall} className={`h-3 ${getRiskColor(riskScores.overall)}`} />
            </CardContent>
          </Card>

          {/* Detailed Scores */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-blue-500" />
                  <h4 className="font-medium">Identidade</h4>
                </div>
                <Progress value={riskScores.identity} className={`h-2 ${getRiskColor(riskScores.identity)}`} />
                <p className="text-sm text-muted-foreground">{riskScores.identity}% verificado</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-purple-500" />
                  <h4 className="font-medium">Financeiro</h4>
                </div>
                <Progress value={riskScores.financial} className={`h-2 ${getRiskColor(riskScores.financial)}`} />
                <p className="text-sm text-muted-foreground">{riskScores.financial}% confiável</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-orange-500" />
                  <h4 className="font-medium">Comportamental</h4>
                </div>
                <Progress value={riskScores.behavioral} className={`h-2 ${getRiskColor(riskScores.behavioral)}`} />
                <p className="text-sm text-muted-foreground">{riskScores.behavioral}% positivo</p>
              </CardContent>
            </Card>
          </div>

          {/* Risk Flags */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Flag className="w-4 h-4 text-red-500" />
                Alertas Identificados
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2 text-amber-600">
                  <AlertCircle className="w-4 h-4" />
                  Primeira locação com a empresa
                </li>
                <li className="flex items-center gap-2 text-amber-600">
                  <AlertCircle className="w-4 h-4" />
                  Cartão de crédito emitido recentemente
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onReject}
              className="bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
            >
              <X className="w-4 h-4 mr-2" />
              Rejeitar
            </Button>
            <Button onClick={onApprove} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <Check className="w-4 h-4 mr-2" />
              Aprovar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};