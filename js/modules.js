/* ========================================
   StadiumIQ 2026 — Transport, Sustainability,
   Multilingual, Operations & Decision Modules
   ======================================== */

'use strict';

/**
 * @fileoverview Contains the 5 remaining SPA page renderers:
 * Smart Transport, Sustainability AI, Global Concierge (Multilingual),
 * Ops Intelligence, Decision Support, and Settings.
 * Each module exports a renderXxx(container) function to the global scope.
 *
 * @module modules
 */


/* =====================================
   TRANSPORT MODULE
   ===================================== */

/**
 * Renders the Smart Transport module page.
 * Shows trip planner, live transit status, parking intelligence,
 * post-match departure optimizer, and AI transport assistant.
 *
 * @param {HTMLElement} container - The #pageContent element to render into
 * @returns {void}
 */
window.renderTransport = function(container) {
  container.innerHTML = `
    <div class="section-header">
      <div class="flex items-center gap-md mb-md">
        <span class="tag tag-blue">🚌 SMART TRANSPORT</span>
        <span class="tag tag-green">AI OPTIMIZED</span>
      </div>
      <h2>AI-Powered Transport Planner</h2>
      <p>Real-time journey optimization, shuttle coordination, and post-match departure planning for FIFA World Cup 2026.</p>
    </div>

    <!-- Trip Planner -->
    <div class="card mb-lg">
      <div class="card-header">
        <div class="card-title"><div class="card-icon blue" aria-hidden="true">🗺️</div>AI Trip Planner</div>
        <span class="tag tag-gold">Gemini AI</span>
      </div>
      <div class="grid-2 gap-md mb-md">
        <div class="input-group">
          <label class="input-label" for="tripOrigin">📍 Starting Point</label>
          <input type="text" class="input-field" id="tripOrigin" placeholder="E.g., Times Square Hotel, NYC" aria-label="Starting location for trip">
        </div>
        <div class="input-group">
          <label class="input-label" for="tripTime">⏰ Arrival Time Needed</label>
          <input type="time" class="input-field" id="tripTime" value="19:30" aria-label="Required arrival time">
        </div>
      </div>
      <div class="grid-2 gap-md mb-md">
        <div class="input-group">
          <label class="input-label" for="tripGroup">👥 Group Size</label>
          <select class="select-field" id="tripGroup" aria-label="Group size">
            <option value="1">1 person</option><option value="2">2 people</option>
            <option value="4" selected>4 people</option><option value="8">8 people</option>
            <option value="15">15+ people (group)</option>
          </select>
        </div>
        <div class="input-group">
          <label class="input-label" for="tripMode">🚆 Preferred Mode</label>
          <select class="select-field" id="tripMode" aria-label="Preferred transport mode">
            <option value="any">Any (AI Recommended)</option>
            <option value="metro">Metro / Rail</option>
            <option value="shuttle">Stadium Shuttle</option>
            <option value="bus">Public Bus</option>
            <option value="taxi">Taxi / Rideshare</option>
            <option value="walk">Walking only</option>
          </select>
        </div>
      </div>
      <div class="flex gap-sm mb-md" style="flex-wrap:wrap;">
        <label style="display:flex;align-items:center;gap:6px;font-size:0.85rem;color:var(--text-secondary);cursor:pointer;">
          <input type="checkbox" id="tripAccessible" style="accent-color:var(--fifa-blue);"> ♿ Accessible transport
        </label>
        <label style="display:flex;align-items:center;gap:6px;font-size:0.85rem;color:var(--text-secondary);cursor:pointer;">
          <input type="checkbox" id="tripGreen" checked style="accent-color:var(--fifa-blue);"> 🌱 Eco-friendly options
        </label>
        <label style="display:flex;align-items:center;gap:6px;font-size:0.85rem;color:var(--text-secondary);cursor:pointer;">
          <input type="checkbox" id="tripCheap" style="accent-color:var(--fifa-blue);"> 💰 Budget-friendly
        </label>
      </div>
      <button class="btn btn-primary" onclick="planTrip()" aria-label="Plan my journey with AI">
        🚌 Plan My Journey →
      </button>
      <div id="tripResult" class="mt-lg" style="display:none;"></div>
    </div>

    <!-- Live Transport Status -->
    <div class="grid-2 mb-lg">
      <div class="card">
        <div class="card-header">
          <div class="card-title"><div class="card-icon blue" aria-hidden="true">🚇</div>Live Transit Status</div>
          <span class="tag tag-green">LIVE</span>
        </div>
        <div style="display:flex; flex-direction:column; gap:8px;" role="list" aria-label="Live transit routes">
          ${renderTransitRoutes()}
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="card-title"><div class="card-icon gold" aria-hidden="true">🅿️</div>Parking Intelligence</div>
          <button class="btn btn-ghost btn-sm" onclick="refreshParking()" aria-label="Refresh parking data">🔄 Refresh</button>
        </div>
        <div style="display:flex; flex-direction:column; gap:8px;" id="parkingData" role="list" aria-label="Parking lots status">
          ${renderParkingStatus()}
        </div>
        <div class="mt-md">
          <button class="btn btn-gold btn-full" onclick="reserveParking()" aria-label="Reserve parking spot">
            🅿️ Reserve Spot with AI
          </button>
        </div>
      </div>
    </div>

    <!-- Post-Match Planner -->
    <div class="card mb-lg">
      <div class="card-header">
        <div class="card-title"><div class="card-icon red" aria-hidden="true">🏁</div>Post-Match Departure Optimizer</div>
        <span class="tag tag-red">⚽ Match ends ~21:45</span>
      </div>
      <div class="alert alert-gold mb-md">
        ⚡ <strong>AI Prediction:</strong> 68,000+ fans will depart simultaneously. Plan your exit <strong>now</strong> to save up to 45 minutes.
      </div>
      <div style="display:grid; grid-template-columns:repeat(auto-fill,minmax(200px,1fr)); gap:12px; margin-bottom:16px;">
        ${renderDepartureOptions()}
      </div>
      <button class="btn btn-primary" onclick="optimizeDeparture()" aria-label="Optimize my departure plan">
        🎯 Optimize My Departure Plan
      </button>
      <div id="departureResult" class="mt-md"></div>
    </div>

    <!-- Transport AI -->
    <div class="card">
      <div class="card-header">
        <div class="card-title"><div class="card-icon gold" aria-hidden="true">🤖</div>Transport AI Assistant</div>
      </div>
      <div id="transportChatContainer"></div>
    </div>
  `;

  createAIChatInterface('transportChatContainer', 
    'FIFA World Cup 2026 transport planning, shuttle schedules, metro, parking, and journey optimization',
    'E.g., "Best way from Times Square to stadium by 7pm?" or "Shuttle from Lot B schedule?"');
};

function renderTransitRoutes() {
  const routes = [
    { name: 'Metro Line 3 ↔ Stadium Station', freq: 'Every 5 min', status: 'Running', crowd: 72, color: 'green' },
    { name: 'NJ Transit Special — Platform 7', freq: 'Every 15 min', status: 'Running', crowd: 85, color: 'gold' },
    { name: 'Stadium Shuttle — Gate A ↔ Lot A', freq: 'Every 3 min', status: 'Surge', crowd: 95, color: 'orange' },
    { name: 'Stadium Shuttle — Gate B ↔ Lot B', freq: 'Every 8 min', status: 'Running', crowd: 60, color: 'green' },
    { name: 'Express Bus 201 (Midtown)', freq: 'Every 20 min', status: 'Delayed', crowd: 40, color: 'red' },
    { name: 'Ferry Service (Hoboken)', freq: 'On demand', status: 'Available', crowd: 25, color: 'green' },
  ];
  
  return routes.map(r => `
    <div style="display:flex; align-items:center; justify-content:space-between; 
                padding:10px 14px; background:var(--bg-glass); border-radius:10px;" role="listitem">
      <div>
        <div style="font-size:0.82rem; font-weight:600; color:var(--text-primary);">${r.name}</div>
        <div style="font-size:0.7rem; color:var(--text-muted);">${r.freq} · Crowd: ${r.crowd}%</div>
      </div>
      <span class="tag tag-${r.color}">${r.status}</span>
    </div>
  `).join('');
}

