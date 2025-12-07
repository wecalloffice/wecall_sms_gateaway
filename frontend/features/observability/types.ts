// Audit event type (user actions, admin activities)
export interface AuditEvent {
  sid: string;
  business_sid: string;
  type: string;
  action: string;
  actor: string;
  resource_type?: string;
  resource_id?: string;
  details?: Record<string, any>;
  timestamp: string;
  ip_address?: string;
}

// DLR (Delivery Report) event type
export interface DLREvent {
  sid: string;
  business_sid: string;
  message_sid: string;
  delivery_status: "delivered" | "failed" | "pending";
  error_code?: string;
  timestamp: string;
  carrier?: string;
  created_at?: string;
}

// Generic log event (deprecated)
export interface LogEvent {
  id: string;
  timestamp: string;
  message: string;
  level: string;
}
