import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";

export type TemplateType = "default" | "featured" | "promotional" | "seasonal" | "monthly" | "flex" | "black";

interface TemplateOption {
  type: TemplateType;
  name: string;
  description: string;
  preview: string;
}

const templates: TemplateOption[] = [
  {
    type: "default",
    name: "Template Padrão",
    description: "Layout limpo e simples para ofertas regulares",
    preview: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
  },
  {
    type: "monthly",
    name: "Navig Mensal",
    description: "Template específico para planos mensais",
    preview: "https://images.unsplash.com/photo-1518770660439-4636190af475",
  },
  {
    type: "flex",
    name: "Navig Flex",
    description: "Design especial para planos flexíveis",
    preview: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
  },
  {
    type: "black",
    name: "Navig Black",
    description: "Template premium para o plano Black",
    preview: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
  },
  {
    type: "promotional",
    name: "Promoção Especial",
    description: "Design chamativo para ofertas promocionais",
    preview: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d",
  },
  {
    type: "seasonal",
    name: "Sazonal",
    description: "Template para ofertas sazonais",
    preview: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800",
  },
];

interface OfferTemplatesProps {
  selectedTemplate: TemplateType;
  onSelectTemplate: (template: TemplateType) => void;
}

export const OfferTemplates = ({
  selectedTemplate,
  onSelectTemplate,
}: OfferTemplatesProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {templates.map((template) => (
        <Card
          key={template.type}
          className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
            selectedTemplate === template.type
              ? "ring-2 ring-primary"
              : "hover:ring-1 hover:ring-primary/50"
          }`}
          onClick={() => onSelectTemplate(template.type)}
        >
          <CardContent className="p-4">
            <div className="relative aspect-video mb-4 overflow-hidden rounded-lg">
              <img
                src={template.preview}
                alt={template.name}
                className="object-cover w-full h-full"
              />
              {selectedTemplate === template.type && (
                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                  <Check className="w-8 h-8 text-white" />
                </div>
              )}
            </div>
            <h3 className="font-semibold mb-1">{template.name}</h3>
            <p className="text-sm text-muted-foreground">{template.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};