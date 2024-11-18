import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"

export const ImportCustomers = () => {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const { toast } = useToast()

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith('.csv')) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um arquivo CSV",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)
    setUploadProgress(10)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const { data, error } = await supabase.functions.invoke(
        "process-customers-csv",
        {
          body: formData,
          headers: {
            'Accept': 'application/json',
          },
        }
      )

      if (error) throw error

      setUploadProgress(100)
      toast({
        title: "Sucesso!",
        description: `${data.processed} clientes importados com sucesso.${
          data.errors?.length ? ` ${data.errors.length} erros encontrados.` : ''
        }`,
      })

      window.location.reload()
    } catch (error: any) {
      console.error("Error importing customers:", error)
      toast({
        title: "Erro",
        description: error.message || "Falha ao importar clientes. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
      event.target.value = ''
    }
  }

  return (
    <div className="relative">
      <input
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        className="hidden"
        id="customer-file-upload"
      />
      <Button 
        onClick={() => document.getElementById('customer-file-upload')?.click()}
        disabled={isUploading}
        className="flex items-center gap-2"
      >
        <Upload className="w-4 h-4" />
        {isUploading ? 'Importando...' : 'Importar Clientes'}
      </Button>
      {isUploading && (
        <Progress value={uploadProgress} className="w-full mt-2" />
      )}
    </div>
  )
}