export type ReservationFilter = 'pending' | 'pickup' | 'all';

export interface Reservation {
  id: string;
  driver_id: string;
  vehicle_id?: string;
  status: string;
  created_at: string;
  updated_at: string;
  pickup_date: string;
  pickup_time?: string;
  return_date?: string;
  customer_id?: string;
  notes?: string;
  total_amount: number;
  insurance_details?: Record<string, any>;
  selected_car: {
    name: string;
    category: string;
    plan_type?: string;
  };
  selected_optionals: Array<{
    name: string;
    pricePerWeek: number;
  }>;
  driver: {
    id: string;
    full_name: string;
    email: string;
    phone: string;
  };
  reservation_number: number;
  optionals: Array<{
    name: string;
    pricePerWeek: number;
  }>;
  weeklyFare: number;
  kilometersPerWeek: 'unlimited' | 'limited';
  paymentStatus: 'paid' | 'pending';
  riskScore: number;
  documentsSubmitted: boolean;
  planType?: string;
}