import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/components/ui/use-toast"

export const SuccessSection = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  
  const handleKYCStart = () => {
    toast({
      title: "Redirecionando para verificação",
      description: "Você será direcionado para o processo de verificação de documentos.",
    })
    navigate('/driver')
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <Card className="p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-500 mb-6">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Reserva Pré-Aprovada!</h2>
        <p className="text-gray-600 mb-8">
          Sua reserva foi recebida com sucesso. Para finalizar o processo, precisamos verificar seus documentos.
        </p>
        <div className="space-y-4">
          <Button
            onClick={handleKYCStart}
            className="w-full sm:w-auto bg-primary hover:bg-primary/90"
          >
            Iniciar Verificação de Documentos
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="w-full sm:w-auto"
          >
            Voltar para Home
          </Button>
        </div>
      </Card>
    </motion.div>
  )
}