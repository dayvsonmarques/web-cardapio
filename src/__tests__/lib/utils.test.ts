import {
  formatPrice,
  formatDate,
  formatDateTime,
  validateCPF,
  validatePhone,
  validateEmail,
  validateCEP,
  calculatePercentage,
  truncateText,
} from '@/lib/utils';

describe('Utils - Formatting Functions', () => {
  describe('formatPrice', () => {
    it('should format price in Brazilian Real', () => {
      expect(formatPrice(10.5)).toBe('R$ 10,50');
      expect(formatPrice(1000)).toBe('R$ 1.000,00');
      expect(formatPrice(1234.56)).toBe('R$ 1.234,56');
    });

    it('should handle zero', () => {
      expect(formatPrice(0)).toBe('R$ 0,00');
    });

    it('should handle negative values', () => {
      expect(formatPrice(-10.5)).toBe('-R$ 10,50');
    });

    it('should handle decimal precision', () => {
      expect(formatPrice(10.999)).toBe('R$ 11,00');
      expect(formatPrice(10.001)).toBe('R$ 10,00');
    });
  });

  describe('formatDate', () => {
    it('should format date in Brazilian format', () => {
      const date = '2025-10-10';
      expect(formatDate(date)).toBe('10/10/2025');
    });

    it('should handle different date formats', () => {
      const date = '2025-01-05T00:00:00Z';
      expect(formatDate(date)).toMatch(/05\/01\/2025/);
    });
  });

  describe('formatDateTime', () => {
    it('should format date and time in Brazilian format', () => {
      const dateTime = '2025-10-10T14:30:00Z';
      const formatted = formatDateTime(dateTime);
      expect(formatted).toContain('10/10/2025');
    });
  });
});

describe('Utils - Validation Functions', () => {
  describe('validateCPF', () => {
    it('should validate correct CPF', () => {
      expect(validateCPF('111.444.777-35')).toBe(true);
      expect(validateCPF('11144477735')).toBe(true);
    });

    it('should reject invalid CPF', () => {
      expect(validateCPF('111.444.777-36')).toBe(false);
      expect(validateCPF('12345678901')).toBe(false);
    });

    it('should reject CPF with all same digits', () => {
      expect(validateCPF('111.111.111-11')).toBe(false);
      expect(validateCPF('00000000000')).toBe(false);
    });

    it('should reject CPF with wrong length', () => {
      expect(validateCPF('123456789')).toBe(false);
      expect(validateCPF('12345678901234')).toBe(false);
    });

    it('should handle CPF with formatting', () => {
      expect(validateCPF('111.444.777-35')).toBe(true);
    });
  });

  describe('validatePhone', () => {
    it('should validate correct phone numbers', () => {
      expect(validatePhone('11987654321')).toBe(true);
      expect(validatePhone('1133334444')).toBe(true);
    });

    it('should handle phone with formatting', () => {
      expect(validatePhone('(11) 98765-4321')).toBe(true);
      expect(validatePhone('(11) 3333-4444')).toBe(true);
    });

    it('should reject invalid phone', () => {
      expect(validatePhone('123')).toBe(false);
      expect(validatePhone('12345678901234')).toBe(false);
    });
  });

  describe('validateEmail', () => {
    it('should validate correct email', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name+tag@example.co.uk')).toBe(true);
    });

    it('should reject invalid email', () => {
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('invalid@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
    });
  });

  describe('validateCEP', () => {
    it('should validate correct CEP', () => {
      expect(validateCEP('01310-100')).toBe(true);
      expect(validateCEP('01310100')).toBe(true);
    });

    it('should reject invalid CEP', () => {
      expect(validateCEP('123')).toBe(false);
      expect(validateCEP('123456789')).toBe(false);
    });

    it('should handle CEP with formatting', () => {
      expect(validateCEP('01310-100')).toBe(true);
    });
  });
});

describe('Utils - Calculation Functions', () => {
  describe('calculatePercentage', () => {
    it('should calculate correct percentage', () => {
      expect(calculatePercentage(50, 100)).toBe(50);
      expect(calculatePercentage(25, 100)).toBe(25);
      expect(calculatePercentage(1, 3)).toBeCloseTo(33.33, 2);
    });

    it('should handle zero total', () => {
      expect(calculatePercentage(10, 0)).toBe(0);
    });

    it('should handle zero value', () => {
      expect(calculatePercentage(0, 100)).toBe(0);
    });

    it('should handle percentage over 100', () => {
      expect(calculatePercentage(150, 100)).toBe(150);
    });
  });

  describe('truncateText', () => {
    it('should truncate long text', () => {
      const text = 'This is a very long text that needs to be truncated';
      expect(truncateText(text, 20)).toBe('This is a very long ...');
    });

    it('should not truncate short text', () => {
      const text = 'Short text';
      expect(truncateText(text, 20)).toBe('Short text');
    });

    it('should handle exact length', () => {
      const text = 'Exact';
      expect(truncateText(text, 5)).toBe('Exact');
    });

    it('should handle empty string', () => {
      expect(truncateText('', 10)).toBe('');
    });
  });
});
