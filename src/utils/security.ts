import DOMPurify from 'dompurify';
import validator from 'validator';

// Input sanitization utilities
export const sanitizeInput = {
  // Sanitize HTML content to prevent XSS
  html: (input: string): string => {
    return DOMPurify.sanitize(input, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
      ALLOWED_ATTR: []
    });
  },

  // Sanitize plain text
  text: (input: string): string => {
    return validator.escape(input.trim());
  },

  // Sanitize and validate email
  email: (input: string): string | null => {
    const trimmed = input.trim().toLowerCase();
    if (!validator.isEmail(trimmed)) {
      return null;
    }
    return validator.normalizeEmail(trimmed) || null;
  },

  // Sanitize phone numbers
  phone: (input: string): string => {
    return input.replace(/[^\d\s\-\(\)\+]/g, '').trim();
  },

  // Sanitize URLs
  url: (input: string): string | null => {
    const trimmed = input.trim();
    if (!trimmed) return null;
    
    // Add protocol if missing
    const urlWithProtocol = trimmed.startsWith('http') ? trimmed : `https://${trimmed}`;
    
    if (!validator.isURL(urlWithProtocol, {
      protocols: ['http', 'https'],
      require_protocol: true,
      require_valid_protocol: true,
      allow_underscores: false,
      allow_trailing_dot: false,
      allow_protocol_relative_urls: false
    })) {
      return null;
    }
    
    return urlWithProtocol;
  },

  // Sanitize numeric input
  number: (input: string): number | null => {
    const num = parseFloat(input.replace(/[^\d.-]/g, ''));
    return isNaN(num) ? null : num;
  }
};

// Validation utilities
export const validate = {
  required: (value: string): boolean => {
    return value.trim().length > 0;
  },

  minLength: (value: string, min: number): boolean => {
    return value.trim().length >= min;
  },

  maxLength: (value: string, max: number): boolean => {
    return value.trim().length <= max;
  },

  email: (value: string): boolean => {
    return validator.isEmail(value.trim());
  },

  url: (value: string): boolean => {
    if (!value.trim()) return true; // Optional field
    const urlWithProtocol = value.startsWith('http') ? value : `https://${value}`;
    return validator.isURL(urlWithProtocol);
  },

  phone: (value: string): boolean => {
    if (!value.trim()) return true; // Optional field
    return validator.isMobilePhone(value.replace(/[^\d]/g, ''), 'any');
  }
};

// Rate limiting for form submissions
class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  private readonly maxAttempts: number;
  private readonly windowMs: number;

  constructor(maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(identifier) || [];
    
    // Remove old attempts outside the window
    const recentAttempts = attempts.filter(time => now - time < this.windowMs);
    
    if (recentAttempts.length >= this.maxAttempts) {
      return false;
    }

    // Add current attempt
    recentAttempts.push(now);
    this.attempts.set(identifier, recentAttempts);
    
    return true;
  }

  getRemainingTime(identifier: string): number {
    const attempts = this.attempts.get(identifier) || [];
    if (attempts.length < this.maxAttempts) return 0;
    
    const oldestAttempt = Math.min(...attempts);
    const timeUntilReset = this.windowMs - (Date.now() - oldestAttempt);
    
    return Math.max(0, Math.ceil(timeUntilReset / 1000));
  }
}

export const formRateLimiter = new RateLimiter(3, 10 * 60 * 1000); // 3 attempts per 10 minutes

// Content Security Policy helpers
export const cspHeaders = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https://images.pexels.com https:",
    "font-src 'self'",
    "connect-src 'self' https:",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; ')
};

// Secure storage utilities
export const secureStorage = {
  set: (key: string, value: any): void => {
    try {
      const sanitizedKey = sanitizeInput.text(key);
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(sanitizedKey, serializedValue);
    } catch (error) {
      console.error('Failed to save to secure storage:', error);
    }
  },

  get: (key: string): any => {
    try {
      const sanitizedKey = sanitizeInput.text(key);
      const item = localStorage.getItem(sanitizedKey);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Failed to read from secure storage:', error);
      return null;
    }
  },

  remove: (key: string): void => {
    try {
      const sanitizedKey = sanitizeInput.text(key);
      localStorage.removeItem(sanitizedKey);
    } catch (error) {
      console.error('Failed to remove from secure storage:', error);
    }
  }
};