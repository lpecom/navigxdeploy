import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

const formSchema = z.object({
  category: z.string().min(1, { message: "Por favor, selecione uma categoria" }),
  vehicle: z.string().min(1, { message: "Por favor, selecione um veículo" }),
  name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  phone: z.string().min(10, { message: "Telefone deve ter pelo menos 10 dígitos" }),
});

const categories = [
  { value: "usadinho", label: "USADINHO" },
  { value: "usadinho-comfort", label: "USADINHO Comfort" },
  { value: "hatch-plus", label: "Hatch Plus" },
  { value: "sedan-premium", label: "Sedan Premium" },
  { value: "suv-black", label: "Suv Black" },
  { value: "furgao-entregas", label: "Furgão Entregas" },
];

const vehiclesByCategory = {
  usadinho: ["Ford Ka 2021 1.0", "HB20 2021", "Onix Joy 2019", "Uno Atractive 2021"],
  "usadinho-comfort": ["Renault Logan 2021 Life 1.0", "Renault Sandero 2021 Life 1.0"],
  "hatch-plus": ["Novo Onix", "Novo HB20", "Novo 208"],
  "sedan-premium": ["Toyota Yaris sedan automático 1.5"],
  "suv-black": ["Hyundai Creta action 1.6 automático"],
  "furgao-entregas": ["Fiorino 1.4 2025"],
};

export function RentalForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: "",
      vehicle: "",
      name: "",
      email: "",
      phone: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    toast({
      title: "Solicitação de aluguel enviada!",
      description: `Categoria: ${values.category}, Veículo: ${values.vehicle}`,
    });
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoria</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="vehicle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Veículo</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um veículo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {vehiclesByCategory[form.watch("category") as keyof typeof vehiclesByCategory]?.map((vehicle) => (
                    <SelectItem key={vehicle} value={vehicle}>
                      {vehicle}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Seu nome completo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="seu@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone</FormLabel>
              <FormControl>
                <Input placeholder="(11) 98765-4321" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full bg-navig hover:bg-navig/90">Solicitar Aluguel</Button>
      </form>
    </Form>
  );
}