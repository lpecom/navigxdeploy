import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";

interface SupportTicketsProps {
  driverId: string;
}

const SupportTickets = ({ driverId }: SupportTicketsProps) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  const { data: tickets, refetch } = useQuery({
    queryKey: ['support-tickets', driverId],
    queryFn: async () => {
      const { data } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('driver_id', driverId)
        .order('created_at', { ascending: false });
      
      return data;
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { error } = await supabase
      .from('support_tickets')
      .insert([
        {
          driver_id: driverId,
          title,
          description,
          category,
        }
      ]);

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível criar o ticket.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Sucesso",
      description: "Ticket criado com sucesso!",
    });

    setIsOpen(false);
    setTitle("");
    setDescription("");
    setCategory("");
    refetch();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>Novo Ticket</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Novo Ticket</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="title">Título</label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="category">Categoria</label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical">Problema Técnico</SelectItem>
                    <SelectItem value="billing">Faturamento</SelectItem>
                    <SelectItem value="general">Dúvida Geral</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="description">Descrição</label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Criar Ticket
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Meus Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tickets?.map((ticket) => (
              <div
                key={ticket.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <p className="font-medium">{ticket.title}</p>
                  <p className="text-sm text-gray-500">
                    {format(new Date(ticket.created_at), "PP", { locale: ptBR })}
                  </p>
                  <p className="text-sm text-gray-500">
                    {ticket.category === 'technical' ? 'Problema Técnico' :
                     ticket.category === 'billing' ? 'Faturamento' : 'Dúvida Geral'}
                  </p>
                </div>
                <Badge variant={ticket.status === 'open' ? 'default' : 'secondary'}>
                  {ticket.status === 'open' ? 'Aberto' : 'Resolvido'}
                </Badge>
              </div>
            ))}

            {(!tickets || tickets.length === 0) && (
              <p className="text-center text-gray-500">
                Nenhum ticket encontrado
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupportTickets;