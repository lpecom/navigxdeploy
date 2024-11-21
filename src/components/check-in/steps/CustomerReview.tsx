import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { User, CheckCircle, AlertCircle, Edit2 } from "lucide-react";

interface CustomerReviewProps {
  driverId: string;
  onNext: () => void;
}

export const CustomerReview = ({ driverId, onNext }: CustomerReviewProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>(null);

  const { data: customer, isLoading } = useQuery({
    queryKey: ['customer-details', driverId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('driver_details')
        .select('*')
        .eq('id', driverId)
        .single();
      
      if (error) throw error;
      
      setFormData(data);
      return data;
    },
  });

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('driver_details')
        .update(formData)
        .eq('id', driverId);

      if (error) throw error;

      toast.success('Dados do cliente atualizados com sucesso');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating customer:', error);
      toast.error('Erro ao atualizar dados do cliente');
    }
  };

  if (isLoading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  const hasCompletedKYC = customer?.crm_status === 'verified';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Revisão do Cliente</h2>
        <Badge variant={hasCompletedKYC ? "success" : "warning"}>
          {hasCompletedKYC ? (
            <CheckCircle className="w-4 h-4 mr-2" />
          ) : (
            <AlertCircle className="w-4 h-4 mr-2" />
          )}
          {hasCompletedKYC ? "KYC OK" : "KYC Pendente"}
        </Badge>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Informações Pessoais</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            <Edit2 className="w-4 h-4 mr-2" />
            {isEditing ? "Cancelar" : "Editar"}
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {isEditing ? (
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nome Completo</label>
                  <Input
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">CPF</label>
                  <Input
                    value={formData.cpf}
                    onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Telefone</label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>
              <Button onClick={handleSave}>Salvar Alterações</Button>
            </form>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Nome Completo</p>
                <p className="font-medium">{customer.full_name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">CPF</p>
                <p className="font-medium">{customer.cpf}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{customer.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Telefone</p>
                <p className="font-medium">{customer.phone}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={onNext} size="lg">
          Próximo Passo
        </Button>
      </div>
    </div>
  );
};