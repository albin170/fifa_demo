/**
 * @fileoverview Test setup — configures the JSDOM environment so that
 * browser globals (localStorage, window, document) are available for
 * all unit tests. Runs before every test file.
 */

// Provide localStorage stub for JSDOM
if (!globalThis.localStorage) {
  const store = {};
  globalThis.localStorage = {
    getItem: (k) => store[k] ?? null,
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; },
    clear: () => { Object.keys(store).forEach((k) => delete store[k]); },
  };
}

// Provide window.AppState stub used by Security module
globalThis.AppState = { apiKey: '' };

// Silence console.warn and console.error noise in tests
// (they are tested explicitly where needed)
globalThis.console = {
  ...console,
  warn: () => {},
  error: () => {},
};
