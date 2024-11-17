import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface HeroSettings {
  title: string;
  subtitle: string;
  buttonText: string;
  backgroundImage: string;
}

interface WebsiteSettingsData {
  id: string;
  settings: {
    hero?: {
      title: string;
      subtitle: string;
      buttonText: string;
      backgroundImage: string;
    };
  };
}

export const WebsiteSettings = () => {
  const { toast } = useToast();
  const [heroSettings, setHeroSettings] = useState<HeroSettings>({
    title: "Alugue o carro perfeito para sua jornada",
    subtitle: "Descubra nossa frota premium e comece sua aventura hoje mesmo.",
    buttonText: "Ver Planos",
    backgroundImage: ""
  });

  const handleSave = async () => {
    try {
      const settingsData: WebsiteSettingsData = {
        id: 'hero',
        settings: {
          hero: {
            title: heroSettings.title,
            subtitle: heroSettings.subtitle,
            buttonText: heroSettings.buttonText,
            backgroundImage: heroSettings.backgroundImage
          }
        }
      };

      const { error } = await supabase
        .from('website_settings')
        .upsert(settingsData);

      if (error) throw error;

      toast({
        title: "Configurações salvas",
        description: "As alterações foram aplicadas com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as alterações.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Configurações do Website</h1>
      
      <Tabs defaultValue="hero">
        <TabsList>
          <TabsTrigger value="hero">Hero Section</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="testimonials">Depoimentos</TabsTrigger>
          <TabsTrigger value="footer">Rodapé</TabsTrigger>
        </TabsList>

        <TabsContent value="hero">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Título</label>
                <Input
                  value={heroSettings.title}
                  onChange={(e) => setHeroSettings(prev => ({
                    ...prev,
                    title: e.target.value
                  }))}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Subtítulo</label>
                <Textarea
                  value={heroSettings.subtitle}
                  onChange={(e) => setHeroSettings(prev => ({
                    ...prev,
                    subtitle: e.target.value
                  }))}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Texto do Botão</label>
                <Input
                  value={heroSettings.buttonText}
                  onChange={(e) => setHeroSettings(prev => ({
                    ...prev,
                    buttonText: e.target.value
                  }))}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Imagem de Fundo (URL)</label>
                <Input
                  value={heroSettings.backgroundImage}
                  onChange={(e) => setHeroSettings(prev => ({
                    ...prev,
                    backgroundImage: e.target.value
                  }))}
                  placeholder="https://exemplo.com/imagem.jpg"
                />
              </div>

              <Button onClick={handleSave}>Salvar Alterações</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};