import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { User } from "lucide-react"

export const CardHolderField = ({ form }: { form: any }) => {
  return (
    <FormField
      control={form.control}
      name="holder_name"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Nome no Cartão
          </FormLabel>
          <FormControl>
            <Input placeholder="NOME COMO ESTÁ NO CARTÃO" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}