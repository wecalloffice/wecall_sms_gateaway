// Core types used across the application

export type UserRole = 'PLATFORM_ADMIN' | 'RESELLER_ADMIN' | 'CLIENT_ADMIN';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  account_sid: string;
  created_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface DateRange {
  start: Date;
  end: Date;
}

export type SmsStatus = 'pending' | 'sent' | 'delivered' | 'failed' | 'queued';

export type TransactionType = 'credit' | 'debit' | 'topup' | 'refund';
