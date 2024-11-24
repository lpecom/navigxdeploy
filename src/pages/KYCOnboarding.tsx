import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Upload, Camera, FileText, Home } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const KYCOnboarding = () => {
  const [isUploading, setIsUploading] = useState(false);
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
        .eq('id', 'current-driver-id'); // You'll need to replace this with actual driver ID

      if (updateError) throw updateError;

      toast({
        title: "Upload successful",
        description: "Your document has been uploaded successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const uploadTypes = [
    {
      id: 'document_front',
      title: 'Front of ID/License',
      description: 'Upload a clear photo of the front of your ID or driver\'s license',
      icon: FileText,
    },
    {
      id: 'document_back',
      title: 'Back of ID/License',
      description: 'Upload a clear photo of the back of your ID or driver\'s license',
      icon: FileText,
    },
    {
      id: 'selfie',
      title: 'Selfie Photo',
      description: 'Take a clear selfie photo of yourself',
      icon: Camera,
    },
    {
      id: 'proof_of_address',
      title: 'Proof of Address',
      description: 'Upload a recent utility bill or bank statement',
      icon: Home,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-4">
              Complete Your Verification
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              To ensure the safety and security of our community, we need to verify your identity.
              Please upload the following documents.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {uploadTypes.map((type) => {
              const Icon = type.icon;
              return (
                <Card
                  key={type.id}
                  className="p-6 bg-white/5 border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {type.title}
                      </h3>
                      <p className="text-sm text-gray-400 mb-4">
                        {type.description}
                      </p>
                    </div>
                    <label className="w-full">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file, type.id);
                        }}
                      />
                      <Button
                        variant="outline"
                        className="w-full"
                        disabled={isUploading}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {isUploading ? "Uploading..." : "Upload Document"}
                      </Button>
                    </label>
                  </div>
                </Card>
              )
            })}
          </div>

          <div className="flex justify-center pt-8">
            <Button
              variant="default"
              size="lg"
              onClick={() => navigate('/dashboard')}
              className="bg-primary hover:bg-primary/90"
            >
              Complete Verification
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default KYCOnboarding;