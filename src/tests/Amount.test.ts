import { describe, it, expect } from 'vitest';
import { Amount } from '../types/Amount.js';

describe('Amount', () => {
  describe('creation', () => {
    it('should create from milliunits', () => {
      const amount = Amount.fromMilliunits(-4500);
      expect(amount.toMilliunits()).toBe(-4500);
    });

    it('should create from string', () => {
      const amount = Amount.fromString('-4.50');
      expect(amount.toMilliunits()).toBe(-4500);
    });

    it('should create from dollars', () => {
      const amount = Amount.fromDollars(-4.50);
      expect(amount.toMilliunits()).toBe(-4500);
    });
  });

  describe('formatting', () => {
    it('should format as currency string', () => {
      const amount = Amount.fromMilliunits(-4500);
      expect(amount.format()).toBe('-4.50');
    });

    it('should format positive amounts', () => {
      const amount = Amount.fromMilliunits(12345);
      expect(amount.format()).toBe('12.35');
    });

    it('should handle zero', () => {
      const amount = Amount.fromMilliunits(0);
      expect(amount.format()).toBe('0.00');
    });
  });

  describe('validation', () => {
    it('should validate valid string amounts', () => {
      expect(Amount.isValid('-4.50')).toBe(true);
      expect(Amount.isValid('1234.56')).toBe(true);
      expect(Amount.isValid('0')).toBe(true);
      expect(Amount.isValid('0.00')).toBe(true);
    });

    it('should reject invalid string amounts', () => {
      expect(Amount.isValid('abc')).toBe(false);
      expect(Amount.isValid('12.345')).toBe(false); // Too many decimals
      expect(Amount.isValid('')).toBe(false);
      expect(Amount.isValid('$12.34')).toBe(false); // Currency symbols
    });
  });

  describe('comparison', () => {
    it('should compare amounts correctly', () => {
      const amount1 = Amount.fromMilliunits(-4500);
      const amount2 = Amount.fromMilliunits(-3200);
      const amount3 = Amount.fromMilliunits(-4500);

      expect(amount1.equals(amount3)).toBe(true);
      expect(amount1.equals(amount2)).toBe(false);
      expect(amount1.isLessThan(amount2)).toBe(true);
      expect(amount2.isGreaterThan(amount1)).toBe(true);
    });

    it('should handle zero comparisons', () => {
      const zero = Amount.fromMilliunits(0);
      const negative = Amount.fromMilliunits(-1000);
      const positive = Amount.fromMilliunits(1000);

      expect(zero.isZero()).toBe(true);
      expect(negative.isNegative()).toBe(true);
      expect(positive.isPositive()).toBe(true);
    });
  });
});