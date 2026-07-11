/**
 * @fileoverview Unit tests for js/gemini.js
 * Tests fallback response logic, input sanitization before API call,
 * and the streaming/translate function structures.
 * Mocks fetch to avoid real network calls.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load security.js first (gemini depends on window.Security)
const securitySource = fs.readFileSync(
  path.resolve(__dirname, '../../js/security.js'), 'utf8'
);
// eslint-disable-next-line no-new-func
new Function(securitySource)();

// Load gemini.js
const geminiSource = fs.readFileSync(
  path.resolve(__dirname, '../../js/gemini.js'), 'utf8'
);
// eslint-disable-next-line no-new-func
new Function(geminiSource)();

const GeminiAI = globalThis.GeminiAI;

// ---------------------------------------------------------------------------
// generateFallbackResponse (via _generateFallbackResponse)
// ---------------------------------------------------------------------------
describe('GeminiAI._generateFallbackResponse', () => {
  it('is exposed for testing', () => {
    expect(typeof GeminiAI._generateFallbackResponse).toBe('function');
  });

  it('returns navigation response for "where" keyword', () => {
    const result = GeminiAI._generateFallbackResponse('Where is Gate B?', '');
    expect(result).toContain('Navigation');
  });

  it('returns navigation response for "section" keyword', () => {
    const result = GeminiAI._generateFallbackResponse('Find section 104', '');
    expect(result).toContain('Navigation');
  });

  it('returns transport response for "metro" keyword', () => {
    const result = GeminiAI._generateFallbackResponse('What time does the metro run?', '');
    expect(result).toContain('Transport');
  });

  it('returns transport response for "shuttle" keyword', () => {
    const result = GeminiAI._generateFallbackResponse('Shuttle schedule?', '');
    expect(result).toContain('Transport');
  });

  it('returns crowd response for "crowd" keyword', () => {
    const result = GeminiAI._generateFallbackResponse('Is the crowd dense?', '');
    expect(result).toContain('Crowd');
  });

  it('returns food response for "food" keyword', () => {
    // Avoid 'where' which would match navigation first
    const result = GeminiAI._generateFallbackResponse('I want to eat food at the stadium', '');
    expect(result).toContain('Amenity');
  });

  it('returns food response for "restroom" keyword', () => {
    const result = GeminiAI._generateFallbackResponse('I need the restroom', '');
    expect(result).toContain('Amenity');
  });

  it('returns accessibility response for "wheelchair" keyword', () => {
    const result = GeminiAI._generateFallbackResponse('Wheelchair access?', '');
    expect(result).toContain('Accessibility');
  });

  it('returns sustainability response for "eco" keyword', () => {
    const result = GeminiAI._generateFallbackResponse('Eco options?', '');
    expect(result).toContain('Sustainability');
  });

  it('returns sustainability response for "carbon" keyword', () => {
    const result = GeminiAI._generateFallbackResponse('Carbon footprint?', '');
    expect(result).toContain('Sustainability');
  });

  it('returns default response for unrecognised query', () => {
    const result = GeminiAI._generateFallbackResponse('zxqwerty123', '');
    expect(result).toContain('StadiumIQ AI');
  });

  it('handles empty prompt without throwing', () => {
    expect(() => GeminiAI._generateFallbackResponse('', '')).not.toThrow();
  });

  it('handles null prompt without throwing', () => {
    expect(() => GeminiAI._generateFallbackResponse(null, '')).not.toThrow();
  });
});

// ---------------------------------------------------------------------------
// callGemini — with mocked fetch
// ---------------------------------------------------------------------------
describe('GeminiAI.call', () => {
  beforeEach(() => {
    globalThis.fetch = vi.fn();
    // Use valid 39-char key: AIza + 35 chars
    const validKey = 'AIza' + 'S'.repeat(35);
    globalThis.AppState = { apiKey: validKey };
    globalThis.Security.getActiveApiKey = () => validKey;
    globalThis.Security.validateApiKey = () => true; // Bypass format check in tests
    globalThis.Security.rateLimiter = { isAllowed: () => true, remaining: () => 19 };
  });

  afterEach(() => {
    vi.restoreAllMocks();
    globalThis.AppState = { apiKey: '' };
  });

  it('returns AI text on successful API response', async () => {
    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        candidates: [{ content: { parts: [{ text: 'Gate B is to your left.' }] } }],
      }),
    });

    const result = await GeminiAI.call('Where is Gate B?', 'navigation');
    expect(result).toBe('Gate B is to your left.');
  });

  it('falls back when API returns non-OK status', async () => {
    globalThis.fetch.mockResolvedValueOnce({
      ok: false,
      status: 429,
      json: async () => ({ error: { message: 'Rate limited' } }),
    });

    const result = await GeminiAI.call('Where is Gate B?', '');
    // Should return a fallback (contains navigation keywords since "Gate" is in prompt)
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(10);
  });

  it('falls back on network error', async () => {
    globalThis.fetch.mockRejectedValueOnce(new Error('Network error'));

    const result = await GeminiAI.call('shuttle schedule', '');
    expect(result).toContain('Transport');
  });

  it('falls back when response has no text candidate', async () => {
    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ candidates: [] }),
    });

    const result = await GeminiAI.call('test query', '');
    expect(typeof result).toBe('string');
  });
});

// ---------------------------------------------------------------------------
// translateText
// ---------------------------------------------------------------------------
describe('GeminiAI.translate', () => {
  it('is a function', () => {
    expect(typeof GeminiAI.translate).toBe('function');
  });

  it('returns a Promise', () => {
    // Patch fetch to avoid real call
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false, status: 503,
      json: async () => ({}),
    });
    const result = GeminiAI.translate('Hello', 'Spanish');
    expect(result instanceof Promise).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// GeminiAI public API surface
// ---------------------------------------------------------------------------
describe('GeminiAI public API', () => {
  it('exposes call function', () => expect(typeof GeminiAI.call).toBe('function'));
  it('exposes stream function', () => expect(typeof GeminiAI.stream).toBe('function'));
  it('exposes analyzeStadium function', () => expect(typeof GeminiAI.analyzeStadium).toBe('function'));
  it('exposes translate function', () => expect(typeof GeminiAI.translate).toBe('function'));
  it('exposes generateRoute function', () => expect(typeof GeminiAI.generateRoute).toBe('function'));
  it('exposes analyzeCrowdSafety function', () => expect(typeof GeminiAI.analyzeCrowdSafety).toBe('function'));
  it('exposes getSustainabilityInsights function', () => expect(typeof GeminiAI.getSustainabilityInsights).toBe('function'));
});
