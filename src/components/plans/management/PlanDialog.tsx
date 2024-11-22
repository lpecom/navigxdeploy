import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { Plan } from "@/types/plans";
import * as z from "zod";

const planSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
  type: z.enum(["flex", "monthly", "black"]),
  period: z.enum(["week", "month"]),
  base_price: z.number().min(0, "Preço deve ser maior que zero"),
  included_km: z.number().min(0, "KM incluídos deve ser maior que zero"),
  extra_km_price: z.number().min(0, "Preço por KM extra deve ser maior que zero").optional(),
  is_active: z.boolean().default(true),
});

interface PlanDialogProps {
  plan: Plan | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PlanDialog = ({ plan, open, onOpenChange }: PlanDialogProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof planSchema>>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      name: "",
      description: "",
      type: "flex",
      period: "week",
      base_price: 0,
      included_km: 0,
      extra_km_price: 0,
      is_active: true,
    },
  });

  useEffect(() => {
    if (plan) {
      form.reset({
        name: plan.name,
        description: plan.description || "",
        type: plan.type,
        period: plan.period,
        base_price: plan.base_price,
        included_km: plan.included_km,
        extra_km_price: plan.extra_km_price || 0,
        is_active: plan.is_active,
      });
    }
  }, [plan, form]);

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof planSchema>) => {
      if (plan) {
        const { error } = await supabase
          .from("plans")
          .update(values)
          .eq("id", plan.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("plans")
          .insert([values]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      toast({
        title: "Sucesso",
        description: `Plano ${plan ? "atualizado" : "criado"} com sucesso`,
      });
      onOpenChange(false);
      form.reset();
    },
  });

  const onSubmit = (values: z.infer<typeof planSchema>) => {
    mutation.mutate(values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {plan ? "Editar Plano" : "Novo Plano"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="flex">Flex</SelectItem>
                        <SelectItem value="monthly">Mensal</SelectItem>
                        <SelectItem value="black">Black</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="period"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Período</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o período" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="week">Semanal</SelectItem>
                        <SelectItem value="month">Mensal</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="base_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço Base</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={e => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="included_km"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>KM Incluídos</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={e => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="extra_km_price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preço por KM Extra</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={e => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Ativo</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              {plan ? "Atualizar" : "Criar"} Plano
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};