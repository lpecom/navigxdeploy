export type ReservationStatus = 'pending_approval' | 'approved' | 'rejected';
export type PaymentStatus = 'paid' | 'pending';
export type CustomerStatus = 'new' | 'returning';
export type PaymentType = 'pay_now' | 'pay_later';

export interface Optional {
  name: string;
  pricePerWeek: number;
}

export interface InsuranceOption {
  id: string;
  name: string;
  price: number;
  coverage_details: Record<string, boolean>;
}

export interface Reservation {
  id: string;
  reservationNumber: string;
  customerName: string;
  email: string;
  cpf: string;
  phone: string;
  address: string;
  pickupDate: string;
  pickupTime?: string;
  status: ReservationStatus;
  paymentStatus: PaymentStatus;
  customerStatus: CustomerStatus;
  riskScore: number;
  documentsSubmitted: boolean;
  createdAt: string;
  carCategory: string;
  leadSource: string;
  weeklyFare: number;
  optionals: Optional[];
  kilometersPerWeek: number | 'unlimited';
  planType?: string;
  paymentType: PaymentType;
  insuranceOption?: InsuranceOption;
}

export type ReservationFilter = 'pending' | 'pickup' | 'checkin';