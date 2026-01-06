import { z } from 'zod';

// ============= Input Validation Schemas =============

// Contact form validation
export const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s\-'.]+$/, 'Name contains invalid characters'),
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Invalid email address')
    .max(255, 'Email must be less than 255 characters'),
  message: z
    .string()
    .trim()
    .min(1, 'Message is required')
    .max(2000, 'Message must be less than 2000 characters'),
});

// Testimonial/Feedback form validation
export const feedbackFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s\-'.]+$/, 'Name contains invalid characters'),
  stars: z
    .number()
    .int()
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating must be at most 5'),
  feedback: z
    .string()
    .trim()
    .min(1, 'Feedback is required')
    .max(1000, 'Feedback must be less than 1000 characters'),
});

// Hire request form validation
export const hireRequestSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s\-'.]+$/, 'Name contains invalid characters'),
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Invalid email address')
    .max(255, 'Email must be less than 255 characters'),
  message: z
    .string()
    .trim()
    .min(1, 'Message is required')
    .max(2000, 'Message must be less than 2000 characters'),
});

// Auth form validation
export const authFormSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Invalid email address')
    .max(255, 'Email must be less than 255 characters'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(128, 'Password must be less than 128 characters'),
});

// ============= Sanitization Functions =============

/**
 * Sanitizes a string by removing potentially dangerous characters
 * while preserving safe content for display
 */
export const sanitizeString = (input: string): string => {
  if (!input || typeof input !== 'string') return '';
  
  return input
    .trim()
    // Remove null bytes
    .replace(/\0/g, '')
    // Remove potential script tags
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove event handlers
    .replace(/on\w+\s*=/gi, '')
    // Remove javascript: protocol
    .replace(/javascript:/gi, '')
    // Remove data: protocol for non-images
    .replace(/data:(?!image\/)/gi, '')
    // Escape HTML entities
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
};

/**
 * Sanitizes input for safe display (less aggressive, preserves more content)
 */
export const sanitizeForDisplay = (input: string): string => {
  if (!input || typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/\0/g, '')
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=/gi, '');
};

/**
 * Validates and sanitizes email for use in mailto links
 */
export const sanitizeEmail = (email: string): string => {
  if (!email || typeof email !== 'string') return '';
  
  const trimmed = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(trimmed)) return '';
  
  return encodeURIComponent(trimmed);
};

/**
 * Validates and sanitizes URL for external links
 */
export const sanitizeUrl = (url: string): string => {
  if (!url || typeof url !== 'string') return '#';
  
  const trimmed = url.trim();
  
  // Only allow http, https, and mailto protocols
  const allowedProtocols = ['http:', 'https:', 'mailto:'];
  
  try {
    const parsed = new URL(trimmed);
    if (!allowedProtocols.includes(parsed.protocol)) {
      return '#';
    }
    return trimmed;
  } catch {
    // If it's a relative URL starting with /, allow it
    if (trimmed.startsWith('/')) {
      return trimmed;
    }
    return '#';
  }
};

// ============= Rate Limiting (Client-side) =============

interface RateLimitEntry {
  count: number;
  firstRequest: number;
}

const rateLimitStore: Map<string, RateLimitEntry> = new Map();

/**
 * Simple client-side rate limiting
 * @param key - Unique identifier for the action
 * @param maxAttempts - Maximum attempts allowed
 * @param windowMs - Time window in milliseconds
 * @returns true if allowed, false if rate limited
 */
export const checkRateLimit = (
  key: string,
  maxAttempts: number = 5,
  windowMs: number = 60000
): boolean => {
  const now = Date.now();
  const entry = rateLimitStore.get(key);
  
  if (!entry) {
    rateLimitStore.set(key, { count: 1, firstRequest: now });
    return true;
  }
  
  // Reset if window has passed
  if (now - entry.firstRequest > windowMs) {
    rateLimitStore.set(key, { count: 1, firstRequest: now });
    return true;
  }
  
  // Check if limit exceeded
  if (entry.count >= maxAttempts) {
    return false;
  }
  
  // Increment count
  entry.count += 1;
  rateLimitStore.set(key, entry);
  return true;
};

/**
 * Get remaining time until rate limit resets
 */
export const getRateLimitResetTime = (key: string, windowMs: number = 60000): number => {
  const entry = rateLimitStore.get(key);
  if (!entry) return 0;
  
  const elapsed = Date.now() - entry.firstRequest;
  return Math.max(0, windowMs - elapsed);
};

// ============= Content Security =============

/**
 * Validates that content doesn't exceed maximum length
 */
export const validateContentLength = (
  content: string,
  maxLength: number
): { valid: boolean; message?: string } => {
  if (!content) return { valid: true };
  
  if (content.length > maxLength) {
    return {
      valid: false,
      message: `Content exceeds maximum length of ${maxLength} characters`,
    };
  }
  
  return { valid: true };
};

/**
 * Checks for potential spam content
 */
export const checkForSpam = (content: string): boolean => {
  if (!content) return false;
  
  const spamPatterns = [
    /\b(buy now|click here|act now|limited time|winner|congratulations|you've won)\b/gi,
    /(https?:\/\/[^\s]+){5,}/gi, // Multiple URLs
    /(.)\1{10,}/g, // Repeated characters
    /\b[A-Z]{20,}\b/g, // Long uppercase strings
  ];
  
  return spamPatterns.some((pattern) => pattern.test(content));
};

// ============= Form Validation Helper =============

export type ValidationResult<T> = 
  | { success: true; data: T }
  | { success: false; errors: Record<string, string> };

/**
 * Validates form data against a Zod schema
 */
export const validateForm = <T>(
  schema: z.ZodSchema<T>,
  data: unknown
): ValidationResult<T> => {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  const errors: Record<string, string> = {};
  result.error.errors.forEach((err) => {
    const path = err.path.join('.');
    errors[path] = err.message;
  });
  
  return { success: false, errors };
};

// ============= Security Headers Check =============

/**
 * Logs security warnings in development
 */
export const logSecurityCheck = (): void => {
  if (import.meta.env.DEV) {
    console.info('[Security] Client-side security utilities loaded');
  }
};

// Initialize security check on load
logSecurityCheck();
