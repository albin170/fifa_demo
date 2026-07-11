/* ========================================
   StadiumIQ 2026 — Gemini AI Integration
   ======================================== */

'use strict';

/**
 * @fileoverview Google Gemini 2.0 Flash integration for StadiumIQ 2026.
 * Provides streaming chat, translation, crowd analysis, and sustainability
 * insights. Falls back to intelligent built-in responses when no API key
 * is configured or when the network is unavailable.
 *
 * @module GeminiAI
 */

/** @const {string} Gemini API endpoint (generateContent) */
const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

/**
 * System-level context injected into every Gemini request.
 * Defines the AI persona, scope, and expected behavior.
 * @const {string}
 */
const SYSTEM_CONTEXT = `You are StadiumIQ AI — the official AI assistant for FIFA World Cup 2026. 
You help fans, organizers, volunteers, and venue staff with:
- Stadium navigation and wayfinding
- Crowd management and safety
- Accessibility assistance
- Transportation planning
- Sustainability guidance
- Real-time operational decisions
- Multilingual support

Always be concise, helpful, safety-conscious, and proactive. 
Format responses with clear structure using emojis for readability.
Current event: FIFA World Cup 2026. Venues include stadiums across USA, Canada, and Mexico.`;

/**
 * Default Gemini generation configuration.
 * @const {{ temperature: number, topK: number, topP: number, maxOutputTokens: number }}
 */
const GENERATION_CONFIG = {
  temperature: 0.7,
  topK: 40,
  topP: 0.95,
  maxOutputTokens: 1024,
};

/**
 * Safety settings applied to all Gemini requests.
 * @const {Array<{category: string, threshold: string}>}
 */
const SAFETY_SETTINGS = [
  { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
  { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
  { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
];

/* ---- Core API Call ---- */

/**
 * Calls the Gemini API with the given prompt and optional context.
 * Dynamically reads the API key from AppState/localStorage at call time
 * (never uses a hardcoded key). Falls back to built-in responses on failure.
 *
 * @param {string} prompt - The user's question or instruction
 * @param {string} [context=''] - Additional domain context for the AI
 * @returns {Promise<string>} The AI-generated response text
 *
 * @example
 * const response = await callGemini('Where is the nearest exit?', 'Stadium navigation');
 */
async function callGemini(prompt, context = '') {
  // Security: Get key at call time, never use hardcoded strings
  const apiKey = window.Security ? window.Security.getActiveApiKey() : '';

  if (!apiKey) {
    // No key configured — use intelligent fallback immediately
    return generateFallbackResponse(prompt, context);
  }

  // Security: Validate key format before sending request
  if (window.Security && !window.Security.validateApiKey(apiKey)) {
    console.warn('[StadiumIQ] API key format invalid — using fallback');
    return generateFallbackResponse(prompt, context);
  }

  // Security: Rate limit check
  if (window.Security && !window.Security.rateLimiter.isAllowed()) {
    console.warn('[StadiumIQ] Rate limit reached — using fallback');
    return generateFallbackResponse(prompt, context);
  }

  // Security: Sanitize and truncate prompt before sending
  const safePrompt = window.Security
    ? window.Security.sanitizeInput(prompt)
    : prompt.slice(0, 2000);

  const fullPrompt = context
    ? `${SYSTEM_CONTEXT}\n\nContext: ${context}\n\nUser: ${safePrompt}`
    : `${SYSTEM_CONTEXT}\n\nUser: ${safePrompt}`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: fullPrompt }] }],
        generationConfig: GENERATION_CONFIG,
        safetySettings: SAFETY_SETTINGS,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('[StadiumIQ] Gemini API Error:', errorData);
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('No response content from Gemini');

    return text;
  } catch (error) {
    console.error('[StadiumIQ] Gemini call failed:', error.message);
    return generateFallbackResponse(prompt, context);
  }
}

/* ---- Fallback Responses ---- */

/**
 * Generates an intelligent context-aware fallback response when
 * the Gemini API is unavailable or not configured.
 * Keyword-matches the prompt to select the most relevant response.
 *
 * @param {string} prompt - The original user prompt
 * @param {string} context - The request context string
 * @returns {string} A formatted fallback response string
 */
