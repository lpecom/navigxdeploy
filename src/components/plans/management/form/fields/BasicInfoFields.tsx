import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { FileText } from "lucide-react";

export const BasicInfoFields = ({ form }: { form: any }) => {
  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Basic Information</h3>
      </div>

      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter plan name" {...field} />
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
              <Textarea 
                placeholder="Enter plan description"
                className="min-h-[100px] resize-none"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </Card>
  );
};