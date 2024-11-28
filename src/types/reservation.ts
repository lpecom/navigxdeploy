export type ReservationFilter = 'pending' | 'pickup' | 'all';

export interface Reservation {
  id: string;
  driver_id: string;
  vehicle_id: string;
  status: string;
  created_at: string;
  updated_at: string;
  pickup_date: string;
  return_date: string;
  customer_id: string | null;
  notes: string | null;
  total_amount: number;
  insurance_details: Record<string, any> | null;
}
