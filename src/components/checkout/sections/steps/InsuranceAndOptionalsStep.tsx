import { Card } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { OptionalsList } from "@/components/optionals/OptionalsList"
import { Button } from "@/components/ui/button"

interface InsuranceAndOptionalsStepProps {
  onNext: () => void;
}

export const InsuranceAndOptionalsStep = ({ onNext }: InsuranceAndOptionalsStepProps) => {
  const { data: insuranceOptions } = useQuery({
    queryKey: ['insurance-options'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('insurance_options')
        .select('*')
        .eq('is_active', true)
      
      if (error) throw error
      return data
    }
  })

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Escolha seu Seguro</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {insuranceOptions?.map((option) => (
            <Card key={option.id} className="p-4">
              <h4 className="font-medium">{option.name}</h4>
              <p className="text-sm text-gray-600">{option.description}</p>
              <p className="text-primary font-medium mt-2">
                R$ {option.price.toFixed(2)}
              </p>
            </Card>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Opcionais Disponíveis</h3>
        <OptionalsList />
      </Card>

      <div className="flex justify-end">
        <Button onClick={onNext} size="lg">
          Continuar
        </Button>
      </div>
    </div>
  )
}