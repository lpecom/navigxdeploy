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
import { Card, CardContent } from "@/components/ui/card";

const formSchema = z.object({
  category: z.string().min(1, { message: "Por favor, selecione uma categoria" }),
  vehicle: z.string().min(1, { message: "Por favor, selecione um veículo" }),
  name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  phone: z.string().min(10, { message: "Telefone deve ter pelo menos 10 dígitos" }),
});

const categories = [
  { value: "usadinho", label: "USADINHO", image: "https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=500&q=80" },
  { value: "usadinho-comfort", label: "USADINHO Comfort", image: "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=500&q=80" },
  { value: "hatch-plus", label: "Hatch Plus", image: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=500&q=80" },
  { value: "sedan-premium", label: "Sedan Premium", image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=500&q=80" },
  { value: "suv-black", label: "Suv Black", image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500&q=80" },
  { value: "furgao-entregas", label: "Furgão Entregas", image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=500&q=80" },
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card key={category.value} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <img src={category.image} alt={category.label} className="w-full h-48 object-cover" />
              <CardContent className="p-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Button
                          variant={field.value === category.value ? "default" : "outline"}
                          className="w-full"
                          onClick={() => field.onChange(category.value)}
                        >
                          {category.label}
                        </Button>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          ))}
        </div>

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