/* eslint-disable @typescript-eslint/no-explicit-any */
import { securityEventBus } from './events';
import { SecurityEventType, Severity } from './types';

/**
 * The simulator allows forcing simulated threat states for demonstration purposes.
 * DO NOT IMPLEMENT REAL MALWARE OR EXPLOITATION HERE.
 */
export class ThreatSimulator {
  static trigger(type: SecurityEventType, severity: Severity, source: string, metadata: any = {}) {
    console.log(`[SIMULATION] Triggering ${type} from ${source}`);
    securityEventBus.emit({
      type,
      severity,
      source,
      metadata,
    });
  }

  static simulateDriveByClick() {
    this.trigger(
      'SIMULATED_MALICIOUS_CLICK',
      'MEDIUM',
      'Simulator',
      { description: 'User clicked a simulated hijacked link.' }
    );
  }

  static simulateXSSPayload() {
    this.trigger(
      'SIMULATED_PAYLOAD',
      'HIGH',
      'Simulator',
      { payload: '<script>alert("test")</script>', description: 'Simulated XSS execution attempt.' }
    );
  }
}