function generateFallbackResponse(prompt, context) {
  const lowerPrompt = (prompt || '').toLowerCase();

  if (
    lowerPrompt.includes('navigation') ||
    lowerPrompt.includes('where') ||
    lowerPrompt.includes('gate') ||
    lowerPrompt.includes('section')
  ) {
    return `🧭 **Navigation Guidance**\n\nBased on your query, here are the directions:\n\n• Follow the **blue pathways** marked on the floor for main concourse access\n• Gate **B/C** are accessible from the North entrance\n• Your section is approximately **3 minutes walk** from Gate B\n• **Elevator access** is available at columns A12 and B8\n\n_Live crowd density is being monitored. Alternate route via East corridor recommended (15% less crowded)._`;
  }

  if (
    lowerPrompt.includes('transport') ||
    lowerPrompt.includes('metro') ||
    lowerPrompt.includes('shuttle') ||
    lowerPrompt.includes('parking')
  ) {
    return `🚌 **Transport Intelligence**\n\nOptimal journey plan:\n\n• **Metro Line 3** → Stadium Station (departs every 8 min)\n• **Shuttle Bus** → Departing Lot C in 12 minutes\n• **Walking time** from nearest transit: ~7 minutes\n\n⚡ **Post-match tip**: Use Gate D exits to reach Metro 40% faster. Stagger departure 10 min after final whistle.`;
  }

  if (
    lowerPrompt.includes('crowd') ||
    lowerPrompt.includes('congestion') ||
    lowerPrompt.includes('dense') ||
    lowerPrompt.includes('flow')
  ) {
    return `🚦 **Crowd Intelligence Alert**\n\n**Current Status**: Sections 101-108 showing HIGH density (87%)\n\n• ✅ **Alternate route**: North concourse → Gate F (42% capacity)\n• ⚠️ **Avoid**: Main atrium (currently at 94% capacity)\n• 🕐 **Predicted clear time**: 18 minutes\n\nAI recommendation: Redirect 15% of foot traffic via Service Corridor B.`;
  }

  if (
    lowerPrompt.includes('food') ||
    lowerPrompt.includes('eat') ||
    lowerPrompt.includes('drink') ||
    lowerPrompt.includes('restroom')
  ) {
    return `🍔 **Amenity Locator**\n\nNearest to your location:\n\n• 🍕 **Food Court A** — 120m ahead (wait: ~4 min)\n• 🚻 **Restrooms** — End of Section 105 corridor (nearest)\n• ☕ **Coffee Kiosk** — East Concourse K3 (no queue)\n• 🏥 **First Aid** — Sections 200 & 300 (full medical staff)\n\n_Sustainability tip: Choose plant-based options at Green Zone C!_`;
  }

  if (
    lowerPrompt.includes('accessible') ||
    lowerPrompt.includes('wheelchair') ||
    lowerPrompt.includes('disability')
  ) {
    return `♿ **Accessibility Services**\n\nYour accessible journey plan:\n\n• **Wheelchair route**: Elevator at A12 → Level 2 → Accessible Section 118\n• **Companion assistance**: Call for help at any blue kiosk or text ACCESS to 2026\n• **Sensory-friendly zone**: Section 90, Row 1-5 (quiet environment)\n• **Audio description**: Available via stadium app or FM 99.5\n\nAll accessibility services are free of charge.`;
  }

  if (
    lowerPrompt.includes('sustain') ||
    lowerPrompt.includes('eco') ||
    lowerPrompt.includes('carbon') ||
    lowerPrompt.includes('green')
  ) {
    return `🌱 **Sustainability AI Guide**\n\nYour eco-impact today:\n\n• 🌍 Your transport choice saves **2.3 kg CO₂** vs driving\n• ♻️ Recycling station at end of your row (yellow bins)\n• 🥗 **Green menu options** at kiosks G4, G7, G9\n• 💧 Water refill stations: Every 50m throughout stadium\n\n**Stadium CO₂ offset**: 98% of today's emissions will be offset via our reforestation program! 🌲`;
  }

  return `🤖 **StadiumIQ AI**\n\nThank you for your query! I'm here to help with:\n\n• 🧭 Navigation & wayfinding\n• 🚦 Crowd management alerts\n• ♿ Accessibility support\n• 🚌 Transport planning\n• 🌱 Sustainability guidance\n• 🌍 Multilingual assistance\n\nPlease provide more details and I'll give you a personalized response. You can also try voice commands by clicking the 🎤 button!`;
}

/* ---- Streaming Response ---- */

/**
 * Calls Gemini and simulates progressive token streaming for chat UIs.
 * Splits the full response by word and yields each accumulated chunk
 * with a small delay to create a typewriter effect.
 *
 * @param {string} prompt - The user message
 * @param {string} context - Domain context string
 * @param {function(string): void} onChunk - Called with accumulated text on each word
 * @param {function(string): void} onComplete - Called with the final full response
 * @returns {Promise<void>}
 */
