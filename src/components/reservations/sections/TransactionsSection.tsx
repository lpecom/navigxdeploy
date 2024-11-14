import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface TransactionsSectionProps {
  transactions: Array<{
    date: string;
    type: string;
    amount: number;
  }>;
}

export const TransactionsSection = ({ transactions }: TransactionsSectionProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" />
          Transações Recentes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction, index) => (
            <div key={index} className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">{transaction.type}</p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(transaction.date), "PP", { locale: ptBR })}
                </p>
              </div>
              <span className="text-sm font-medium">
                R$ {transaction.amount.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};