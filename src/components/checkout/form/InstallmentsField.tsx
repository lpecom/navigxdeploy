import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DollarSign } from "lucide-react"

interface InstallmentsFieldProps {
  form: any;
  amount: number;
}

export const InstallmentsField = ({ form, amount }: InstallmentsFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="installments"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Parcelas
          </FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o número de parcelas" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
                <SelectItem key={i} value={i.toString()}>
                  {i}x de R$ {(amount / i).toFixed(2)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}