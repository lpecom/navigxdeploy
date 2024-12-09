import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"

export const SuccessSection = () => {
  const navigate = useNavigate()
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-500 mb-6">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Reserva Confirmada!</h2>
        <p className="text-gray-600 mb-8">
          Sua reserva foi recebida com sucesso. Em breve nossa equipe entrará em contato para confirmar os detalhes.
        </p>
        <Button
          onClick={() => navigate('/')}
          className="w-full sm:w-auto"
        >
          Voltar para Home
        </Button>
      </Card>
    </motion.div>
  )
}