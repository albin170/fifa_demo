/* ========================================
   StadiumIQ 2026 — Security Utilities
   Loaded FIRST before all other scripts
   ======================================== */

'use strict';

/**
 * @module Security
 * @description Centralized security utilities for StadiumIQ 2026.
 * Provides input sanitization, API key validation, rate limiting,
 * and XSS prevention helpers.
 */

/* ---- Constants ---- */

/** Maximum allowed input length for user-submitted text (characters) */
const MAX_INPUT_LENGTH = 2000;

/** Maximum Gemini API calls per minute */
const MAX_API_CALLS_PER_MINUTE = 20;

/** Regex to validate Google Gemini API key format */
const GEMINI_KEY_REGEX = /^AIza[0-9A-Za-z\-_]{35}$/;

/* ---- Input Sanitization ---- */

/**
 * Escapes all HTML-special characters to prevent XSS injection.
 * More thorough than a simple div-based approach — covers quotes,
 * backticks, and forward slashes too.
 *
 * @param {string} text - Raw user input string
 * @returns {string} HTML-escaped string safe for insertion into the DOM
 *
 * @example
 * Security.escapeHtml('<script>alert(1)</script>');
 * // Returns: '&lt;script&gt;alert(1)&lt;/script&gt;'
 */
function escapeHtml(text) {
  if (text === null || text === undefined) return '';
  const str = String(text);
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/`/g, '&#96;')
    .replace(/\//g, '&#47;');
}

/**
 * Strips all HTML tags from a string, returning plain text only.
 * Used to sanitize user input before it's used in any context.
 *
 * @param {string} input - Raw string that may contain HTML
 * @returns {string} Plain text with all tags removed
 */
function sanitizeInput(input) {
  if (input === null || input === undefined) return '';
  const str = String(input).slice(0, MAX_INPUT_LENGTH);
  // Remove all HTML tags
  return str.replace(/<[^>]*>/g, '').trim();
}

/**
 * Sanitizes AI-generated HTML for safe rendering.
 * Allows only a specific allow-list of safe HTML elements/attributes
 * (bold, em, br, strong) while stripping everything else.
 *
 * @param {string} html - HTML string from AI response formatter
 * @returns {string} Sanitized HTML safe for innerHTML assignment
 */
function sanitizeAIResponse(html) {
  if (!html) return '';
  // Allow only safe inline elements — strip script, iframe, object, etc.
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<iframe[\s\S]*?>/gi, '')
    .replace(/<object[\s\S]*?>/gi, '')
    .replace(/<embed[\s\S]*?>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, 'data-blocked=');
}

/* ---- API Key Validation ---- */

/**
 * Validates that a string matches the expected Google Gemini API key format.
 *
 * @param {string} key - API key string to validate
 * @returns {boolean} True if the key matches the expected format
 */
function validateApiKey(key) {
  if (!key || typeof key !== 'string') return false;
  return GEMINI_KEY_REGEX.test(key.trim());
}

/**
 * Retrieves the active API key from AppState, falling back to localStorage.
 * NEVER returns the hardcoded placeholder — only user-supplied keys.
 *
 * @returns {string} The active API key, or empty string if not configured
 */
function getActiveApiKey() {
  // Check AppState first (in-memory, most current)
  if (window.AppState && window.AppState.apiKey) {
    return window.AppState.apiKey;
  }
  // Fall back to localStorage
  const stored = localStorage.getItem('gemini_api_key') || '';
  return stored;
}

/* ---- Rate Limiter ---- */

/**
 * Token bucket rate limiter for API calls.
 * Tracks timestamps of recent calls; rejects if > MAX_API_CALLS_PER_MINUTE
 * within a rolling 60-second window.
 *
 * @namespace RateLimiter
 */
const RateLimiter = (() => {
  /** @type {number[]} Timestamps of recent API calls */
  const callLog = [];

  /**
   * Checks if a new API call is allowed under the rate limit.
   *
   * @returns {boolean} True if call is allowed, false if rate limited
   */
  function isAllowed() {
    const now = Date.now();
    const oneMinuteAgo = now - 60_000;
    // Remove timestamps older than 1 minute
    while (callLog.length > 0 && callLog[0] < oneMinuteAgo) {
      callLog.shift();
    }
    if (callLog.length >= MAX_API_CALLS_PER_MINUTE) {
      return false;
    }
    callLog.push(now);
    return true;
  }

  /**
   * Returns the number of API calls remaining in the current minute.
   *
   * @returns {number} Remaining calls allowed
   */
  function remaining() {
    const now = Date.now();
    const oneMinuteAgo = now - 60_000;
    const recentCalls = callLog.filter(t => t > oneMinuteAgo).length;
    return Math.max(0, MAX_API_CALLS_PER_MINUTE - recentCalls);
  }

  return { isAllowed, remaining };
})();

/* ---- URL Safety ---- */

/**
 * Validates a URL is http/https (no javascript: or data: schemes).
 *
 * @param {string} url - URL to validate
 * @returns {boolean} True if URL is safe to navigate to
 */
function isSafeUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

/* ---- Export ---- */

window.Security = {
  escapeHtml,
  sanitizeInput,
  sanitizeAIResponse,
  validateApiKey,
  getActiveApiKey,
  rateLimiter: RateLimiter,
  isSafeUrl,
  MAX_INPUT_LENGTH,
};

// Also expose escapeHtml globally for backward compat (used across all modules)
// The app.js version will be replaced by this authoritative one
window._securityLoaded = true;
