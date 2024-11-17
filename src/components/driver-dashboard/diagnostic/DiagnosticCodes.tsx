import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

interface DiagnosticCodesProps {
  codes: string[];
}

export const DiagnosticCodes = ({ codes }: DiagnosticCodesProps) => {
  if (codes.length === 0) return null;

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-yellow-500" />
          Códigos de Diagnóstico
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {codes.map((code, index) => (
            <li key={index} className="flex items-center gap-2">
              <span className="font-mono">{code}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};