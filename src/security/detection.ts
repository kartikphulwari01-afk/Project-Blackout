/* eslint-disable @typescript-eslint/no-explicit-any */
import { SecurityEventPayload } from './types';
import { evaluateRules } from './rules';

/**
 * Detection engine that processes incoming generic events and determines
 * if they constitute a security threat based on defined rules.
 */
export function analyzeEvent(event: any): SecurityEventPayload | null {
  // Pass the raw event through the rule engine
  const detectionResult = evaluateRules(event);
  
  if (detectionResult.isThreat) {
    return {
      type: (detectionResult.threatType as any) || 'SUSPICIOUS_LOGIN_ATTEMPT',
      severity: detectionResult.severity || 'MEDIUM',
      source: 'DetectionEngine',
      metadata: { originalEvent: event, ruleTriggered: detectionResult.ruleId },
    };
  }
  
  return null;
}
