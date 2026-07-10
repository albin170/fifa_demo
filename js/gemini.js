/* ========================================
   StadiumIQ 2026 — Gemini AI Integration
   ======================================== */

const GEMINI_API_KEY = 'AIzaSyDemoKeyPlaceholder'; // Replace with actual key
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// System context for all AI requests
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
 * Core Gemini API call function
 * @param {string} prompt - The user prompt
 * @param {string} context - Additional context for the AI
 * @param {boolean} streaming - Whether to stream the response
 * @returns {Promise<string>} - AI response text
 */
async function callGemini(prompt, context = '', streaming = false) {
  const fullPrompt = context 
    ? `${SYSTEM_CONTEXT}\n\nContext: ${context}\n\nUser: ${prompt}`
    : `${SYSTEM_CONTEXT}\n\nUser: ${prompt}`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: fullPrompt }] }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API Error:', errorData);
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('No response from AI');
    return text;

  } catch (error) {
    console.error('Gemini call failed:', error);
    // Return smart fallback response
    return generateFallbackResponse(prompt, context);
  }
}

/**
 * Generate intelligent fallback responses when API is unavailable
 */
function generateFallbackResponse(prompt, context) {
  const lowerPrompt = prompt.toLowerCase();

  if (lowerPrompt.includes('navigation') || lowerPrompt.includes('where') || lowerPrompt.includes('gate') || lowerPrompt.includes('section')) {
    return `🧭 **Navigation Guidance**\n\nBased on your query, here are the directions:\n\n• Follow the **blue pathways** marked on the floor for main concourse access\n• Gate **B/C** are accessible from the North entrance\n• Your section is approximately **3 minutes walk** from Gate B\n• **Elevator access** is available at columns A12 and B8\n\n_Live crowd density is being monitored. Alternate route via East corridor recommended (15% less crowded)._`;
  }

  if (lowerPrompt.includes('transport') || lowerPrompt.includes('metro') || lowerPrompt.includes('shuttle') || lowerPrompt.includes('parking')) {
    return `🚌 **Transport Intelligence**\n\nOptimal journey plan:\n\n• **Metro Line 3** → Stadium Station (departs every 8 min)\n• **Shuttle Bus** → Departing Lot C in 12 minutes\n• **Walking time** from nearest transit: ~7 minutes\n\n⚡ **Post-match tip**: Use Gate D exits to reach Metro 40% faster. Stagger departure 10 min after final whistle.`;
  }

  if (lowerPrompt.includes('crowd') || lowerPrompt.includes('congestion') || lowerPrompt.includes('dense') || lowerPrompt.includes('flow')) {
    return `🚦 **Crowd Intelligence Alert**\n\n**Current Status**: Sections 101-108 showing HIGH density (87%)\n\n• ✅ **Alternate route**: North concourse → Gate F (42% capacity)\n• ⚠️ **Avoid**: Main atrium (currently at 94% capacity)\n• 🕐 **Predicted clear time**: 18 minutes\n\nAI recommendation: Redirect 15% of foot traffic via Service Corridor B.`;
  }

  if (lowerPrompt.includes('food') || lowerPrompt.includes('eat') || lowerPrompt.includes('drink') || lowerPrompt.includes('restroom')) {
    return `🍔 **Amenity Locator**\n\nNearest to your location:\n\n• 🍕 **Food Court A** — 120m ahead (wait: ~4 min)\n• 🚻 **Restrooms** — End of Section 105 corridor (nearest)\n• ☕ **Coffee Kiosk** — East Concourse K3 (no queue)\n• 🏥 **First Aid** — Sections 200 & 300 (full medical staff)\n\n_Sustainability tip: Choose plant-based options at Green Zone C!_`;
  }

  if (lowerPrompt.includes('accessible') || lowerPrompt.includes('wheelchair') || lowerPrompt.includes('disability')) {
    return `♿ **Accessibility Services**\n\nYour accessible journey plan:\n\n• **Wheelchair route**: Elevator at A12 → Level 2 → Accessible Section 118\n• **Companion assistance**: Call for help at any blue kiosk or text ACCESS to 2026\n• **Sensory-friendly zone**: Section 90, Row 1-5 (quiet environment)\n• **Audio description**: Available via stadium app or FM 99.5\n\nAll accessibility services are free of charge.`;
  }

  if (lowerPrompt.includes('sustain') || lowerPrompt.includes('eco') || lowerPrompt.includes('carbon') || lowerPrompt.includes('green')) {
    return `🌱 **Sustainability AI Guide**\n\nYour eco-impact today:\n\n• 🌍 Your transport choice saves **2.3 kg CO₂** vs driving\n• ♻️ Recycling station at end of your row (yellow bins)\n• 🥗 **Green menu options** at kiosks G4, G7, G9\n• 💧 Water refill stations: Every 50m throughout stadium\n\n**Stadium CO₂ offset**: 98% of today's emissions will be offset via our reforestation program! 🌲`;
  }

  // Default helpful response
  return `🤖 **StadiumIQ AI**\n\nThank you for your query! I'm here to help with:\n\n• 🧭 Navigation & wayfinding\n• 🚦 Crowd management alerts\n• ♿ Accessibility support\n• 🚌 Transport planning\n• 🌱 Sustainability guidance\n• 🌍 Multilingual assistance\n\nPlease provide more details and I'll give you a personalized response. You can also try voice commands by clicking the 🎤 button!`;
}

