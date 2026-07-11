/**
 * @fileoverview Unit tests for js/app.js
 * Tests escapeHtml, formatAIResponse, showToast DOM creation,
 * navigation state management, and AppState structure.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load security.js first
const securitySource = fs.readFileSync(
  path.resolve(__dirname, '../../js/security.js'), 'utf8'
);
// eslint-disable-next-line no-new-func
new Function(securitySource)();

// Load app.js — it writes to window.* globals
const appSource = fs.readFileSync(
  path.resolve(__dirname, '../../js/app.js'), 'utf8'
);

// We only need the utility functions — skip DOM-dependent DOMContentLoaded
// by stripping the event listener block for unit test purposes
const strippedApp = appSource.replace(
  /document\.addEventListener\('DOMContentLoaded'[\s\S]*?\}\s*\);/,
  '// DOMContentLoaded stripped for unit tests'
);

// eslint-disable-next-line no-new-func
new Function(strippedApp)();

// ---------------------------------------------------------------------------
// escapeHtml (globally re-exported from app.js, delegates to Security)
// ---------------------------------------------------------------------------
describe('escapeHtml (app.js)', () => {
  it('escapes < > characters', () => {
    expect(globalThis.escapeHtml('<div>')).toBe('&lt;div&gt;');
  });

  it('blocks XSS script injection', () => {
    expect(globalThis.escapeHtml('<script>alert(1)</script>')).not.toContain('<script>');
  });

  it('returns empty string for null', () => {
    expect(globalThis.escapeHtml(null)).toBe('');
  });

  it('escapes quotes to prevent attribute injection', () => {
    const result = globalThis.escapeHtml('" onload="alert(1)');
    expect(result).not.toContain('"');
  });
});

// ---------------------------------------------------------------------------
// formatAIResponse
// ---------------------------------------------------------------------------
describe('formatAIResponse', () => {
  it('converts **text** to <strong>text</strong>', () => {
    expect(globalThis.formatAIResponse('**bold**')).toBe('<strong>bold</strong>');
  });

  it('converts *text* to <em>text</em>', () => {
    expect(globalThis.formatAIResponse('*italic*')).toBe('<em>italic</em>');
  });

  it('converts newlines to <br>', () => {
    expect(globalThis.formatAIResponse('line1\nline2')).toBe('line1<br>line2');
  });

  it('handles empty string without throwing', () => {
    expect(globalThis.formatAIResponse('')).toBe('');
  });

  it('handles null without throwing', () => {
    expect(() => globalThis.formatAIResponse(null)).not.toThrow();
  });

  it('does not alter plain text with no markdown', () => {
    const plain = 'Hello World';
    expect(globalThis.formatAIResponse(plain)).toBe(plain);
  });

  it('converts heading syntax (# text) to <strong>', () => {
    const result = globalThis.formatAIResponse('# Section Title');
    expect(result).toContain('<strong>');
    expect(result).toContain('Section Title');
  });
});

// ---------------------------------------------------------------------------
// AppState structure
// ---------------------------------------------------------------------------
describe('AppState', () => {
  it('is exposed on globalThis', () => {
    expect(globalThis.AppState).toBeDefined();
  });

  it('has currentPage defaulting to dashboard', () => {
    expect(globalThis.AppState.currentPage).toBe('dashboard');
  });

  it('has _pageIntervals array', () => {
    expect(Array.isArray(globalThis.AppState._pageIntervals)).toBe(true);
  });

  it('has sidebarOpen defaulting to false', () => {
    expect(globalThis.AppState.sidebarOpen).toBe(false);
  });

  it('has notifications array', () => {
    expect(Array.isArray(globalThis.AppState.notifications)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// PAGES registry
// ---------------------------------------------------------------------------
describe('PAGES registry', () => {
  const expectedPages = [
    'dashboard', 'navigation', 'crowd', 'accessibility',
    'transport', 'sustainability', 'multilingual', 'operations',
    'decision', 'settings',
  ];

  expectedPages.forEach((pageId) => {
    it(`has "${pageId}" page registered`, () => {
      expect(globalThis.PAGES[pageId]).toBeDefined();
      expect(globalThis.PAGES[pageId].title).toBeTruthy();
      expect(globalThis.PAGES[pageId].component).toBeTruthy();
    });
  });
});

// ---------------------------------------------------------------------------
// showToast — requires DOM
// ---------------------------------------------------------------------------
describe('showToast', () => {
  beforeEach(() => {
    // Create a toast container in JSDOM
    document.body.innerHTML = '<div id="toastContainer"></div>';
  });

  it('adds a toast element to the container', () => {
    globalThis.showToast('Test message', 'info', 100);
    const container = document.getElementById('toastContainer');
    expect(container.children.length).toBeGreaterThan(0);
  });

  it('assigns the correct CSS class for success type', () => {
    globalThis.showToast('Success!', 'success', 100);
    const toast = document.querySelector('.toast');
    expect(toast.classList.contains('success')).toBe(true);
  });

  it('assigns the correct CSS class for error type', () => {
    globalThis.showToast('Error!', 'error', 100);
    const toast = document.querySelector('.toast.error');
    expect(toast).not.toBeNull();
  });

  it('uses role="alert" for error type', () => {
    globalThis.showToast('Critical error', 'error', 100);
    const toast = document.querySelector('.toast.error');
    expect(toast.getAttribute('role')).toBe('alert');
  });

  it('uses role="status" for info type', () => {
    globalThis.showToast('Info message', 'info', 100);
    const toast = document.querySelector('.toast.info');
    expect(toast.getAttribute('role')).toBe('status');
  });

  it('does not throw if container is absent', () => {
    document.body.innerHTML = ''; // Remove container
    expect(() => globalThis.showToast('Test', 'info')).not.toThrow();
  });

  it('escapes HTML in the message to prevent XSS', () => {
    globalThis.showToast('<img src=x onerror=alert(1)>', 'info', 100);
    const toast = document.querySelector('.toast');
    expect(toast.innerHTML).not.toContain('<img');
  });
});

// ---------------------------------------------------------------------------
// registerPageInterval
// ---------------------------------------------------------------------------
describe('registerPageInterval', () => {
  it('adds interval ID to AppState._pageIntervals', () => {
    const before = globalThis.AppState._pageIntervals.length;
    const id = globalThis.registerPageInterval(() => {}, 10000);
    const after = globalThis.AppState._pageIntervals.length;
    expect(after).toBe(before + 1);
    expect(globalThis.AppState._pageIntervals).toContain(id);
    clearInterval(id);
  });
});