function renderParkingStatus() {
  const lots = [
    { id: 'A', name: 'Lot A — North', total: 1200, used: 1180, color: 'red' },
    { id: 'B', name: 'Lot B — East', total: 900, used: 750, color: 'orange' },
    { id: 'C', name: 'Lot C — South', total: 1500, used: 950, color: 'gold' },
    { id: 'D', name: 'Lot D — West (EV)', total: 400, used: 220, color: 'green' },
    { id: 'VIP', name: 'VIP Lot — Gate A', total: 200, used: 188, color: 'red' },
  ];
  
  return lots.map(l => {
    const pct = Math.round((l.used / l.total) * 100);
    return `
      <div style="padding:10px 14px; background:var(--bg-glass); border-radius:10px;" role="listitem">
        <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
          <span style="font-size:0.8rem; font-weight:600; color:var(--text-primary);">${l.name}</span>
          <span style="font-size:0.75rem; color:${pct > 90 ? 'var(--status-red)' : pct > 75 ? 'var(--status-orange)' : 'var(--status-green)'};">
            ${l.total - l.used} spots left
          </span>
        </div>
        <div class="progress-bar-container">
          <div class="progress-bar ${l.color}" style="width:${pct}%;"></div>
        </div>
      </div>
    `;
  }).join('');
}

function renderDepartureOptions() {
  const options = [
    { time: 'Leave Now', desc: 'Before final whistle', savings: '45 min saved', color: 'green', icon: '⚡' },
    { time: '21:40 (HT+5)', desc: 'Controlled stagger exit', savings: '25 min saved', color: 'gold', icon: '⏰' },
    { time: '21:50 (FT)', desc: 'Peak departure crowd', savings: 'Standard', color: 'orange', icon: '⚠️' },
    { time: '22:15 (+30)', desc: 'Post-crowd dispersal', savings: '35 min saved', color: 'blue', icon: '🌙' },
  ];
  
  return options.map(o => `
    <div style="padding:14px; background:var(--bg-glass); border:1px solid var(--border-glass); 
                border-radius:12px; cursor:pointer; transition:all 0.2s;"
         onmouseover="this.style.borderColor='var(--fifa-blue)'" 
         onmouseout="this.style.borderColor='var(--border-glass)'"
         onclick="selectDeparture('${o.time}')"
         role="button" tabindex="0" aria-label="Select departure time: ${o.time}">
      <div style="font-size:1.5rem; margin-bottom:6px;" aria-hidden="true">${o.icon}</div>
      <div style="font-weight:700; font-size:0.9rem; color:var(--text-primary); margin-bottom:2px;">${o.time}</div>
      <div style="font-size:0.75rem; color:var(--text-muted); margin-bottom:6px;">${o.desc}</div>
      <span class="tag tag-${o.color}" style="font-size:0.65rem;">${o.savings}</span>
    </div>
  `).join('');
}

/**
 * Plans an AI-optimised journey to the stadium based on form inputs.
 * Calls Gemini API with origin, time, group size, and transport mode.
 * @returns {Promise<void>}
 */
async function planTrip() {
  const origin = document.getElementById('tripOrigin').value || 'Times Square';
  const time = document.getElementById('tripTime').value || '19:30';
  const mode = document.getElementById('tripMode').value;
  const group = document.getElementById('tripGroup').value;
  
  const resultEl = document.getElementById('tripResult');
  resultEl.style.display = 'block';
  resultEl.innerHTML = `<div class="alert alert-blue"><div class="loader" style="display:inline-flex; margin-right:8px;"><div class="loader-dot"></div><div class="loader-dot"></div><div class="loader-dot"></div></div> AI calculating optimal journey...</div>`;
  
  const prompt = `Plan a journey from "${origin}" to MetLife Stadium (East Rutherford, NJ) for a group of ${group} people. 
They need to arrive by ${time}. Preferred mode: ${mode}. Current time is 21:00. 
Include specific transport options, costs, departure times, and pro tips.`;
  
  const result = await GeminiAI.call(prompt, 'FIFA World Cup 2026 transport planning for MetLife Stadium');
  resultEl.innerHTML = `
    <div class="alert alert-green mb-sm">✅ AI Journey Plan Ready!</div>
    <div style="font-size:0.85rem; line-height:1.8; color:var(--text-primary); background:rgba(0,0,0,0.2); border-radius:10px; padding:14px;">
      ${formatAIResponse(result)}
    </div>
  `;
}

/**
 * Generates an AI-optimised post-match departure strategy.
 * @returns {Promise<void>}
 */
async function optimizeDeparture() {
  const resultEl = document.getElementById('departureResult');
  resultEl.innerHTML = `<div class="alert alert-blue"><div class="loader" style="display:inline-flex; margin-right:8px;"><div class="loader-dot"></div><div class="loader-dot"></div><div class="loader-dot"></div></div> AI optimizing departure strategy...</div>`;
  
  const result = await GeminiAI.call(
    'Optimize post-match departure plan for a fan at Section 104 of MetLife Stadium after Brazil vs Germany. Provide step-by-step departure strategy to minimize crowd wait time.',
    'FIFA World Cup 2026 post-match transport'
  );
  resultEl.innerHTML = `
    <div style="font-size:0.85rem; line-height:1.8; color:var(--text-primary); background:rgba(0,0,0,0.2); border-radius:10px; padding:14px; margin-top:12px;">
      ${formatAIResponse(result)}
    </div>
  `;
}

function selectDeparture(time) { showToast(`⏰ Departure plan set for: ${time}`, 'success'); }
function reserveParking() { showToast('🅿️ AI parking reservation initiated — Lot D (EV) recommended', 'success'); }
function refreshParking() { showToast('🔄 Parking data refreshed', 'info', 1500); }

window.planTrip = planTrip;
window.optimizeDeparture = optimizeDeparture;
window.selectDeparture = selectDeparture;
window.reserveParking = reserveParking;
window.refreshParking = refreshParking;


/* =====================================
   SUSTAINABILITY MODULE
   ===================================== */

/**
 * Renders the Sustainability AI module page.
 * Shows CO2 offset stats, waste/energy/water metrics, eco advisor chat,
 * green section leaderboard, and AI sustainability assistant.
 *
 * @param {HTMLElement} container - The #pageContent element to render into
 * @returns {void}
 */
