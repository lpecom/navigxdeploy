import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ArrowRight, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface GroupUpgradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentGroup: any;
  availableGroups: any[];
  sessionId: string;
}

export const GroupUpgradeDialog = ({
  open,
  onOpenChange,
  currentGroup,
  availableGroups,
  sessionId
}: GroupUpgradeDialogProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const queryClient = useQueryClient();

  const handleUpgrade = async (newGroup: any) => {
    try {
      setIsUpdating(true);

      const { error } = await supabase
        .from('checkout_sessions')
        .update({
          selected_car: {
            ...currentGroup,
            group_id: newGroup.id,
            category: newGroup.name
          }
        })
        .eq('id', sessionId);

      if (error) throw error;

      await queryClient.invalidateQueries({
        queryKey: ['checkout-session', sessionId]
      });

      toast.success('Grupo atualizado com sucesso');
      onOpenChange(false);
    } catch (error) {
      console.error('Error upgrading group:', error);
      toast.error('Erro ao atualizar grupo');
    } finally {
      setIsUpdating(false);
    }
  };

  const higherGroups = availableGroups.filter(
    group => (group.display_order || 0) > (currentGroup?.display_order || 0)
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Upgrades Disponíveis</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {higherGroups.map((group) => (
            <Card key={group.id} className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">{group.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {group.description}
                    </p>
                  </div>

                  {group.group_fares?.map((fare: any) => (
                    <div key={fare.id} className="space-y-2">
                      <Badge variant="secondary">{fare.plan_type}</Badge>
                      <div className="text-sm space-y-1">
                        <p>R$ {fare.base_price} /{fare.price_period}</p>
                        <p>{fare.km_included}km incluídos</p>
                        <p>R$ {fare.extra_km_price}/km extra</p>
                      </div>
                    </div>
                  ))}

                  <Button
                    onClick={() => handleUpgrade(group)}
                    disabled={isUpdating}
                    className="w-full"
                    variant="outline"
                  >
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Fazer Upgrade
                  </Button>
                </div>

                {group.id === currentGroup?.id && (
                  <div className="absolute top-2 right-2">
                    <Badge variant="default">
                      <Check className="w-4 h-4 mr-1" />
                      Atual
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};