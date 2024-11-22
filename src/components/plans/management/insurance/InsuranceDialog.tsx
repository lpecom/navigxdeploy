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
import { Switch } from "@/components/ui/switch";
import type { InsuranceOptions } from "@/types/database";
import * as z from "zod";

const insuranceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.number().min(0, "Price must be greater than zero"),
  coverage_details: z.record(z.boolean()).default({}),
  is_active: z.boolean().default(true),
});

interface InsuranceDialogProps {
  insurance: InsuranceOptions | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const InsuranceDialog = ({ insurance, open, onOpenChange }: InsuranceDialogProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof insuranceSchema>>({
    resolver: zodResolver(insuranceSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      coverage_details: {},
      is_active: true,
    },
  });

  useEffect(() => {
    if (insurance) {
      form.reset({
        name: insurance.name,
        description: insurance.description || "",
        price: insurance.price,
        coverage_details: insurance.coverage_details,
        is_active: insurance.is_active,
      });
    }
  }, [insurance, form]);

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof insuranceSchema>) => {
      if (insurance) {
        const { error } = await supabase
          .from("insurance_options")
          .update(values)
          .eq("id", insurance.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("insurance_options")
          .insert([values]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["insurance-options"] });
      toast({
        title: "Success",
        description: `Insurance option ${insurance ? "updated" : "created"} successfully`,
      });
      onOpenChange(false);
      form.reset();
    },
  });

  const onSubmit = (values: z.infer<typeof insuranceSchema>) => {
    mutation.mutate(values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {insurance ? "Edit Insurance Option" : "New Insurance Option"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
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
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
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
                    <FormLabel className="text-base">Active</FormLabel>
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
              {insurance ? "Update" : "Create"} Insurance Option
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};