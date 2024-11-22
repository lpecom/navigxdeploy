import * as z from "zod";

export const planSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  type: z.enum(["flex", "monthly", "black"]),
  period: z.enum(["week", "month"]),
  base_price: z.number().min(0, "Price must be greater than zero"),
  included_km: z.number().min(0, "Included KM must be greater than zero"),
  extra_km_price: z.number().min(0, "Extra KM price must be greater than zero").optional(),
  is_active: z.boolean().default(true),
  features: z.array(z.string()),
  bullet_points: z.array(z.object({
    km: z.string(),
    price: z.string()
  })),
  highlight: z.boolean().default(false),
  display_order: z.number().min(0)
});

export type PlanFormValues = z.infer<typeof planSchema>;