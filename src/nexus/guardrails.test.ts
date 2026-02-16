import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { CircuitBreaker, PaymentIdempotency, runSafeHandler, applyTemplate } from '../src/nexus/middleware';
import { Nexus, ProtocolEvent } from '../src/nexus/index';

describe('Nexus Guardrails', () => {
  
  describe('Circuit Breaker (Event Depth)', () => {
    it('should block events exceeding Max Depth', () => {
        const payload = { __depth: 11, __chainId: 'abc' };
        const allowed = CircuitBreaker.check(payload, 'TEST:LOOP');
        expect(allowed).toBe(false);
    });

    it('should allow events within limit and increment depth', () => {
        const payload = { __depth: 5 };
        const allowed = CircuitBreaker.check(payload, 'TEST:OK');
        expect(allowed).toBe(true);
        expect(payload.__depth).toBe(6);
        expect(payload.__chainId).toBeDefined();
    });
  });

  describe('Idempotency Guard', () => {
    it('should lock a key and block subsequent calls', () => {
        const key = `test_ord_${Date.now()}`;
        // First call: OK
        expect(PaymentIdempotency.checkAndLock(key)).toBe(true);
        // Second call: Blocked
        expect(PaymentIdempotency.checkAndLock(key)).toBe(false);
    });
  });

  describe('Template Engine', () => {
    it('should replace {{tokens}} with payload values', () => {
        const payload = { 
            orderId: '123', 
            user: { id: 'mio-1', role: 'admin' }, 
            amount: 50.5 
        };
        const template = {
            target: '{{user.id}}',
            val: '{{amount}}',
            ref: '{{orderId}}',
            fixed: 'static_value'
        };
        
        const result = applyTemplate(template, payload);
        
        expect(result).toEqual({
            target: 'mio-1',
            val: 50.5,
            ref: '123',
            fixed: 'static_value'
        });
    });

    it('should handle undefined tokens gracefully', () => {
        const payload = {};
        const template = { val: '{{missing}}' };
        const result = applyTemplate(template, payload);
        expect(result.val).toBeUndefined();
    });
  });

  describe('Safe Handler Wrapper', () => {
    it('should catch errors and return false without throwing', async () => {
        const rule = { id: 'test-rule', on: 'TEST', enabled: true, priority: 1 };
        const mockFn = vi.fn().mockRejectedValue(new Error('Intentional Fail'));
        
        // Spy on console.error to suppress noise
        const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
        
        const success = await runSafeHandler(rule, {}, mockFn);
        
        expect(success).toBe(false);
        expect(spy).toHaveBeenCalled(); // Should log the error
        spy.mockRestore();
    });

    it('should return true on success', async () => {
        const rule = { id: 'test-rule', on: 'TEST', enabled: true, priority: 1 };
        const mockFn = vi.fn().mockResolvedValue(true);
        
        const success = await runSafeHandler(rule, {}, mockFn);
        expect(success).toBe(true);
    });
  });

});
