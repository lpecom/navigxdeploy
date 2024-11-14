import { Card } from "@/components/ui/card";

export const OrderSummary = () => {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">Resumo do Pedido</h2>
      
      <div className="space-y-4">
        <div className="border-b pb-4">
          <h3 className="font-medium mb-2">Detalhes do Aluguel</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Retirada</span>
              <span>21-11-2024, 8:00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Devolução</span>
              <span>29-11-2024, 2:00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Duração</span>
              <span>8 dias</span>
            </div>
          </div>
        </div>

        <div className="border-b pb-4">
          <h3 className="font-medium mb-2">Localização</h3>
          <div className="text-sm space-y-1">
            <p>São Paulo, SP</p>
            <p>Av. Paulista, 1000</p>
            <p>01310-100 São Paulo</p>
            <p>Brasil</p>
          </div>
        </div>

        <div className="border-b pb-4">
          <h3 className="font-medium mb-2">Detalhamento do Preço</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Veículo selecionado</span>
              <span>R$ 246,00</span>
            </div>
            <div className="flex justify-between">
              <span>Caução</span>
              <span>R$ 75,00</span>
            </div>
            <div className="flex justify-between">
              <span>Taxa de devolução fora do horário</span>
              <span>R$ 50,00</span>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <div className="flex justify-between items-center font-semibold">
            <span>Total</span>
            <span className="text-xl">R$ 371,00</span>
          </div>
        </div>
      </div>
    </Card>
  );
};