export interface CustomerData {
  full_name: string;
  email: string;
  cpf: string;
  phone: string;
  birth_date: string;
  license_number: string;
  license_expiry: string;
  postal_code?: string;
  address?: string;
  city?: string;
  state?: string;
  auth_user_id?: string;
}