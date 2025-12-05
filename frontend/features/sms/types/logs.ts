export interface SmsLog {
  id: string;
  messageId: string;
  to: string;
  from: string;
  message: string;
  status: 'sent' | 'delivered' | 'failed' | 'pending' | 'queued';
  createdAt: Date;
  deliveredAt?: Date;
  failureReason?: string;
  cost?: number;
  country?: string;
  carrier?: string;
  credits?: number;
}

export interface SmsLogFilters {
  status?: SmsLog['status'];
  dateFrom?: Date;
  dateTo?: Date;
  phoneNumber?: string;
  searchQuery?: string;
}

export interface SmsLogStats {
  total: number;
  sent: number;
  delivered: number;
  failed: number;
  pending: number;
  totalCost: number;
  deliveryRate: number;
}
