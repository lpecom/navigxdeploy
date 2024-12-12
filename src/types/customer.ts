export interface CustomerData {
  full_name: string;
  email: string;
  cpf: string;
  phone: string;
  birth_date: string;
  postal_code?: string;
  address?: string;
  city?: string;
  state?: string;
  license_number: string;
  license_expiry: string;
  auth_user_id?: string;
}