export type Severity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type EventStatus = 'LOGGED' | 'INVESTIGATING' | 'RESOLVED' | 'IGNORED';

export type SecurityEventType =
  | 'SIMULATED_MALICIOUS_CLICK'
  | 'SIMULATED_PAYLOAD'
  | 'SIMULATED_THREAT_DETECTED'
  | 'SIMULATED_BLOCK'
  | 'SIMULATED_PROPAGATION'
  | 'SUSPICIOUS_LOGIN_ATTEMPT'
  | 'ANOMALOUS_CART_ACTIVITY';

export interface SecurityEventPayload {
  type: SecurityEventType;
  severity: Severity;
  source: string;
  sessionId?: string;
  metadata?: Record<string, any>;
}

export interface SecurityEventModel extends SecurityEventPayload {
  id: string;
  status: EventStatus;
  timestamp: Date;
}
