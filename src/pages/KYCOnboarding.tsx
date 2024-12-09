import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Upload, Camera, FileText, Home, ChevronRight, ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { CheckInProgress } from "@/components/check-in/components/CheckInProgress";

const steps = [
  {
    id: 'document_front',
    title: 'Frente do Documento',
    description: 'Tire uma foto clara da frente do seu RG ou CNH',
    icon: FileText,
  },
  {
    id: 'document_back',
    title: 'Verso do Documento',
    description: 'Tire uma foto clara do verso do seu RG ou CNH',
    icon: FileText,
  },
  {
    id: 'selfie',
    title: 'Foto de Rosto',
    description: 'Tire uma selfie clara do seu rosto',
    icon: Camera,
  },
  {
    id: 'proof_of_address',
    title: 'Comprovante de Residência',
    description: 'Envie uma conta de luz ou água recente',
    icon: Home,
  },
];

const KYCOnboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, boolean>>({});
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleFileUpload = async (file: File, type: string) => {
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `${type}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('kyc-documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('kyc-documents')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('driver_details')
        .update({ 
          [`${type}_url`]: publicUrl,
          kyc_status: 'submitted',
          kyc_submitted_at: new Date().toISOString()
        })
        .eq('id', 'current-driver-id');

      if (updateError) throw updateError;

      setUploadedFiles(prev => ({ ...prev, [type]: true }));
      toast({
        title: "Documento enviado com sucesso",
        description: "Seu documento foi enviado e está em análise.",
      });

      // Move to next step if not on last step
      if (currentStep < steps.length) {
        setCurrentStep(prev => prev + 1);
      }
    } catch (error: any) {
      toast({
        title: "Erro no envio",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const currentStepData = steps[currentStep - 1];
  const Icon = currentStepData?.icon;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 p-4 md:py-12">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">
            Verificação de Documentos
          </h1>
          <p className="text-gray-400">
            Para garantir a segurança da nossa comunidade, precisamos verificar sua identidade.
          </p>
        </div>

        <CheckInProgress currentStep={currentStep} totalSteps={steps.length} />

        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-6 bg-white/5 border-white/10">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {currentStepData.title}
                </h3>
                <p className="text-sm text-gray-400 mb-6">
                  {currentStepData.description}
                </p>
              </div>

              <label className="w-full">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file, currentStepData.id);
                  }}
                />
                <Button
                  variant="outline"
                  className="w-full"
                  disabled={isUploading}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {isUploading ? "Enviando..." : uploadedFiles[currentStepData.id] ? "Reenviar" : "Enviar Documento"}
                </Button>
              </label>
            </div>
          </Card>
        </motion.div>

        <div className="flex justify-between gap-4 mt-6">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
            disabled={currentStep === 1}
            className="w-full"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>
          
          <Button
            variant="outline"
            onClick={() => setCurrentStep(prev => Math.min(steps.length, prev + 1))}
            disabled={currentStep === steps.length || !uploadedFiles[currentStepData.id]}
            className="w-full"
          >
            Próximo
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {currentStep === steps.length && Object.keys(uploadedFiles).length === steps.length && (
          <Button
            variant="default"
            size="lg"
            onClick={() => navigate('/driver')}
            className="w-full bg-primary hover:bg-primary/90"
          >
            Concluir Verificação
          </Button>
        )}
      </div>
    </div>
  );
};

export default KYCOnboarding;