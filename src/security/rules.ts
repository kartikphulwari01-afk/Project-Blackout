/* eslint-disable @typescript-eslint/no-explicit-any */
import { SecurityEventType, Severity } from './types';

interface DetectionResult {
  isThreat: boolean;
  threatType?: SecurityEventType;
  severity?: Severity;
  ruleId?: string;
}

/**
 * Placeholder for security rules.
 * Later, this can be expanded to parse standard format rules (like Sigma rules adapted for web).
 */
export function evaluateRules(event: any): DetectionResult {
  // Simple signature-based detection placeholder
  
  // 1. Check for basic SQLi patterns in generic text fields
  if (event.text && /(UNION SELECT|OR 1=1|DROP TABLE)/i.test(event.text)) {
    return {
      isThreat: true,
      threatType: 'SIMULATED_PAYLOAD',
      severity: 'CRITICAL',
      ruleId: 'RULE_SQLI_01',
    };
  }

  // 2. Check for basic XSS patterns
  if (event.text && /(<script|javascript:|onerror=)/i.test(event.text)) {
    return {
      isThreat: true,
      threatType: 'SIMULATED_PAYLOAD',
      severity: 'HIGH',
      ruleId: 'RULE_XSS_01',
    };
  }

  return { isThreat: false };
}
