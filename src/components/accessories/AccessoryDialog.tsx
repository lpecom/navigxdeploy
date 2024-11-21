import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import type { Accessory } from "@/pages/Accessories";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Minus } from "lucide-react";

interface AccessoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accessory: Accessory | null;
  onSuccess: () => void;
}

export const AccessoryDialog = ({ open, onOpenChange, accessory, onSuccess }: AccessoryDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [formData, setFormData] = useState<Accessory>({
    id: accessory?.id || '',
    name: accessory?.name || '',
    description: accessory?.description || '',
    price: accessory?.price || 0,
    price_period: accessory?.price_period || 'per_rental',
    created_at: accessory?.created_at || new Date().toISOString(),
    thumbnail_url: accessory?.thumbnail_url || null
  });

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (accessory) {
        // Update existing accessory
        const { error } = await supabase
          .from('accessories')
          .update({
            name: formData.name,
            description: formData.description,
            price: formData.price,
            price_period: formData.price_period,
            thumbnail_url: formData.thumbnail_url
          })
          .eq('id', accessory.id);

        if (error) throw error;
      } else {
        // Create new accessory
        const { error } = await supabase
          .from('accessories')
          .insert({
            name: formData.name,
            description: formData.description,
            price: formData.price,
            price_period: formData.price_period,
            thumbnail_url: formData.thumbnail_url
          });

        if (error) throw error;
      }

      toast({
        title: "Sucesso",
        description: `Opcional ${accessory ? 'atualizado' : 'adicionado'} com sucesso.`,
      });
      
      // Call onSuccess with quantity before closing the dialog
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving accessory:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o opcional.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{accessory ? 'Editar' : 'Novo'} Opcional</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name">Nome</label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description">Descrição</label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="price">Preço</label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="price_period">Período de Cobrança</label>
            <Select
              value={formData.price_period}
              onValueChange={(value) => setFormData({ ...formData, price_period: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="per_rental">Por Aluguel</SelectItem>
                <SelectItem value="per_day">Por Dia</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {!accessory && (
            <div className="space-y-2">
              <label>Quantidade</label>
              <div className="flex items-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-lg font-medium">{quantity}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};