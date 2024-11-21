import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { AccessoryDialog } from "@/components/accessories/AccessoryDialog";
import { AccessoryList } from "@/components/accessories/AccessoryList";
import { useToast } from "@/components/ui/use-toast";

export interface Accessory {
  id: string;
  name: string;
  description: string;
  price: number;
  price_period: string;
  created_at: string;
  thumbnail_url: string | null;
}

const Accessories = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAccessory, setEditingAccessory] = useState<Accessory | null>(null);
  const { toast } = useToast();

  const { data: accessories, refetch } = useQuery({
    queryKey: ['accessories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('accessories')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Accessory[];
    }
  });

  const handleEdit = (accessory: Accessory) => {
    setEditingAccessory(accessory);
    setIsDialogOpen(true);
  };

  const handleSuccess = () => {
    refetch();
    setIsDialogOpen(false);
    setEditingAccessory(null);
    toast({
      title: "Sucesso",
      description: "Opcional atualizado com sucesso.",
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gerenciar Opcionais</h1>
        <Button onClick={() => setIsDialogOpen(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Novo Opcional
        </Button>
      </div>

      <Card className="p-6">
        <AccessoryList 
          accessories={accessories || []} 
          onEdit={handleEdit}
          onRefetch={refetch}
        />
      </Card>

      <AccessoryDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        accessory={editingAccessory}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default Accessories;