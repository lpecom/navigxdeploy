export interface Invoice {
  id: string;
  driver_id: string;
  amount: number;
  due_date: string;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  description?: string;
  invoice_number: number;
  created_at: string;
  updated_at: string;
  payment_id?: string;
}

export interface Wallet {
  id: string;
  driver_id: string;
  balance: number;
  created_at: string;
  updated_at: string;
}