import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { OfferTemplates, type TemplateType } from "./OfferTemplates";
import { BannerUpload } from "./BannerUpload";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface OfferFormProps {
  categoryId: string;
  onSuccess: () => void;
}

export const OfferForm = ({ categoryId, onSuccess }: OfferFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    price_period: "month",
    template_type: "default" as TemplateType,
    banner_image: "",
  });

  const addOfferMutation = useMutation({
    mutationFn: async (offerData: typeof formData & { category_id: string }) => {
      const { data, error } = await supabase
        .from("offers")
        .insert({
          ...offerData,
          price: parseFloat(offerData.price),
          category_id: categoryId,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offers", categoryId] });
      onSuccess();
      toast({
        title: "Success",
        description: "Offer added successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add offer",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addOfferMutation.mutate({ ...formData, category_id: categoryId });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Name</label>
          <Input
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            required
          />
        </div>
        
        <div>
          <label className="text-sm font-medium">Description</label>
          <Textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Price</label>
            <Input
              type="number"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium">Period</label>
            <Input
              value={formData.price_period}
              onChange={(e) =>
                setFormData({ ...formData, price_period: e.target.value })
              }
              required
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium block mb-2">Template</label>
          <OfferTemplates
            selectedTemplate={formData.template_type}
            onSelectTemplate={(template) =>
              setFormData({ ...formData, template_type: template })
            }
          />
        </div>

        <div>
          <label className="text-sm font-medium block mb-2">Banner Image</label>
          <BannerUpload
            currentBanner={formData.banner_image}
            onBannerChange={(url) =>
              setFormData({ ...formData, banner_image: url })
            }
          />
        </div>
      </div>

      <Button type="submit" className="w-full">
        Add Offer
      </Button>
    </form>
  );
};