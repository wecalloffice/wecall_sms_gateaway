// SMS Gateway/Connector type
export interface Connector {
  sid: string;
  name: string;
  type: string;
  provider: string;
  status: "active" | "inactive" | "suspended";
  config?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

// SMS Route type (routing rules)
export interface Route {
  sid: string;
  business_sid: string;
  name: string;
  priority: number;
  source_number?: string;
  destination_pattern?: string;
  connector_sid: string;
  is_default: boolean;
  status: "active" | "inactive";
  created_at?: string;
  updated_at?: string;
}
