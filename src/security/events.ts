import { SecurityEventPayload, SecurityEventType } from './types';

// In a real production system, this could be a message broker (RabbitMQ, Kafka, etc.)
// For our simulation, we use a simple singleton event emitter wrapper.

type EventListener = (payload: SecurityEventPayload) => void;

class SecurityEventEmitter {
  private listeners: Map<SecurityEventType | '*', EventListener[]> = new Map();

  subscribe(eventType: SecurityEventType | '*', callback: EventListener) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType)!.push(callback);
    return () => {
      const callbacks = this.listeners.get(eventType)!;
      this.listeners.set(
        eventType,
        callbacks.filter((cb) => cb !== callback)
      );
    };
  }

  async emit(payload: SecurityEventPayload) {
    // 1. Notify specific event listeners
    const specificListeners = this.listeners.get(payload.type) || [];
    // 2. Notify catch-all listeners
    const allListeners = this.listeners.get('*') || [];

    const callbacks = [...specificListeners, ...allListeners];
    
    callbacks.forEach((callback) => {
      try {
        callback(payload);
      } catch (error) {
        console.error('Error in security event listener:', error);
      }
    });

    // 3. Optional: Automatically persist the event to the database
    // (This is a clean way to keep normal application logic unaware of the DB save)
    try {
      await fetch('/api/security/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (e) {
      console.warn('Failed to persist security event via API', e);
    }
  }
}

export const securityEventBus = new SecurityEventEmitter();
