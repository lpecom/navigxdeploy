import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export type AutomationType = "Email" | "SMS" | "WhatsApp" | "Call";
export type AutomationStatus = "Active" | "Inactive" | "Draft";

interface TemplateProps {
  title: string;
  description: string;
  type: AutomationType;
  category: string;
  onSelect: () => void;
}

const Template = ({ title, description, type, category, onSelect }: TemplateProps) => (
  <Card className="hover:border-primary/50 transition-colors cursor-pointer" onClick={onSelect}>
    <CardHeader className="space-y-1">
      <div className="flex items-center justify-between">
        <CardTitle className="text-lg">{title}</CardTitle>
        <Badge variant="outline">{type}</Badge>
      </div>
      <Badge variant="secondary" className="w-fit">
        {category}
      </Badge>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
  </Card>
);

export const AutomationTemplates = () => {
  const templates = [
    // Onboarding e Boas-vindas
    {
      title: "Série de Boas-vindas",
      description: "Sequência de 3 emails para novos clientes com informações importantes",
      type: "Email" as AutomationType,
      category: "Onboarding",
    },
    {
      title: "Confirmação de Cadastro",
      description: "Mensagem instantânea após cadastro bem-sucedido",
      type: "WhatsApp" as AutomationType,
      category: "Onboarding",
    },
    
    // Agendamento e Lembretes
    {
      title: "Lembrete de Agendamento",
      description: "SMS 24h antes da consulta/serviço agendado",
      type: "SMS" as AutomationType,
      category: "Agendamentos",
    },
    {
      title: "Confirmação de Presença",
      description: "Ligação automática 2h antes do compromisso",
      type: "Call" as AutomationType,
      category: "Agendamentos",
    },

    // Vendas e Promoções
    {
      title: "Recuperação de Carrinho",
      description: "Sequência para clientes que abandonaram carrinho",
      type: "Email" as AutomationType,
      category: "Vendas",
    },
    {
      title: "Promoção Relâmpago",
      description: "Notificação de ofertas com tempo limitado",
      type: "WhatsApp" as AutomationType,
      category: "Vendas",
    },

    // Pós-venda e Feedback
    {
      title: "Pesquisa de Satisfação",
      description: "Coleta de feedback após 7 dias da compra",
      type: "Email" as AutomationType,
      category: "Feedback",
    },
    {
      title: "Avaliação de Atendimento",
      description: "SMS após interação com suporte",
      type: "SMS" as AutomationType,
      category: "Feedback",
    },

    // Retenção e Engajamento
    {
      title: "Cliente Inativo",
      description: "Reengajamento após 30 dias sem interação",
      type: "Email" as AutomationType,
      category: "Retenção",
    },
    {
      title: "Aniversário do Cliente",
      description: "Mensagem personalizada de parabéns",
      type: "WhatsApp" as AutomationType,
      category: "Engajamento",
    },

    // Cobranças e Financeiro
    {
      title: "Lembrete de Pagamento",
      description: "Aviso de fatura próxima do vencimento",
      type: "SMS" as AutomationType,
      category: "Financeiro",
    },
    {
      title: "Confirmação de Pagamento",
      description: "Notificação após pagamento processado",
      type: "WhatsApp" as AutomationType,
      category: "Financeiro",
    },

    // Suporte e Atendimento
    {
      title: "Abertura de Chamado",
      description: "Confirmação de ticket de suporte criado",
      type: "Email" as AutomationType,
      category: "Suporte",
    },
    {
      title: "Atualização de Status",
      description: "Notificação de mudança no status do chamado",
      type: "WhatsApp" as AutomationType,
      category: "Suporte",
    },

    // Eventos e Webinars
    {
      title: "Confirmação de Inscrição",
      description: "Email após inscrição em evento",
      type: "Email" as AutomationType,
      category: "Eventos",
    },
    {
      title: "Lembrete de Evento",
      description: "Sequência de lembretes antes do evento",
      type: "WhatsApp" as AutomationType,
      category: "Eventos",
    },
  ];

  const handleSelectTemplate = () => {
    // Template selection logic to be implemented
    console.log("Template selecionado");
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {templates.map((template, index) => (
        <Template
          key={index}
          {...template}
          onSelect={handleSelectTemplate}
        />
      ))}
      <Card className="border-dashed hover:border-primary/50 transition-colors cursor-pointer">
        <CardContent className="flex flex-col items-center justify-center h-full min-h-[200px]">
          <Button variant="ghost" className="h-20 w-20 rounded-full">
            <Plus className="h-10 w-10" />
          </Button>
          <p className="mt-4 text-sm text-muted-foreground">Criar template personalizado</p>
        </CardContent>
      </Card>
    </div>
  );
};