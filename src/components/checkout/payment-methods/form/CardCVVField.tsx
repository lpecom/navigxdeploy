import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Shield } from "lucide-react"

export const CardCVVField = ({ form }: { form: any }) => {
  return (
    <FormField
      control={form.control}
      name="cvv"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            CVV
          </FormLabel>
          <FormControl>
            <Input
              type="password"
              placeholder="123"
              {...field}
              maxLength={3}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}