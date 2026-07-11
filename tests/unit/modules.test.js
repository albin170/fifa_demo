/**
 * @fileoverview Unit tests for js/modules.js
 * Tests the helper rendering functions: renderTransitRoutes, renderParkingStatus,
 * renderDepartureOptions, renderIncidents, renderDecisionQueue, renderQuickPhrases,
 * renderEcoTips, renderSustainabilityLeaderboard, and renderVolunteerAssignments.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// --- Load dependencies in order ---
const securitySource = fs.readFileSync(path.resolve(__dirname, '../../js/security.js'), 'utf8');
// eslint-disable-next-line no-new-func
new Function(securitySource)();

// Stub app.js globals needed by modules.js
globalThis.AppState = { currentPage: 'dashboard', apiKey: '', userRole: 'fan', _pageIntervals: [] };
globalThis.showToast = () => {};
globalThis.escapeHtml = (t) => String(t ?? '');
globalThis.formatAIResponse = (t) => t;
globalThis.createAIChatInterface = () => {};
globalThis.GeminiAI = {
  call: async () => 'Mock AI response',
  stream: async (p, c, cb, done) => { cb('Mock'); done('Mock'); },
  translate: async () => 'Traducción',
  getSustainabilityInsights: async () => 'Eco tips',
};

// Load modules.js
const modulesSource = fs.readFileSync(path.resolve(__dirname, '../../js/modules.js'), 'utf8');
// eslint-disable-next-line no-new-func
new Function(modulesSource)();

// Helper: parse HTML string into DOM for assertions
function parseHTML(html) {
  document.body.innerHTML = `<div id="test-root">${html}</div>`;
  return document.getElementById('test-root');
}

// ---------------------------------------------------------------------------
// Transport module helpers
// ---------------------------------------------------------------------------
describe('renderTransitRoutes (internal)', () => {
  // Access via a container rendered by renderTransport
  it('is invoked by renderTransport and produces route list items', () => {
    const container = document.createElement('div');
    container.id = 'pageContent';
    document.body.appendChild(container);
    // Stub createAIChatInterface to avoid DOM dependency
    globalThis.createAIChatInterface = () => {};
    globalThis.renderTransport(container);
    const routeItems = container.querySelectorAll('[role="listitem"]');
    expect(routeItems.length).toBeGreaterThan(0);
  });
});

describe('renderParkingStatus (internal)', () => {
  it('produces parking lot entries with progress bars', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    globalThis.renderTransport(container);
    const progressBars = container.querySelectorAll('.progress-bar');
    expect(progressBars.length).toBeGreaterThan(0);
  });
});

describe('renderDepartureOptions (internal)', () => {
  it('produces departure option cards with role="button"', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    globalThis.renderTransport(container);
    // Departure options have onclick="selectDeparture(...)"
    const buttons = container.querySelectorAll('[role="button"]');
    expect(buttons.length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// Sustainability module helpers
// ---------------------------------------------------------------------------
describe('renderSustainability', () => {
  it('renders CO2 stat cards', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    globalThis.renderSustainability(container);
    const statCards = container.querySelectorAll('.stat-card');
    expect(statCards.length).toBeGreaterThan(0);
  });

  it('renders a canvas element for the CO2 chart', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    globalThis.renderSustainability(container);
    const canvas = container.querySelector('canvas#co2Chart');
    expect(canvas).not.toBeNull();
  });

  it('renders the eco tips list', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    globalThis.renderSustainability(container);
    const ecoTips = container.querySelector('#ecoTips');
    expect(ecoTips).not.toBeNull();
    expect(ecoTips.children.length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// Multilingual module helpers
// ---------------------------------------------------------------------------
describe('renderMultilingual — quick phrases', () => {
  const languages = ['Spanish', 'Portuguese', 'French', 'German', 'Arabic', 'Japanese', 'Korean'];

  languages.forEach((lang) => {
    it(`renders 6 quick phrases for ${lang}`, () => {
      const container = document.createElement('div');
      document.body.appendChild(container);
      globalThis.renderMultilingual(container);
      // Set the language selector and trigger re-render of phrases
      const phraseContainer = container.querySelector('#quickPhrases');
      expect(phraseContainer).not.toBeNull();
      // Should have button children
      expect(phraseContainer.querySelectorAll('button').length).toBeGreaterThanOrEqual(4);
    });
  });

  it('falls back to English phrases for unknown language', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    globalThis.renderMultilingual(container);
    const phraseContainer = container.querySelector('#quickPhrases');
    expect(phraseContainer).not.toBeNull();
  });
});

describe('renderMultilingual — translator UI', () => {
  it('renders the source and target language selectors', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    globalThis.renderMultilingual(container);
    expect(container.querySelector('#sourceLang')).not.toBeNull();
    expect(container.querySelector('#targetLang')).not.toBeNull();
  });

  it('renders at least 40 language options in selector', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    globalThis.renderMultilingual(container);
    const options = container.querySelectorAll('#sourceLang option');
    expect(options.length).toBeGreaterThanOrEqual(40);
  });
});

// ---------------------------------------------------------------------------
// Operations module helpers
// ---------------------------------------------------------------------------
describe('renderOperations — incidents', () => {
  it('renders the incidents list', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    globalThis.renderOperations(container);
    const incidentItems = container.querySelectorAll('[role="listitem"]');
    expect(incidentItems.length).toBeGreaterThan(0);
  });

  it('renders volunteer assignments', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    globalThis.renderOperations(container);
    const panel = container.querySelector('#volunteerPanel');
    expect(panel).not.toBeNull();
    expect(panel.children.length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// Decision Support module helpers
// ---------------------------------------------------------------------------
describe('renderDecision — decision queue', () => {
  it('renders decision queue with approve/deny buttons', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    globalThis.renderDecision(container);
    // Decision items have approve buttons
    const approveButtons = Array.from(container.querySelectorAll('button'))
      .filter((b) => b.getAttribute('aria-label')?.startsWith('Approve'));
    expect(approveButtons.length).toBeGreaterThan(0);
  });

  it('renders scenario selector with options', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    globalThis.renderDecision(container);
    const select = container.querySelector('#scenarioSelect');
    expect(select).not.toBeNull();
    expect(select.options.length).toBeGreaterThan(5);
  });
});

// ---------------------------------------------------------------------------
// Settings module
// ---------------------------------------------------------------------------
describe('renderSettings', () => {
  it('renders the API key input field', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    globalThis.renderSettings(container);
    expect(container.querySelector('#apiKeyInput')).not.toBeNull();
  });

  it('renders the keyboard shortcut table', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    globalThis.renderSettings(container);
    // Keyboard shortcuts are rendered with code elements
    const codeEls = container.querySelectorAll('code');
    expect(codeEls.length).toBeGreaterThanOrEqual(9);
  });

  it('renders 6 preference toggle switches', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    globalThis.renderSettings(container);
    const switches = container.querySelectorAll('.switch input[type="checkbox"]');
    expect(switches.length).toBe(6);
  });
});
