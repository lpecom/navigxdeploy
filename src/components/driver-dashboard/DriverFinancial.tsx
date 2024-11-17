import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WalletCard } from "./payment/WalletCard"
import { InvoicesList } from "./payment/InvoicesList"
import PaymentHistory from "./PaymentHistory"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface DriverFinancialProps {
  driverId: string;
}

export const DriverFinancial = ({ driverId }: DriverFinancialProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Financeiro</h1>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Cartão
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <WalletCard driverId={driverId} />
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Cartões Cadastrados</CardTitle>
          </CardHeader>
          <CardContent>
            <PaymentHistory driverId={driverId} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Faturas</CardTitle>
        </CardHeader>
        <CardContent>
          <InvoicesList driverId={driverId} />
        </CardContent>
      </Card>
    </div>
  )
}