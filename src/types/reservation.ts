export type CustomerStatus = 'new' | 'returning' | 'blocked';
export type PaymentStatus = 'paid' | 'pending';
export type ReservationStatus = 'pending' | 'approved' | 'rejected';
export type CarCategory = 'SUV' | 'Luxury' | 'Economy' | 'Sports';
export type LeadSource = 'facebook' | 'whatsapp' | 'form';
export type ReservationFilter = 'pending' | 'pickup';

export interface Optional {
  name: string;
  pricePerWeek: number;
}

export interface Reservation {
  id: string;
  customerName: string;
  email: string;
  cpf: string;
  phone: string;
  address: string;
  pickupDate: string;
  status: ReservationStatus;
  paymentStatus: PaymentStatus;
  customerStatus: CustomerStatus;
  riskScore: number;
  documentsSubmitted: boolean;
  createdAt: string;
  carCategory: CarCategory;
  leadSource: LeadSource;
  weeklyFare: number;
  optionals: Optional[];
  kilometersPerWeek: number | 'unlimited';
}