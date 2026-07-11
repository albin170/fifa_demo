/**
 * @fileoverview Unit tests for js/security.js
 * Tests all public Security module APIs: escapeHtml, sanitizeInput,
 * sanitizeAIResponse, validateApiKey, rateLimiter, and isSafeUrl.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

// Load the module under test by evaluating it in the JSDOM window context
// (security.js writes to window.Security)
const fs = await import('fs');
const path = await import('path');
const { fileURLToPath } = await import('url');
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const securitySource = fs.readFileSync(
  path.resolve(__dirname, '../../js/security.js'),
  'utf8'
);

// Execute in the test environment to populate globalThis.Security
// eslint-disable-next-line no-new-func
new Function(securitySource)();

const Security = globalThis.Security;

// ---------------------------------------------------------------------------
// escapeHtml
// ---------------------------------------------------------------------------
describe('Security.escapeHtml', () => {
  it('escapes < and > characters', () => {
    expect(Security.escapeHtml('<script>')).toBe('&lt;script&gt;');
  });

  it('escapes double quotes', () => {
    expect(Security.escapeHtml('"hello"')).toBe('&quot;hello&quot;');
  });

  it('escapes single quotes', () => {
    expect(Security.escapeHtml("it's")).toBe('it&#39;s');
  });

  it('escapes ampersands first to prevent double-encoding', () => {
    expect(Security.escapeHtml('a & b')).toBe('a &amp; b');
  });

  it('handles null input gracefully', () => {
    expect(Security.escapeHtml(null)).toBe('');
  });

  it('handles undefined input gracefully', () => {
    expect(Security.escapeHtml(undefined)).toBe('');
  });

  it('returns empty string for empty input', () => {
    expect(Security.escapeHtml('')).toBe('');
  });

  it('blocks XSS attack pattern: onerror attribute', () => {
    const input = '<img src=x onerror=alert(1)>';
    const result = Security.escapeHtml(input);
    // The escaped output must not contain a raw unescaped < which would be executable HTML
    expect(result).not.toContain('<img');
    // The tag chars should be escaped to &lt; and &gt;
    expect(result).toContain('&lt;');
    expect(result).toContain('&gt;');
  });

  it('blocks javascript: protocol XSS', () => {
    const input = '<a href="javascript:alert(1)">click</a>';
    expect(Security.escapeHtml(input)).not.toContain('<a');
  });

  it('does not alter safe plain text', () => {
    expect(Security.escapeHtml('Hello, World!')).toBe('Hello, World!');
  });
});

// ---------------------------------------------------------------------------
// sanitizeInput
// ---------------------------------------------------------------------------
describe('Security.sanitizeInput', () => {
  it('strips HTML tags from input', () => {
    expect(Security.sanitizeInput('<b>Bold</b>')).toBe('Bold');
  });

  it('strips script tags', () => {
    expect(Security.sanitizeInput('<script>alert(1)</script>')).toBe('alert(1)');
  });

  it('trims whitespace', () => {
    expect(Security.sanitizeInput('  hello  ')).toBe('hello');
  });

  it('truncates to MAX_INPUT_LENGTH (2000 chars)', () => {
    const longInput = 'a'.repeat(3000);
    expect(Security.sanitizeInput(longInput).length).toBe(2000);
  });

  it('returns empty string for null', () => {
    expect(Security.sanitizeInput(null)).toBe('');
  });

  it('handles normal stadium queries without alteration', () => {
    const query = 'Where is Section 104?';
    expect(Security.sanitizeInput(query)).toBe(query);
  });
});

// ---------------------------------------------------------------------------
// sanitizeAIResponse
// ---------------------------------------------------------------------------
describe('Security.sanitizeAIResponse', () => {
  it('removes script tags from AI response', () => {
    const html = '<strong>AI</strong><script>alert(1)</script>';
    expect(Security.sanitizeAIResponse(html)).not.toContain('<script>');
  });

  it('removes iframe tags', () => {
    const html = '<iframe src="evil.com"></iframe>answer';
    expect(Security.sanitizeAIResponse(html)).not.toContain('<iframe');
  });

  it('blocks javascript: in any position', () => {
    const html = 'Click <a href="javascript:alert()">here</a>';
    expect(Security.sanitizeAIResponse(html)).not.toContain('javascript:');
  });

  it('blocks inline event handlers (onclick, onerror, etc.)', () => {
    const html = '<img src="x" onerror="alert(1)">';
    expect(Security.sanitizeAIResponse(html)).not.toMatch(/onerror\s*=/i);
  });

  it('preserves safe markup like strong and br', () => {
    const html = '<strong>Bold</strong><br>';
    expect(Security.sanitizeAIResponse(html)).toContain('<strong>Bold</strong>');
  });

  it('returns empty string for falsy input', () => {
    expect(Security.sanitizeAIResponse('')).toBe('');
    expect(Security.sanitizeAIResponse(null)).toBe('');
  });
});

// ---------------------------------------------------------------------------
// validateApiKey
// ---------------------------------------------------------------------------
describe('Security.validateApiKey', () => {
  it('accepts a valid Gemini key format', () => {
    // Gemini key: AIza followed by exactly 35 chars = 39 total
    const validKey = 'AIza' + 'S'.repeat(35); // 39 chars total
    expect(Security.validateApiKey(validKey)).toBe(true);
  });

  it('rejects null', () => {
    expect(Security.validateApiKey(null)).toBe(false);
  });

  it('rejects empty string', () => {
    expect(Security.validateApiKey('')).toBe(false);
  });

  it('rejects keys that are too short', () => {
    expect(Security.validateApiKey('AIzaShort')).toBe(false);
  });

  it('rejects keys not starting with AIza', () => {
    expect(Security.validateApiKey('Bearer abc123456789012345678901234567890')).toBe(false);
  });

  it('rejects non-string values', () => {
    expect(Security.validateApiKey(12345)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// RateLimiter
// ---------------------------------------------------------------------------
describe('Security.rateLimiter', () => {
  it('allows calls under the rate limit', () => {
    // Fresh limiter — first call should always be allowed
    expect(Security.rateLimiter.isAllowed()).toBe(true);
  });

  it('reports remaining calls decreasing after each call', () => {
    const before = Security.rateLimiter.remaining();
    Security.rateLimiter.isAllowed();
    const after = Security.rateLimiter.remaining();
    // After a call, remaining should be <= before
    expect(after).toBeLessThanOrEqual(before);
  });
});

// ---------------------------------------------------------------------------
// isSafeUrl
// ---------------------------------------------------------------------------
describe('Security.isSafeUrl', () => {
  it('accepts https URLs', () => {
    expect(Security.isSafeUrl('https://aistudio.google.com')).toBe(true);
  });

  it('accepts http URLs', () => {
    expect(Security.isSafeUrl('http://example.com')).toBe(true);
  });

  it('rejects javascript: URLs', () => {
    expect(Security.isSafeUrl('javascript:alert(1)')).toBe(false);
  });

  it('rejects data: URLs', () => {
    expect(Security.isSafeUrl('data:text/html,<h1>XSS</h1>')).toBe(false);
  });

  it('rejects malformed URLs', () => {
    expect(Security.isSafeUrl('not-a-url')).toBe(false);
  });
});
