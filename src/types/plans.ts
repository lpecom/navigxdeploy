export interface Plan {
  id: string;
  name: string;
  description: string | null;
  type: 'flex' | 'monthly' | 'black';
  period: 'week' | 'month';
  base_price: number;
  included_km: number;
  extra_km_price: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface InsuranceOption {
  id: string;
  name: string;
  description: string | null;
  coverage_details: Record<string, boolean>;
  price: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}