window.renderSustainability = function(container) {
  const co2Data = {
    transport: 42, energy: 28, waste: 15, food: 12, water: 3,
    offsetted: 89, target: 95
  };

  container.innerHTML = `
    <div class="section-header">
      <div class="flex items-center gap-md mb-md">
        <span class="tag tag-green">🌱 SUSTAINABILITY AI</span>
        <span class="tag tag-gold">FIFA Green 2026</span>
      </div>
      <h2>Sustainability Intelligence Center</h2>
      <p>Real-time environmental impact tracking, waste management AI, and green transportation optimization for FIFA World Cup 2026.</p>
    </div>

    <!-- Green Stats -->
    <div class="grid-4 mb-lg">
      <div class="stat-card green">
        <div class="stat-label">CO₂ Offset Today</div>
        <div class="stat-value">${co2Data.offsetted}%</div>
        <div class="stat-change up">🌱 Target: 95%</div>
      </div>
      <div class="stat-card green">
        <div class="stat-label">Waste Recycled</div>
        <div class="stat-value">76%</div>
        <div class="stat-change up">↑ 4340 kg diverted</div>
      </div>
      <div class="stat-card blue">
        <div class="stat-label">Renewable Energy</div>
        <div class="stat-value">88%</div>
        <div class="stat-change up">Solar + Wind</div>
      </div>
      <div class="stat-card gold">
        <div class="stat-label">Water Saved</div>
        <div class="stat-value">12.4k</div>
        <div class="stat-change up">Litres today</div>
      </div>
    </div>

    <div class="grid-2 mb-lg">
      <!-- CO2 Breakdown -->
      <div class="card">
        <div class="card-header">
          <div class="card-title"><div class="card-icon green" aria-hidden="true">🌍</div>CO₂ Impact Breakdown</div>
          <span class="tag tag-green">Live Data</span>
        </div>
        <canvas id="co2Chart" height="220" aria-label="CO2 breakdown chart"></canvas>
        <div class="flex gap-md mt-md" style="flex-wrap:wrap; justify-content:center;">
          ${['Transport','Energy','Waste','Food','Water'].map((l,i) => {
            const colors = ['#C8102E','#003DA5','#FFD700','#00E676','#00B0FF'];
            return `<div style="display:flex;align-items:center;gap:4px;font-size:0.7rem;color:var(--text-muted);">
              <div style="width:10px;height:10px;border-radius:2px;background:${colors[i]};"></div>${l}
            </div>`;
          }).join('')}
        </div>
      </div>

      <!-- Eco Progress -->
      <div class="card">
        <div class="card-header">
          <div class="card-title"><div class="card-icon green" aria-hidden="true">📊</div>Green Targets Progress</div>
        </div>
        <div style="display:flex; flex-direction:column; gap:16px;">
          ${[
            { label: 'Carbon Neutral Operations', val: 89, target: 95, unit: '%' },
            { label: 'Zero Single-Use Plastics', val: 94, target: 100, unit: '%' },
            { label: 'Renewable Energy Usage', val: 88, target: 90, unit: '%' },
            { label: 'Public Transport Usage', val: 72, target: 80, unit: '%' },
            { label: 'Food Waste Reduction', val: 61, target: 70, unit: '%' },
            { label: 'Water Conservation', val: 78, target: 85, unit: '%' },
          ].map(m => `
            <div>
              <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
                <span style="font-size:0.8rem; color:var(--text-secondary);">${m.label}</span>
                <div style="display:flex; gap:4px; align-items:center;">
                  <span style="font-size:0.8rem; font-weight:700; color:var(--text-primary);">${m.val}${m.unit}</span>
                  <span style="font-size:0.7rem; color:var(--text-muted);">/ ${m.target}${m.unit}</span>
                </div>
              </div>
              <div class="progress-bar-container">
                <div class="progress-bar green" style="width:${(m.val/m.target)*100}%;"></div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    <!-- AI Eco Guide + Leaderboard -->
    <div class="grid-2 mb-lg">
      <div class="card">
        <div class="card-header">
          <div class="card-title"><div class="card-icon green" aria-hidden="true">🤖</div>AI Eco Advisor</div>
          <button class="btn btn-ghost btn-sm" onclick="getEcoTips()" aria-label="Get sustainability tips">💡 Get AI Tips</button>
        </div>
        <div id="ecoTips" class="mb-md">
          ${renderEcoTips()}
        </div>
        <div id="ecoAIResult"></div>
        <div id="ecoChat"></div>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="card-title"><div class="card-icon gold" aria-hidden="true">🏆</div>Green Section Leaderboard</div>
          <span class="tag tag-gold">Today</span>
        </div>
        ${renderSustainabilityLeaderboard()}
        <div class="mt-md">
          <button class="btn btn-ghost btn-full" onclick="showMyEcoScore()" aria-label="View my eco score">
            🌱 View My Eco Score
          </button>
        </div>
      </div>
    </div>
  `;

  setTimeout(() => drawCO2Chart(), 100);
  createAIChatInterface('ecoChat', 
    'FIFA World Cup 2026 sustainability, environmental impact, and green choices',
    'E.g., "How can I reduce my carbon footprint at the stadium?"');
};

function renderEcoTips() {
  const tips = [
    { icon: '🚌', tip: 'Use Metro Line 3 — saves 4.2kg CO₂ vs driving', done: true },
    { icon: '♻️', tip: 'Use yellow bins for recycling — blue for food waste', done: false },
    { icon: '🥗', tip: 'Green menu items at Kiosks G4, G7 — 60% less CO₂', done: false },
    { icon: '💧', tip: 'Refill water at blue stations — avoid plastic bottles', done: true },
  ];
  return `<div style="display:flex; flex-direction:column; gap:8px;">
    ${tips.map(t => `
      <div style="display:flex; align-items:center; gap:10px; padding:10px 12px; 
                  background:var(--bg-glass); border-radius:8px; opacity:${t.done ? 0.6 : 1};">
        <span style="font-size:1.1rem;" aria-hidden="true">${t.icon}</span>
        <span style="font-size:0.8rem; color:var(--text-secondary); ${t.done ? 'text-decoration:line-through;' : ''}">${t.tip}</span>
        ${t.done ? '<span class="tag tag-green" style="margin-left:auto;">✅ Done</span>' : ''}
      </div>
    `).join('')}
  </div>`;
}

function renderSustainabilityLeaderboard() {
  const sections = [
    { rank: 1, section: 'Section 118', score: 98, badge: '🥇' },
    { rank: 2, section: 'Section 205', score: 94, badge: '🥈' },
    { rank: 3, section: 'VIP Box A', score: 91, badge: '🥉' },
    { rank: 4, section: 'Section 104', score: 87, badge: '' },
    { rank: 5, section: 'Section 112', score: 83, badge: '' },
  ];
  return `<div style="display:flex; flex-direction:column; gap:6px;">
    ${sections.map(s => `
      <div style="display:flex; align-items:center; gap:10px; padding:10px 14px; 
                  background:${s.rank <= 3 ? 'rgba(255,215,0,0.06)' : 'var(--bg-glass)'}; border-radius:10px;
                  border:1px solid ${s.rank === 1 ? 'rgba(255,215,0,0.3)' : 'transparent'};">
        <span style="font-size:1rem; min-width:24px;" aria-hidden="true">${s.badge || s.rank}</span>
        <span style="font-size:0.85rem; font-weight:600; color:var(--text-primary); flex:1;">${s.section}</span>
        <span style="font-size:0.8rem; color:var(--status-green);">🌱 ${s.score}/100</span>
      </div>
    `).join('')}
  </div>`;
}

function drawCO2Chart() {
  const canvas = document.getElementById('co2Chart');
  if (!canvas) return;
  const W = canvas.width = canvas.offsetWidth || 400;
  const H = canvas.height = 220;
  const ctx = canvas.getContext('2d');
  // Guard: JSDOM / test environments don't support Canvas 2D rendering
  if (!ctx) return;
  ctx.fillRect(0, 0, W, H);
  
  const data = [42, 28, 15, 12, 3];
  const colors = ['#C8102E', '#003DA5', '#FFD700', '#00E676', '#00B0FF'];
  const total = data.reduce((a, b) => a + b, 0);
  const cx = W * 0.35, cy = H / 2, radius = Math.min(W * 0.3, H * 0.4);
  
  let startAngle = -Math.PI / 2;
  data.forEach((val, i) => {
    const angle = (val / total) * Math.PI * 2;
    ctx.fillStyle = colors[i];
    ctx.shadowColor = colors[i];
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, startAngle, startAngle + angle);
    ctx.closePath();
    ctx.fill();
    startAngle += angle;
  });
  ctx.shadowBlur = 0;
  
  // Center label
  ctx.fillStyle = '#020B18';
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 0.55, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#FFD700';
  ctx.font = `bold ${W * 0.04}px Outfit`;
  ctx.textAlign = 'center';
  ctx.fillText('89%', cx, cy - 4);
  ctx.fillStyle = '#8BA4C8';
  ctx.font = `${W * 0.027}px Inter`;
  ctx.fillText('Offset', cx, cy + 12);
  
  // Legend
  const labels = ['Transport (42%)', 'Energy (28%)', 'Waste (15%)', 'Food (12%)', 'Water (3%)'];
  labels.forEach((l, i) => {
    const ly = H * 0.2 + i * 34;
    ctx.fillStyle = colors[i];
    ctx.fillRect(W * 0.65, ly - 8, 14, 14);
    ctx.fillStyle = '#8BA4C8';
    ctx.font = `${W * 0.028}px Inter`;
    ctx.textAlign = 'left';
    ctx.fillText(l, W * 0.68, ly + 3);
  });
}

async function getEcoTips() {
  const resultEl = document.getElementById('ecoAIResult');
  resultEl.innerHTML = `<div class="alert alert-green"><div class="loader" style="display:inline-flex;margin-right:8px;"><div class="loader-dot"></div><div class="loader-dot"></div><div class="loader-dot"></div></div>Getting AI eco tips...</div>`;
  const tips = await GeminiAI.getSustainabilityInsights({ attendance: 68000, co2Offset: '89%', recyclingRate: '76%', renewableEnergy: '88%' });
  resultEl.innerHTML = `<div style="font-size:0.85rem;line-height:1.7;color:var(--text-primary);background:rgba(0,0,0,0.2);border-radius:10px;padding:14px;">${formatAIResponse(tips)}</div>`;
}

function showMyEcoScore() {
  showToast('🌱 Your eco score: 87/100 — Bronze level contributor!', 'success');
}

window.getEcoTips = getEcoTips;
window.showMyEcoScore = showMyEcoScore;


/* =====================================
   MULTILINGUAL MODULE
   ===================================== */

/**
 * Renders the Global Concierge (Multilingual) module page.
 * Shows real-time AI translator, quick phrase cards in 8 languages,
 * emergency broadcast tool, and multilingual AI chat.
 *
 * @param {HTMLElement} container - The #pageContent element to render into
 * @returns {void}
 */
window.renderMultilingual = function(container) {
  const languages = ['English','Spanish','Portuguese','French','German','Arabic','Japanese','Korean',
                     'Chinese (Simplified)','Chinese (Traditional)','Hindi','Italian','Dutch','Russian',
                     'Turkish','Polish','Swedish','Norwegian','Danish','Finnish','Greek','Hebrew','Thai',
                     'Vietnamese','Indonesian','Malay','Tagalog','Swahili','Urdu','Bengali','Punjabi',
                     'Tamil','Telugu','Kannada','Malayalam','Marathi','Gujarati','Romanian','Hungarian',
                     'Czech','Slovak','Bulgarian','Croatian','Serbian','Catalan','Basque','Galician',
                     'Welsh','Irish','Icelandic','Latvian'];

  container.innerHTML = `
    <div class="section-header">
      <div class="flex items-center gap-md mb-md">
        <span class="tag tag-blue">🌍 GLOBAL CONCIERGE</span>
        <span class="tag tag-gold">50+ Languages</span>
        <span class="tag tag-green">Gemini Powered</span>
      </div>
      <h2>Multilingual AI Concierge</h2>
      <p>Break language barriers for all 32 participating nations' fans with real-time AI translation, cultural guides, and multilingual emergency support.</p>
    </div>

    <!-- Language Selector + Stats -->
    <div class="grid-4 mb-lg">
      <div class="stat-card blue">
        <div class="stat-label">Languages Supported</div>
        <div class="stat-value">50+</div>
        <div class="stat-change up">All FIFA nations</div>
      </div>
      <div class="stat-card gold">
        <div class="stat-label">Translations Today</div>
        <div class="stat-value">4,820</div>
        <div class="stat-change up">↑ 340 last hour</div>
      </div>
      <div class="stat-card green">
        <div class="stat-label">Top Language Today</div>
        <div class="stat-value" style="font-size:1.4rem;">🇧🇷 PT</div>
        <div class="stat-change up">Portuguese (Brazil)</div>
      </div>
      <div class="stat-card red">
        <div class="stat-label">Emergency Broadcasts</div>
        <div class="stat-value">18</div>
        <div class="stat-change up">All 50 langs sent</div>
      </div>
    </div>

    <!-- Main Translation Tool -->
    <div class="card mb-lg">
      <div class="card-header">
        <div class="card-title"><div class="card-icon blue" aria-hidden="true">🔄</div>Real-time AI Translator</div>
        <span class="tag tag-gold">Gemini AI</span>
      </div>
      <div class="grid-2 gap-md">
        <div>
          <div class="flex items-center justify-between mb-sm">
            <label class="input-label">Source Language</label>
            <select class="select-field" id="sourceLang" style="padding:4px 8px; font-size:0.75rem;" aria-label="Source language">
              ${languages.map(l => `<option ${l === 'English' ? 'selected' : ''}>${l}</option>`).join('')}
            </select>
          </div>
          <textarea class="input-field" id="sourceText" rows="6" 
                    placeholder="Type text to translate, or use voice input..."
                    style="resize:vertical;" aria-label="Text to translate"></textarea>
          <div class="flex gap-sm mt-sm">
            <button class="btn btn-primary" onclick="translateText()" aria-label="Translate text">🔄 Translate</button>
            <button class="btn btn-ghost" onclick="useVoiceTranslation()" aria-label="Voice translate">🎤 Voice</button>
            <button class="btn btn-ghost btn-sm" onclick="clearTranslation()" aria-label="Clear translation">✕</button>
          </div>
        </div>
        <div>
          <div class="flex items-center justify-between mb-sm">
            <label class="input-label">Translate To</label>
            <select class="select-field" id="targetLang" style="padding:4px 8px; font-size:0.75rem;" aria-label="Target language">
              ${languages.map(l => `<option ${l === 'Spanish' ? 'selected' : ''}>${l}</option>`).join('')}
            </select>
          </div>
          <div id="translationResult" 
               style="min-height:143px; background:rgba(0,0,0,0.2); border:1px solid var(--border-glass); 
                      border-radius:var(--radius-md); padding:14px; font-size:0.9rem; color:var(--text-primary); line-height:1.7;"
               aria-live="polite" aria-label="Translation result">
            <span style="color:var(--text-muted);">Translation will appear here...</span>
          </div>
          <div class="flex gap-sm mt-sm">
            <button class="btn btn-ghost btn-sm" onclick="speakTranslation()" aria-label="Speak translation">🔊 Speak</button>
            <button class="btn btn-ghost btn-sm" onclick="copyTranslation()" aria-label="Copy translation">📋 Copy</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Phrases + Multilingual Chat -->
    <div class="grid-2 mb-lg">
      <div class="card">
        <div class="card-header">
          <div class="card-title"><div class="card-icon gold" aria-hidden="true">💬</div>Stadium Quick Phrases</div>
          <select class="select-field" id="phraseTargetLang" style="padding:6px;" 
                  onchange="translatePhrases(this.value)" aria-label="Select language for quick phrases">
            ${['Spanish','Portuguese','French','German','Arabic','Japanese','Korean'].map(l => `<option>${l}</option>`).join('')}
          </select>
        </div>
        <div id="quickPhrases" style="display:flex; flex-direction:column; gap:6px;">
          ${renderQuickPhrases('Spanish')}
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="card-title"><div class="card-icon red" aria-hidden="true">🚨</div>Emergency Broadcast</div>
          <span class="tag tag-red">Staff Only</span>
        </div>
        <div class="input-group mb-md">
          <label class="input-label" for="emergencyMsg">Emergency Message (English)</label>
          <textarea class="input-field" id="emergencyMsg" rows="3" 
                    placeholder="Type emergency announcement..."
                    aria-label="Emergency message to broadcast"></textarea>
        </div>
        <div class="flex gap-sm mb-md" style="flex-wrap:wrap;">
          ${['Spanish','Portuguese','Arabic','French','German','Japanese'].map(l => `
            <label style="display:flex;align-items:center;gap:4px;font-size:0.75rem;cursor:pointer;color:var(--text-secondary);">
              <input type="checkbox" checked style="accent-color:var(--fifa-red);"> ${l}
            </label>
          `).join('')}
        </div>
        <button class="btn btn-primary btn-full" onclick="broadcastEmergency()" 
                style="background:var(--gradient-red);" aria-label="Broadcast emergency in all languages">
          🚨 Broadcast in All Languages
        </button>
        <div id="broadcastResult" class="mt-md"></div>
      </div>
    </div>

    <!-- Multilingual AI Chat -->
    <div class="card">
      <div class="card-header">
        <div class="card-title"><div class="card-icon gold" aria-hidden="true">🌍</div>Multilingual AI Concierge Chat</div>
        <span class="tag tag-blue">Chat in any language</span>
      </div>
      <div class="alert alert-blue mb-md">
        💬 You can chat in <strong>any language</strong> — the AI will understand and respond accordingly.
      </div>
      <div id="multilingualChat"></div>
    </div>
  `;

  createAIChatInterface('multilingualChat', 
    'FIFA World Cup 2026 multilingual stadium assistance — respond in the same language the user writes in',
    '¿Hablas español? 日本語でもOK! اكتب بالعربية — Type in any language...');
};

function renderQuickPhrases(lang) {
  const phrases = {
    English: ['Where is Section 104?', 'Where is the nearest restroom?', 'I need help', 'Emergency!', 'Where is the food court?', 'How do I exit?'],
    Spanish: ['¿Dónde está la Sección 104?', '¿Dónde está el baño más cercano?', 'Necesito ayuda', '¡Emergencia!', '¿Dónde está el área de comida?', '¿Cómo salgo?'],
    Portuguese: ['Onde fica a Seção 104?', 'Onde fica o banheiro mais próximo?', 'Preciso de ajuda', 'Emergência!', 'Onde fica a praça de alimentação?', 'Como saio?'],
    French: ['Où est la Section 104?', 'Où sont les toilettes?', "J'ai besoin d'aide", 'Urgence!', 'Où est la cafétéria?', 'Comment sortir?'],
    German: ['Wo ist Abschnitt 104?', 'Wo ist die nächste Toilette?', 'Ich brauche Hilfe', 'Notfall!', 'Wo ist die Cafeteria?', 'Wie komme ich raus?'],
    Arabic: ['أين القسم 104؟', 'أين أقرب حمام؟', 'أحتاج مساعدة', 'طوارئ!', 'أين منطقة الطعام؟', 'كيف أخرج؟'],
    Japanese: ['セクション104はどこですか？', '最寄りのトイレはどこですか？', '助けが必要です', '緊急！', 'フードコートはどこですか？', 'どうやって出ますか？'],
    Korean: ['104 구역은 어디있나요?', '가장 가까운 화장실은?', '도움이 필요합니다', '비상상황!', '푸드코트는 어디있나요?', '어떻게 나가나요?'],
  };
  
  const ph = phrases[lang] || phrases['English'];
  const engPh = phrases['English'];
  
  return ph.map((p, i) => `
    <button style="display:flex; align-items:flex-start; gap:8px; padding:10px 12px;
                   background:var(--bg-glass); border:1px solid var(--border-glass); border-radius:8px;
                   cursor:pointer; text-align:left; width:100%; transition:all 0.15s;"
            onmouseover="this.style.borderColor='var(--fifa-blue)'"
            onmouseout="this.style.borderColor='var(--border-glass)'"
            onclick="speakPhrase('${p.replace(/'/g, "\\'")}', '${lang}')"
            aria-label="Speak phrase: ${engPh[i]}">
      <span style="font-size:0.9rem;" aria-hidden="true">🔊</span>
      <div>
        <div style="font-size:0.8rem; font-weight:600; color:var(--text-primary);">${p}</div>
        <div style="font-size:0.68rem; color:var(--text-muted);">${engPh[i]}</div>
      </div>
    </button>
  `).join('');
}

async function translateText() {
  const source = document.getElementById('sourceText').value.trim();
  const sourceLang = document.getElementById('sourceLang').value;
  const targetLang = document.getElementById('targetLang').value;
  
  if (!source) { showToast('Please enter text to translate', 'warning'); return; }
  
  const resultEl = document.getElementById('translationResult');
  resultEl.innerHTML = `<div class="loader"><div class="loader-dot"></div><div class="loader-dot"></div><div class="loader-dot"></div></div>`;
  
  const translated = await GeminiAI.translate(source, targetLang, sourceLang);
  resultEl.innerHTML = translated.replace(/\n/g, '<br>');
  
  window._lastTranslation = translated;
}

function speakTranslation() {
  const text = window._lastTranslation || document.getElementById('translationResult').textContent;
  if (text && 'speechSynthesis' in window) {
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
    showToast('🔊 Speaking translation...', 'info', 2000);
  }
}

function copyTranslation() {
  const text = window._lastTranslation || document.getElementById('translationResult').textContent;
  navigator.clipboard.writeText(text).then(() => showToast('📋 Copied to clipboard', 'success', 1500));
}

function clearTranslation() {
  document.getElementById('sourceText').value = '';
  document.getElementById('translationResult').innerHTML = '<span style="color:var(--text-muted);">Translation will appear here...</span>';
}

function speakPhrase(text, lang) {
  if ('speechSynthesis' in window) {
    const utter = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utter);
    showToast(`🔊 Speaking in ${lang}`, 'info', 2000);
  }
}

async function translatePhrases(lang) {
  const container = document.getElementById('quickPhrases');
  if (container) container.innerHTML = renderQuickPhrases(lang);
}

/**
 * Broadcasts the emergency message entered in the form to all selected languages.
 * Simulates multi-language emergency broadcast to stadium systems.
 * @returns {Promise<void>}
 */
async function broadcastEmergency() {
  const msg = document.getElementById('emergencyMsg').value.trim();
  if (!msg) { showToast('Please enter an emergency message', 'warning'); return; }
  
  const resultEl = document.getElementById('broadcastResult');
  resultEl.innerHTML = `<div class="alert alert-blue"><div class="loader" style="display:inline-flex;margin-right:8px;"><div class="loader-dot"></div><div class="loader-dot"></div><div class="loader-dot"></div></div>Broadcasting in all selected languages...</div>`;
  
  setTimeout(() => {
    resultEl.innerHTML = `<div class="alert alert-green">✅ Emergency broadcast sent in 6 languages to all stadium screens and PA system!</div>`;
    showToast('🚨 Emergency broadcast completed in all languages', 'success');
  }, 2000);
}

function useVoiceTranslation() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { showToast('Voice not supported', 'warning'); return; }
  const r = new SR();
  showToast('🎤 Speak now...', 'info', 3000);
  r.onresult = (e) => { document.getElementById('sourceText').value = e.results[0][0].transcript; };
  r.start();
}

window.translateText = translateText;
window.speakTranslation = speakTranslation;
window.copyTranslation = copyTranslation;
window.clearTranslation = clearTranslation;
window.speakPhrase = speakPhrase;
window.translatePhrases = translatePhrases;
window.broadcastEmergency = broadcastEmergency;
window.useVoiceTranslation = useVoiceTranslation;


/* =====================================
   OPERATIONS MODULE
   ===================================== */

/**
 * Renders the Operational Intelligence module page.
 * Shows KPIs, incident management list, volunteer AI dispatch,
 * concession revenue panel, and AI operations assistant.
 *
 * @param {HTMLElement} container - The #pageContent element to render into
 * @returns {void}
 */
window.renderOperations = function(container) {
  container.innerHTML = `
    <div class="section-header">
      <div class="flex items-center gap-md mb-md">
        <span class="tag tag-orange">📊 OPS INTELLIGENCE</span>
        <span class="tag tag-green">STAFF DASHBOARD</span>
      </div>
      <h2>Operational Intelligence Dashboard</h2>
      <p>AI-powered staff coordination, incident management, and real-time resource allocation for venue operations teams.</p>
    </div>

    <!-- Ops KPIs -->
    <div class="grid-4 mb-lg">
      <div class="stat-card green"><div class="stat-label">Volunteers Active</div><div class="stat-value">324</div><div class="stat-change up">87% deployed</div></div>
      <div class="stat-card red"><div class="stat-label">Open Incidents</div><div class="stat-value">5</div><div class="stat-change down">↓ 3 resolved this hour</div></div>
      <div class="stat-card blue"><div class="stat-label">Concession Revenue</div><div class="stat-value">$2.1M</div><div class="stat-change up">↑ Track to beat record</div></div>
      <div class="stat-card gold"><div class="stat-label">AI Tasks Automated</div><div class="stat-value">94%</div><div class="stat-change up">↑ Best match day</div></div>
    </div>

    <div class="grid-2 mb-lg">
      <!-- Incident Management -->
      <div class="card">
        <div class="card-header">
          <div class="card-title"><div class="card-icon red" aria-hidden="true">🚨</div>Incident Management</div>
          <button class="btn btn-primary btn-sm" onclick="reportIncident()" aria-label="Report new incident">+ Report</button>
        </div>
        <div style="display:flex; flex-direction:column; gap:8px;" role="list" aria-label="Active incidents">
          ${renderIncidents()}
        </div>
      </div>

      <!-- Volunteer Dispatch -->
      <div class="card">
        <div class="card-header">
          <div class="card-title"><div class="card-icon blue" aria-hidden="true">👷</div>Volunteer AI Dispatch</div>
          <button class="btn btn-secondary btn-sm" onclick="optimizeVolunteers()" aria-label="Optimize volunteer allocation">🤖 Optimize</button>
        </div>
        <div id="volunteerPanel" style="display:flex; flex-direction:column; gap:8px;" role="list" aria-label="Volunteer assignments">
          ${renderVolunteerAssignments()}
        </div>
        <div id="volunteerOptResult" class="mt-md"></div>
      </div>
    </div>

    <!-- Revenue + Concession -->
    <div class="card mb-lg">
      <div class="card-header">
        <div class="card-title"><div class="card-icon gold" aria-hidden="true">💰</div>Concession & Revenue Intelligence</div>
        <span class="tag tag-gold">AI Forecasting</span>
      </div>
      <div class="grid-4">
        ${[
          { name: 'Food Court A', sales: '$340K', queue: '6 min', status: 'green', perf: 88 },
          { name: 'Food Court B', sales: '$280K', queue: '2 min', status: 'green', perf: 94 },
          { name: 'Merch Store', sales: '$520K', queue: '12 min', status: 'orange', perf: 76 },
          { name: 'Beverage Carts', sales: '$180K', queue: '1 min', status: 'green', perf: 92 },
        ].map(c => `
          <div class="stat-card ${c.status}">
            <div class="stat-label">${c.name}</div>
            <div class="stat-value" style="font-size:1.4rem;">${c.sales}</div>
            <div style="font-size:0.7rem; color:var(--text-muted); margin-bottom:6px;">Queue: ${c.queue}</div>
            <div class="progress-bar-container"><div class="progress-bar ${c.status}" style="width:${c.perf}%;"></div></div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- AI Operations Chat -->
    <div class="card">
      <div class="card-header">
        <div class="card-title"><div class="card-icon orange" aria-hidden="true">🤖</div>AI Operations Command</div>
        <span class="tag tag-orange">Ops AI</span>
      </div>
      <div id="opsChat"></div>
    </div>
  `;

  createAIChatInterface('opsChat', 
    'FIFA World Cup 2026 stadium operations, staff management, incident handling, and resource allocation',
    'E.g., "Allocate extra staff to Gate A" or "What incidents need immediate attention?"');
};

function renderIncidents() {
  const incidents = [
    { id: 'INC-047', type: 'Crowd', location: 'Sec 103', severity: 'HIGH', status: 'Active', time: '5 min ago' },
    { id: 'INC-048', type: 'Medical', location: 'Gate B', severity: 'MED', status: 'In Progress', time: '12 min ago' },
    { id: 'INC-049', type: 'Security', location: 'VIP Box', severity: 'LOW', status: 'Resolved', time: '18 min ago' },
    { id: 'INC-050', type: 'Technical', location: 'Scoreboard', severity: 'LOW', status: 'Resolved', time: '25 min ago' },
    { id: 'INC-051', type: 'Crowd', location: 'Main Exit', severity: 'HIGH', status: 'Active', time: '2 min ago' },
  ];
  
  return incidents.map(inc => `
    <div style="display:flex; align-items:center; gap:10px; padding:10px 14px; 
                background:var(--bg-glass); border-radius:10px; justify-content:space-between;" role="listitem">
      <div>
        <div style="font-size:0.78rem; font-weight:700; color:var(--text-primary);">${inc.id} · ${inc.type}</div>
        <div style="font-size:0.7rem; color:var(--text-muted);">${inc.location} · ${inc.time}</div>
      </div>
      <div style="display:flex; align-items:center; gap:6px;">
        <span class="tag tag-${inc.severity === 'HIGH' ? 'red' : inc.severity === 'MED' ? 'orange' : 'gold'}">${inc.severity}</span>
        <span class="tag tag-${inc.status === 'Resolved' ? 'green' : inc.status === 'Active' ? 'red' : 'gold'}">${inc.status}</span>
      </div>
    </div>
  `).join('');
}

function renderVolunteerAssignments() {
  const vols = [
    { id: 'V-012', name: 'Sarah M.', role: 'Crowd Control', location: 'Gate A', status: 'Active' },
    { id: 'V-034', name: 'Marcus J.', role: 'Accessibility', location: 'Sec 118', status: 'Active' },
    { id: 'V-067', name: 'Priya K.', role: 'Translation', location: 'Info Desk B', status: 'Active' },
    { id: 'V-089', name: 'Carlos R.', role: 'First Responder', location: 'Medical Bay', status: 'Standby' },
    { id: 'V-102', name: 'Emma W.', role: 'Sustainability', location: 'Concourse', status: 'Active' },
  ];
  return vols.map(v => `
    <div style="display:flex; align-items:center; gap:10px; padding:8px 12px; 
                background:var(--bg-glass); border-radius:8px; justify-content:space-between;" role="listitem">
      <div>
        <div style="font-size:0.8rem; font-weight:600; color:var(--text-primary);">${v.name} <span style="color:var(--text-muted);font-weight:400;">${v.id}</span></div>
        <div style="font-size:0.7rem; color:var(--text-muted);">${v.role} · ${v.location}</div>
      </div>
      <span class="tag tag-${v.status === 'Active' ? 'green' : 'gold'}">${v.status}</span>
    </div>
  `).join('');
}

async function optimizeVolunteers() {
  const resultEl = document.getElementById('volunteerOptResult');
  resultEl.innerHTML = `<div class="alert alert-blue"><div class="loader" style="display:inline-flex;margin-right:8px;"><div class="loader-dot"></div><div class="loader-dot"></div><div class="loader-dot"></div></div>AI optimizing volunteer assignments...</div>`;
  const result = await GeminiAI.call(
    'Optimize volunteer assignments for a FIFA World Cup stadium with 68,000 fans. Current critical areas: Sections 101-103 (crowd), Gate A (entry flow), Medical Bay (short-staffed). Recommend reassignments.',
    'Stadium operations volunteer management'
  );
  resultEl.innerHTML = `<div style="font-size:0.82rem;line-height:1.7;color:var(--text-primary);background:rgba(0,0,0,0.2);border-radius:10px;padding:12px;">${formatAIResponse(result)}</div>`;
}

function reportIncident() {
  showToast('📋 Incident reporting form opened — AI will auto-categorize', 'info');
}

window.optimizeVolunteers = optimizeVolunteers;
window.reportIncident = reportIncident;


/* =====================================
   DECISION SUPPORT MODULE
   ===================================== */

/**
 * Renders the Decision Support module page.
 * Shows situation assessment, scenario simulator, live decision queue,
 * weather impact panel, and AI command center chat.
 *
 * @param {HTMLElement} container - The #pageContent element to render into
 * @returns {void}
 */
window.renderDecision = function(container) {
  container.innerHTML = `
    <div class="section-header">
      <div class="flex items-center gap-md mb-md">
        <span class="tag tag-red">🎯 DECISION AI</span>
        <span class="tag tag-gold">REAL-TIME SUPPORT</span>
      </div>
      <h2>AI Real-time Decision Support</h2>
      <p>Cross-module intelligence aggregation and proactive AI recommendations for match-day scenario management.</p>
    </div>

    <!-- Situation Overview -->
    <div class="card mb-lg" style="background:linear-gradient(135deg, rgba(200,16,46,0.1), rgba(0,61,165,0.1));">
      <div class="card-header">
        <div class="card-title"><div class="card-icon red" aria-hidden="true">⚡</div>Current Situation Assessment</div>
        <button class="btn btn-primary btn-sm" onclick="refreshSituation()" aria-label="Refresh situation assessment">🔄 Refresh AI</button>
      </div>
      <div class="grid-3 mb-md">
        ${[
          { label: 'Overall Risk', value: 'MEDIUM', color: 'orange', icon: '🎯' },
          { label: 'Crowd Safety', value: 'ELEVATED', color: 'orange', icon: '🚦' },
          { label: 'Operations', value: 'NOMINAL', color: 'green', icon: '📊' },
          { label: 'Transport', value: 'STRESSED', color: 'red', icon: '🚌' },
          { label: 'Security', value: 'NORMAL', color: 'green', icon: '🛡️' },
          { label: 'Medical', value: 'READY', color: 'green', icon: '🏥' },
        ].map(s => `
          <div style="padding:12px; background:rgba(0,0,0,0.2); border-radius:10px; text-align:center;">
            <div style="font-size:1.3rem; margin-bottom:4px;" aria-hidden="true">${s.icon}</div>
            <div style="font-size:0.7rem; color:var(--text-muted); margin-bottom:4px;">${s.label}</div>
            <span class="tag tag-${s.color}">${s.value}</span>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Scenario Simulator + AI Advisor -->
    <div class="grid-2 mb-lg">
      <div class="card">
        <div class="card-header">
          <div class="card-title"><div class="card-icon gold" aria-hidden="true">🎭</div>Scenario Simulator</div>
          <span class="tag tag-gold">AI-Powered</span>
        </div>
        <div class="input-group mb-md">
          <label class="input-label" for="scenarioSelect">Select Scenario</label>
          <select class="select-field" id="scenarioSelect" onchange="loadScenario(this.value)" aria-label="Select scenario to simulate">
            <option value="">Choose a scenario...</option>
            <option value="crowd_surge">⚠️ Crowd Surge at Goal</option>
            <option value="emergency_evac">🚨 Emergency Evacuation</option>
            <option value="weather_storm">🌩️ Severe Weather</option>
            <option value="medical_mass">🏥 Mass Medical Event</option>
            <option value="security_threat">🛡️ Security Threat</option>
            <option value="power_outage">💡 Power Outage</option>
            <option value="transport_failure">🚌 Transport System Failure</option>
            <option value="vip_incident">👑 VIP Security Incident</option>
          </select>
        </div>
        <div id="scenarioResult" style="min-height:200px; background:rgba(0,0,0,0.2); border-radius:10px; padding:14px;">
          <span style="color:var(--text-muted); font-size:0.85rem;">Select a scenario to get AI response plan...</span>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="card-title"><div class="card-icon red" aria-hidden="true">⏱️</div>Live Decision Queue</div>
          <span class="tag tag-red">URGENT FIRST</span>
        </div>
        <div style="display:flex; flex-direction:column; gap:8px; max-height:320px; overflow-y:auto;">
          ${renderDecisionQueue()}
        </div>
      </div>
    </div>

    <!-- Weather + Prediction -->
    <div class="card mb-lg">
      <div class="card-header">
        <div class="card-title"><div class="card-icon blue" aria-hidden="true">🌤️</div>Weather Impact Assessment</div>
        <span class="tag tag-green">Clear Tonight</span>
      </div>
      <div class="grid-4">
        ${[
          { label: 'Temperature', value: '24°C', icon: '🌡️', impact: 'Optimal' },
          { label: 'Humidity', value: '58%', icon: '💧', impact: 'Comfortable' },
          { label: 'Wind', value: '12 km/h', icon: '🌬️', impact: 'Minimal' },
          { label: 'Rain Risk', value: '5%', icon: '🌧️', impact: 'Very Low' },
        ].map(w => `
          <div style="padding:14px; background:var(--bg-glass); border-radius:12px; text-align:center;">
            <div style="font-size:1.5rem; margin-bottom:4px;" aria-hidden="true">${w.icon}</div>
            <div style="font-size:0.7rem; color:var(--text-muted);">${w.label}</div>
            <div style="font-size:1.1rem; font-weight:700; color:var(--text-primary); margin:4px 0;">${w.value}</div>
            <span class="tag tag-green" style="font-size:0.65rem;">${w.impact}</span>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- AI Command Center -->
    <div class="card">
      <div class="card-header">
        <div class="card-title"><div class="card-icon red" aria-hidden="true">🎯</div>AI Decision Command Center</div>
        <span class="tag tag-gold">Gemini AI · Command Mode</span>
      </div>
      <div class="alert alert-gold mb-md">
        🎯 This AI has full context of all 8 platform modules and can make cross-domain operational recommendations.
      </div>
      <div id="decisionChat"></div>
    </div>
  `;

  createAIChatInterface('decisionChat', 
    `FIFA World Cup 2026 Decision Support. Current context: 68,420 fans, Brazil 3-2 Germany (73min), 
    3 critical crowd sections, 5 active incidents, medium risk level, clear weather. 
    Provide cross-domain operational recommendations.`,
    'Ask the AI for operational decisions, scenario planning, or cross-domain analysis...');
};

function renderDecisionQueue() {
  const decisions = [
    { id: 'D-01', priority: 'URGENT', question: 'Open secondary Gate F overflow?', rec: 'YES', confidence: 94, modules: ['Crowd', 'Security'] },
    { id: 'D-02', priority: 'HIGH', question: 'Deploy 3 more shuttle buses?', rec: 'YES', confidence: 88, modules: ['Transport'] },
    { id: 'D-03', priority: 'HIGH', question: 'Broadcast halftime crowd dispersal?', rec: 'YES', confidence: 91, modules: ['Crowd', 'Ops'] },
    { id: 'D-04', priority: 'MED', question: 'Extend food court B hours by 30 min?', rec: 'YES', confidence: 78, modules: ['Ops'] },
    { id: 'D-05', priority: 'MED', question: 'Upgrade medical team at Gate C?', rec: 'CONSIDER', confidence: 65, modules: ['Medical'] },
  ];
  
  return decisions.map(d => `
    <div style="padding:12px; background:var(--bg-glass); border-radius:10px; border-left:3px solid var(--${d.priority === 'URGENT' ? 'fifa-red' : d.priority === 'HIGH' ? 'status-orange' : 'fifa-gold'});">
      <div style="display:flex; align-items:center; gap:6px; margin-bottom:6px;">
        <span class="tag tag-${d.priority === 'URGENT' ? 'red' : d.priority === 'HIGH' ? 'orange' : 'gold'}">${d.priority}</span>
        ${d.modules.map(m => `<span class="tag tag-blue" style="font-size:0.6rem;">${m}</span>`).join('')}
      </div>
      <div style="font-size:0.82rem; color:var(--text-primary); font-weight:600; margin-bottom:4px;">${d.question}</div>
      <div style="display:flex; align-items:center; justify-content:space-between; margin-top:6px;">
        <span style="font-size:0.72rem; color:var(--text-muted);">AI: <strong style="color:${d.rec === 'YES' ? 'var(--status-green)' : 'var(--status-yellow)'};">${d.rec}</strong> (${d.confidence}% confidence)</span>
        <div style="display:flex; gap:4px;">
          <button class="btn btn-ghost btn-sm" style="padding:3px 10px; font-size:0.7rem; border-color:rgba(0,230,118,0.3); color:var(--status-green);"
                  onclick="approveDecision('${d.id}')" aria-label="Approve decision ${d.id}">✓ Approve</button>
          <button class="btn btn-ghost btn-sm" style="padding:3px 10px; font-size:0.7rem; border-color:rgba(255,23,68,0.3); color:#ff8099;"
                  onclick="denyDecision('${d.id}')" aria-label="Deny decision ${d.id}">✗ Deny</button>
        </div>
      </div>
    </div>
  `).join('');
}

async function loadScenario(scenario) {
  if (!scenario) return;
  const resultEl = document.getElementById('scenarioResult');
  resultEl.innerHTML = `<div class="loader"><div class="loader-dot"></div><div class="loader-dot"></div><div class="loader-dot"></div></div> Generating AI response plan...`;
  
  const scenarios = {
    crowd_surge: 'A goal was scored at minute 73, causing a sudden crowd surge at North gates. 6,000+ fans rushing simultaneously. How should stadium operations respond?',
    emergency_evac: 'Structural concern reported in Section 102. Full evacuation of 12,000 fans needed in 8 minutes. Provide step-by-step AI evacuation plan.',
    weather_storm: 'Sudden severe thunderstorm approaching. Match must be suspended. 68,000 fans need shelter guidance. What are the AI recommendations?',
    medical_mass: 'Heat exhaustion affecting 40+ fans simultaneously in multiple sections. Medical resources overwhelmed. AI triage and response plan?',
    security_threat: 'Unidentified suspicious package reported near Gate C. Bomb squad ETA 15 minutes. What is the immediate AI-recommended response?',
    power_outage: 'Main power grid failed. Backup generators operating at 40% capacity. Which stadium systems get priority? AI decision support needed.',
    transport_failure: 'Metro Line 3 has shut down unexpectedly. 25,000 fans rely on it for departure. AI alternative transport plan?',
    vip_incident: 'VIP dignitary requires emergency medical evacuation from the stadium. 68,000 fans present. Coordinate AI response.'
  };
  
  const result = await GeminiAI.call(scenarios[scenario], 'FIFA World Cup 2026 Emergency Decision Support');
  resultEl.innerHTML = `
    <div class="alert alert-red mb-sm" style="font-size:0.8rem;">🚨 AI Response Plan Generated</div>
    <div style="font-size:0.82rem; line-height:1.7; color:var(--text-primary);">${formatAIResponse(result)}</div>
  `;
}

async function refreshSituation() {
  showToast('🔄 AI refreshing situation assessment...', 'info', 2000);
}

function approveDecision(id) {
  showToast(`✅ Decision ${id} approved — executing across systems`, 'success');
}

function denyDecision(id) {
  showToast(`Decision ${id} denied and logged`, 'info');
}

window.loadScenario = loadScenario;
window.refreshSituation = refreshSituation;
window.approveDecision = approveDecision;
window.denyDecision = denyDecision;


/* =====================================
   SETTINGS MODULE
   ===================================== */

/**
 * Renders the Settings & Configuration page.
 * Allows configuring the Gemini API key, platform preferences (toggles),
 * and displays keyboard shortcuts reference.
 *
 * @param {HTMLElement} container - The #pageContent element to render into
 * @returns {void}
 */
window.renderSettings = function(container) {
  container.innerHTML = `
    <div class="section-header">
      <h2>⚙️ Settings & Configuration</h2>
      <p>Configure StadiumIQ 2026 platform, API keys, preferences, and accessibility options.</p>
    </div>

    <div class="grid-2">
      <div class="card">
        <div class="card-header">
          <div class="card-title"><div class="card-icon blue" aria-hidden="true">🔑</div>Gemini AI Configuration</div>
        </div>
        <div class="input-group mb-md">
          <label class="input-label" for="apiKeyInput">Google Gemini API Key</label>
          <input type="password" class="input-field" id="apiKeyInput" 
                 value="${AppState.apiKey}" 
                 placeholder="AIza..."
                 aria-label="Gemini API key">
        </div>
        <div class="alert alert-blue mb-md" style="font-size:0.8rem;">
          💡 Get your free API key at <a href="https://aistudio.google.com" target="_blank" rel="noopener">aistudio.google.com</a>.
          Without a key, the platform uses intelligent built-in fallbacks.
        </div>
        <button class="btn btn-primary" onclick="saveApiKey()" aria-label="Save API key">💾 Save API Key</button>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="card-title"><div class="card-icon gold" aria-hidden="true">⚙️</div>Platform Preferences</div>
        </div>
        <div style="display:flex; flex-direction:column; gap:14px;">
          ${[
            { label: '🔊 Text-to-Speech', id: 'settingTTS', default: true },
            { label: '🎤 Voice Recognition', id: 'settingVoice', default: true },
            { label: '🔔 Live Notifications', id: 'settingNotif', default: true },
            { label: '♿ High Contrast Mode', id: 'settingContrast', default: false },
            { label: '🌙 Reduced Motion', id: 'settingMotion', default: false },
            { label: '📊 Auto-refresh Data (5s)', id: 'settingRefresh', default: true },
          ].map(s => `
            <div style="display:flex; align-items:center; justify-content:space-between;">
              <span style="font-size:0.875rem; color:var(--text-secondary);">${s.label}</span>
              <label class="switch" aria-label="${s.label}">
                <input type="checkbox" id="${s.id}" ${s.default ? 'checked' : ''}>
                <span class="switch-slider"></span>
              </label>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="card-title"><div class="card-icon green" aria-hidden="true">ℹ️</div>About StadiumIQ 2026</div>
        </div>
        <div style="font-size:0.85rem; color:var(--text-secondary); line-height:1.8;">
          <p><strong style="color:var(--text-primary);">StadiumIQ 2026</strong> is a GenAI-enabled platform for FIFA World Cup 2026 stadium operations, built with Google Gemini AI.</p>
          <br>
          <p>Modules: Navigation · Crowd Intelligence · Accessibility · Transport · Sustainability · Multilingual · Operations · Decision Support</p>
          <br>
          <p>Technology: Google Gemini 2.0 Flash · Web Speech API · Canvas API · WCAG 2.1 AA</p>
          <br>
          <div class="flex gap-sm" style="flex-wrap:wrap;">
            <span class="tag tag-green">v2.0.0</span>
            <span class="tag tag-blue">8 AI Modules</span>
            <span class="tag tag-gold">50+ Languages</span>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="card-title"><div class="card-icon blue" aria-hidden="true">⌨️</div>Keyboard Shortcuts</div>
        </div>
        <div style="display:flex; flex-direction:column; gap:8px; font-size:0.8rem;">
          ${[
            ['Ctrl + 1', 'Command Center'],
            ['Ctrl + 2', 'AI Navigation'],
            ['Ctrl + 3', 'Crowd Intelligence'],
            ['Ctrl + 4', 'Accessibility Hub'],
            ['Ctrl + 5', 'Smart Transport'],
            ['Ctrl + 6', 'Sustainability AI'],
            ['Ctrl + 7', 'Global Concierge'],
            ['Ctrl + 8', 'Ops Intelligence'],
            ['Ctrl + 9', 'Decision Support'],
          ].map(([k, v]) => `
            <div style="display:flex; justify-content:space-between; padding:6px 10px; background:var(--bg-glass); border-radius:6px;">
              <code style="color:var(--fifa-gold); font-size:0.75rem;">${k}</code>
              <span style="color:var(--text-secondary);">${v}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
};

function saveApiKey() {
  const key = document.getElementById('apiKeyInput').value.trim();
  if (key) {
    AppState.apiKey = key;
    localStorage.setItem('gemini_api_key', key);
    // Update the API key in gemini.js
    window.GeminiAI && (window.GEMINI_API_KEY = key);
    showToast('✅ API key saved! AI features now use your key.', 'success');
  } else {
    showToast('Using built-in AI fallback mode', 'info');
  }
}

window.saveApiKey = saveApiKey;
