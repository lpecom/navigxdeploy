import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Calendar } from "lucide-react"

export const CardExpiryField = ({ form }: { form: any }) => {
  return (
    <FormField
      control={form.control}
      name="expiry"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Validade
          </FormLabel>
          <FormControl>
            <Input
              placeholder="MM/YY"
              {...field}
              onChange={(e) => {
                const formatted = e.target.value
                  .replace(/\D/g, '')
                  .replace(/(\d{2})(\d)/, '$1/$2')
                  .slice(0, 5)
                field.onChange(formatted)
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}