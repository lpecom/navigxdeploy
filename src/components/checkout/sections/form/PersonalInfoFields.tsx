import { UseFormReturn } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronRight } from "lucide-react"

interface PersonalInfoFieldsProps {
  form: UseFormReturn<any>;
}

export const PersonalInfoFields = ({ form }: PersonalInfoFieldsProps) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="first_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white/60">Nome</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Digite seu nome" 
                  className="bg-white/5 border-white/10 text-white"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="last_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white/60">Sobrenome</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Digite seu sobrenome" 
                  className="bg-white/5 border-white/10 text-white"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white/60">Email</FormLabel>
            <FormControl>
              <Input 
                type="email" 
                placeholder="Digite seu email" 
                className="bg-white/5 border-white/10 text-white"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white/60">Telefone</FormLabel>
              <FormControl>
                <Input 
                  placeholder="(00) 00000-0000" 
                  className="bg-white/5 border-white/10 text-white"
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "")
                    field.onChange(value)
                  }}
                  value={field.value ? field.value.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3") : ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cpf"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white/60">CPF</FormLabel>
              <FormControl>
                <Input 
                  placeholder="000.000.000-00" 
                  className="bg-white/5 border-white/10 text-white"
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "")
                    field.onChange(value)
                  }}
                  value={field.value ? field.value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4") : ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* New Address Fields */}
      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white/60">Endereço</FormLabel>
            <FormControl>
              <Input 
                placeholder="Rua, número, complemento" 
                className="bg-white/5 border-white/10 text-white"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white/60">Cidade</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Cidade" 
                  className="bg-white/5 border-white/10 text-white"
                  {...field} 
                />
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
              <FormLabel className="text-white/60">Estado</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Estado" 
                  className="bg-white/5 border-white/10 text-white"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="postal_code"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white/60">CEP</FormLabel>
              <FormControl>
                <Input 
                  placeholder="00000-000" 
                  className="bg-white/5 border-white/10 text-white"
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "")
                    field.onChange(value)
                  }}
                  value={field.value ? field.value.replace(/(\d{5})(\d{3})/, "$1-$2") : ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

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
  )
}