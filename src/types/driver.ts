import { z } from "zod";

export const driverSchema = z.object({
  fullName: z.string().min(3, "Nome completo é obrigatório"),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida"),
  licenseNumber: z.string().min(3, "CNH é obrigatória"),
  licenseExpiry: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida"),
  cpf: z.string().min(11, "CPF inválido").max(14, "CPF inválido"),
  phone: z.string().min(10, "Telefone inválido"),
  email: z.string().email("Email inválido"),
});

export type DriverFormValues = z.infer<typeof driverSchema>;