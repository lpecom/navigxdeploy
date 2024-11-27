import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { ChevronRight } from "lucide-react";
import { BasicInfoFields } from "./fields/BasicInfoFields";
import { ContactFields } from "./fields/ContactFields";
import { AddressFields } from "./fields/AddressFields";

interface PersonalInfoFieldsProps {
  form: UseFormReturn<any>;
}

export const PersonalInfoFields = ({ form }: PersonalInfoFieldsProps) => {
  return (
    <>
      <BasicInfoFields form={form} />
      <ContactFields form={form} />
      <AddressFields form={form} />

      <FormField
        control={form.control}
        name="is_over_25"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
                className="data-[state=checked]:bg-primary"
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel className="text-white">
                Tenho 25 anos ou mais
              </FormLabel>
            </div>
          </FormItem>
        )}
      />

      <div className="pt-4">
        <Button 
          type="submit"
          className="w-full md:w-auto bg-primary hover:bg-primary/90 text-white"
        >
          Continuar para agendamento
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </>
  );
};