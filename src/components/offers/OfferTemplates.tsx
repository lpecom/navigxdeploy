import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";

export type TemplateType = "default" | "featured" | "promotional" | "seasonal";

interface TemplateOption {
  type: TemplateType;
  name: string;
  description: string;
  preview: string;
}

const templates: TemplateOption[] = [
  {
    type: "default",
    name: "Standard Template",
    description: "Clean and simple layout for regular offers",
    preview: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
  },
  {
    type: "featured",
    name: "Featured Highlight",
    description: "Premium template with enhanced visibility",
    preview: "https://images.unsplash.com/photo-1518770660439-4636190af475",
  },
  {
    type: "promotional",
    name: "Special Promotion",
    description: "Eye-catching design for special deals",
    preview: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
  },
  {
    type: "seasonal",
    name: "Seasonal Theme",
    description: "Themed template for seasonal offers",
    preview: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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