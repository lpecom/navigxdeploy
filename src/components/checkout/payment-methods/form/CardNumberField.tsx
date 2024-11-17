import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { CreditCard } from "lucide-react"

export const CardNumberField = ({ form }: { form: any }) => {
  return (
    <FormField
      control={form.control}
      name="card_number"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Número do Cartão
          </FormLabel>
          <FormControl>
            <Input
              placeholder="1234 5678 9012 3456"
              {...field}
              onChange={(e) => {
                const formatted = e.target.value
                  .replace(/\s/g, '')
                  .replace(/(\d{4})/g, '$1 ')
                  .trim()
                field.onChange(formatted)
              }}
              maxLength={19}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}