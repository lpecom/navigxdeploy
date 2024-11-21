import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Car, CreditCard, Package } from "lucide-react";

interface OrderReviewProps {
  sessionId: string;
  onNext: () => void;
}

export const OrderReview = ({ sessionId, onNext }: OrderReviewProps) => {
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [isChanging, setIsChanging] = useState(false);

  const { data: session } = useQuery({
    queryKey: ['checkout-session', sessionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('checkout_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();
      
      if (error) throw error;
      setSelectedGroup(data.selected_car.category);
      return data;
    },
  });

  const { data: groups } = useQuery({
    queryKey: ['car-groups'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('car_groups')
        .select('*')
        .eq('is_active', true)
        .order('display_order');
      
      if (error) throw error;
      return data;
    },
  });

  const handleGroupChange = async (newGroup: string) => {
    try {
      setIsChanging(true);
      // Here we would calculate price differences and update the session
      const { error } = await supabase
        .from('checkout_sessions')
        .update({
          selected_car: { ...session?.selected_car, category: newGroup }
        })
        .eq('id', sessionId);

      if (error) throw error;

      toast.success('Grupo alterado com sucesso');
      setSelectedGroup(newGroup);
    } catch (error) {
      console.error('Error changing group:', error);
      toast.error('Erro ao alterar grupo');
    } finally {
      setIsChanging(false);
    }
  };

  if (!session) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Revisão do Pedido</h2>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="w-5 h-5" />
              Grupo do Veículo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              value={selectedGroup}
              onValueChange={handleGroupChange}
              disabled={isChanging}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o grupo" />
              </SelectTrigger>
              <SelectContent>
                {groups?.map((group) => (
                  <SelectItem key={group.id} value={group.name}>
                    {group.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Status do Pagamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="success">Aprovado</Badge>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Opcionais Solicitados
            </CardTitle>
          </CardHeader>
          <CardContent>
            {session.selected_optionals?.length > 0 ? (
              <div className="space-y-4">
                {session.selected_optionals.map((optional: any, index: number) => (
                  <div key={index} className="flex justify-between items-center">
                    <span>{optional.name}</span>
                    <Badge variant="secondary">
                      R$ {optional.price.toFixed(2)}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Nenhum opcional selecionado</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={onNext} size="lg">
          Próximo Passo
        </Button>
      </div>
    </div>
  );
};