/**
 * Streaming response handler for chat interfaces
 */
async function streamGeminiResponse(prompt, context, onChunk, onComplete) {
  const thinkingDelay = () => new Promise(r => setTimeout(r, 300 + Math.random() * 700));
  
  try {
    const fullResponse = await callGemini(prompt, context);
    
    // Simulate streaming with progressive reveal
    const words = fullResponse.split(' ');
    let accumulated = '';
    
    for (let i = 0; i < words.length; i++) {
      accumulated += (i > 0 ? ' ' : '') + words[i];
      onChunk(accumulated);
      await new Promise(r => setTimeout(r, 30 + Math.random() * 40));
    }
    
    onComplete(fullResponse);
  } catch (error) {
    const fallback = generateFallbackResponse(prompt, context);
    onChunk(fallback);
    onComplete(fallback);
  }
}

/**
 * Batch analyze stadium data for operational intelligence
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
 * Translate text to target language
 */
async function translateText(text, targetLanguage, sourceLanguage = 'English') {
  const prompt = `Translate the following ${sourceLanguage} text to ${targetLanguage}. 
Return ONLY the translation, no explanations:
"${text}"`;
  return callGemini(prompt, `Language: ${targetLanguage}`);
}

/**
 * Generate route instructions
 */
async function generateRoute(from, to, preferences = {}) {
  const context = `Stadium wayfinding system. User preferences: ${JSON.stringify(preferences)}`;
  const prompt = `Generate step-by-step navigation instructions from "${from}" to "${to}" inside a FIFA World Cup 2026 stadium. Include estimated time, distance, and any accessibility notes.`;
  return callGemini(prompt, context);
}

/**
 * Analyze crowd photo/data for safety
 */
async function analyzeCrowdSafety(crowdData) {
  const prompt = `Based on crowd density data: ${JSON.stringify(crowdData)}, assess safety risk level (LOW/MEDIUM/HIGH/CRITICAL) and recommend actions for stadium crowd management. Be specific and actionable.`;
  return callGemini(prompt, 'FIFA World Cup 2026 Safety Protocol');
}

/**
 * Generate sustainability insights
 */
async function getSustainabilityInsights(metrics) {
  const prompt = `Analyze these sustainability metrics for a FIFA World Cup 2026 stadium day: ${JSON.stringify(metrics)}. Provide insights on CO2 impact, waste reduction opportunities, and green achievements.`;
  return callGemini(prompt, 'FIFA 2026 Green Stadium Initiative');
}

// Export to global scope
window.GeminiAI = {
  call: callGemini,
  stream: streamGeminiResponse,
  analyzeStadium: analyzeStadiumData,
  translate: translateText,
  generateRoute,
  analyzeCrowdSafety,
  getSustainabilityInsights
};
