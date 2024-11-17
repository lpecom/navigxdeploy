import { Card } from "@/components/ui/card"
import { ExternalLink } from "lucide-react"

interface CustomerDetailsProps {
  customer: {
    full_name: string
    email: string
    cpf: string
    phone: string
    address?: string
  }
}

export const CustomerDetails = ({ customer }: CustomerDetailsProps) => {
  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Informações do Cliente</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Nome Completo</p>
              <p className="font-medium">{customer.full_name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">CPF</p>
              <p className="font-medium">{customer.cpf}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{customer.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Telefone</p>
              <p className="font-medium">{customer.phone}</p>
            </div>
          </div>
        </div>

        {customer.address && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Localização</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Visualização do Local</p>
                <a 
                  href={`https://www.google.com/maps?q=${encodeURIComponent(customer.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  Abrir no Maps
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="aspect-video rounded-lg overflow-hidden">
                <img 
                  src={`https://maps.googleapis.com/maps/api/streetview?size=800x400&location=${encodeURIComponent(customer.address)}&key=AIzaSyDjnhLdrsCZlcSjJemKCmjYqfqk11_nwM8`}
                  alt={`Visualização da rua ${customer.address}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}