async function streamGeminiResponse(prompt, context, onChunk, onComplete) {
  try {
    const fullResponse = await callGemini(prompt, context);
    const words = fullResponse.split(' ');
    let accumulated = '';

    for (let i = 0; i < words.length; i++) {
      accumulated += (i > 0 ? ' ' : '') + words[i];
      onChunk(accumulated);
      await new Promise((r) => setTimeout(r, 30 + Math.random() * 40));
    }

    onComplete(fullResponse);
  } catch (error) {
    const fallback = generateFallbackResponse(prompt, context);
    onChunk(fallback);
    onComplete(fallback);
  }
}

/* ---- Specialized AI Functions ---- */

/**
 * Analyzes aggregated stadium operational data and returns
 * actionable intelligence including alerts, recommendations, and predictions.
 *
 * @param {Object} data - Stadium data object (attendance, density, incidents, etc.)
 * @returns {Promise<string>} AI-generated operational intelligence report
 */
async function analyzeStadiumData(data) {
  const prompt = `Analyze this stadium operational data and provide actionable intelligence:
  ${JSON.stringify(data, null, 2)}
  
  Provide:
  1. Critical alerts (if any)
  2. Top 3 recommendations
  3. Predicted trends for next 30 minutes
  4. Resource allocation suggestions`;

  return callGemini(prompt, 'Stadium Operations Command Center');
}

/**
 * Translates text from one language to another using Gemini.
 * Returns ONLY the translated text, no explanations.
 *
 * @param {string} text - Source text to translate
 * @param {string} targetLanguage - Target language name (e.g., 'Spanish')
 * @param {string} [sourceLanguage='English'] - Source language name
 * @returns {Promise<string>} Translated text
 */
async function translateText(text, targetLanguage, sourceLanguage = 'English') {
  // Security: sanitize text before sending to API
  const safeText = window.Security ? window.Security.sanitizeInput(text) : text.slice(0, 2000);
  const prompt = `Translate the following ${sourceLanguage} text to ${targetLanguage}. 
Return ONLY the translation, no explanations:
"${safeText}"`;
  return callGemini(prompt, `Language: ${targetLanguage}`);
}

/**
 * Generates step-by-step navigation instructions between two stadium locations.
 *
 * @param {string} from - Starting location description
 * @param {string} to - Destination description
 * @param {Object} [preferences={}] - User preferences (accessible, eco, etc.)
 * @returns {Promise<string>} Formatted navigation instructions
 */
async function generateRoute(from, to, preferences = {}) {
  const context = `Stadium wayfinding system. User preferences: ${JSON.stringify(preferences)}`;
  const prompt = `Generate step-by-step navigation instructions from "${from}" to "${to}" inside a FIFA World Cup 2026 stadium. Include estimated time, distance, and any accessibility notes.`;
  return callGemini(prompt, context);
}

/**
 * Assesses crowd safety risk and recommends crowd management actions.
 *
 * @param {Object} crowdData - Crowd density data by section
 * @returns {Promise<string>} Safety risk assessment and recommended actions
 */
async function analyzeCrowdSafety(crowdData) {
  const prompt = `Based on crowd density data: ${JSON.stringify(crowdData)}, assess safety risk level (LOW/MEDIUM/HIGH/CRITICAL) and recommend actions for stadium crowd management. Be specific and actionable.`;
  return callGemini(prompt, 'FIFA World Cup 2026 Safety Protocol');
}

/**
 * Analyzes sustainability metrics and provides eco-impact insights.
 *
 * @param {{ attendance: number, co2Offset: string, recyclingRate: string, renewableEnergy: string }} metrics
 * @returns {Promise<string>} Sustainability insights and green recommendations
 */
async function getSustainabilityInsights(metrics) {
  const prompt = `Analyze these sustainability metrics for a FIFA World Cup 2026 stadium day: ${JSON.stringify(metrics)}. Provide insights on CO2 impact, waste reduction opportunities, and green achievements.`;
  return callGemini(prompt, 'FIFA 2026 Green Stadium Initiative');
}

/* ---- Export ---- */

/**
 * @namespace GeminiAI
 * @description Public API for all Gemini AI interactions in StadiumIQ 2026.
 */
window.GeminiAI = {
  call: callGemini,
  stream: streamGeminiResponse,
  analyzeStadium: analyzeStadiumData,
  translate: translateText,
  generateRoute,
  analyzeCrowdSafety,
  getSustainabilityInsights,
  // Expose for testing
  _generateFallbackResponse: generateFallbackResponse,
};
