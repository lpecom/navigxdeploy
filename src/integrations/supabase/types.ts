// This file is now split into smaller type definition files
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Re-export types from their respective files
export type { Database } from '@/types/database';
export type { InsuranceOptions } from '@/types/supabase/insurance';
export type { Wallet } from '@/types/supabase/wallet';