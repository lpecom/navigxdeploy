import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { MapPin, Loader2 } from "lucide-react"

interface AddressSectionProps {
  form: any;
  isLoadingAddress: boolean;
  onPostalCodeChange: (postalCode: string) => void;
}

export const AddressSection = ({ form, isLoadingAddress, onPostalCodeChange }: AddressSectionProps) => {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Endereço</h3>
      </div>

      <div className="space-y-4">
        <FormField
          control={form.control}
          name="postal_code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CEP</FormLabel>
              <FormControl>
                <Input 
                  placeholder="00000-000"
                  {...field}
                  onChange={(e) => {
                    const formatted = e.target.value
                      .replace(/\D/g, '')
                      .replace(/(\d{5})(\d)/, '$1-$2')
                      .slice(0, 9)
                    field.onChange(formatted)
                    if (formatted.replace(/\D/g, '').length === 8) {
                      onPostalCodeChange(formatted.replace(/\D/g, ''))
                    }
                  }}
                />
              </FormControl>
              {isLoadingAddress && (
                <div className="flex items-center text-sm text-blue-600">
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Buscando endereço...
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Endereço</FormLabel>
              <FormControl>
                <Input placeholder="Rua, número, complemento" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cidade</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </Card>
  )
}