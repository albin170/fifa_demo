/* ========================================
   StadiumIQ 2026 — Navigation Module
   AI Wayfinding & Indoor Maps
   ======================================== */

window.renderNavigation = function(container) {
  container.innerHTML = `
    <div class="section-header">
      <div class="flex items-center gap-md mb-md">
        <span class="tag tag-blue">🧭 AI NAVIGATION</span>
        <span class="tag tag-green">Voice Enabled</span>
      </div>
      <h2>AI-Powered Stadium Navigation</h2>
      <p>Real-time wayfinding with crowd-aware routing, accessibility options, and voice control for all FIFA World Cup 2026 venues.</p>
    </div>

    <!-- Navigation Query Bar -->
    <div class="card mb-lg" role="region" aria-label="Navigation query">
      <div class="card-header">
        <div class="card-title">
          <div class="card-icon blue" aria-hidden="true">🎯</div>
          Where do you want to go?
        </div>
        <div class="flex gap-sm">
          <span class="tag tag-green">🟢 Maps Live</span>
        </div>
      </div>
      
      <div class="grid-2 gap-md mb-md">
        <div class="input-group">
          <label class="input-label" for="navFrom">📍 From (Current Location)</label>
          <select class="select-field" id="navFrom" aria-label="Starting location">
            <option value="">🔵 My Current Location (GPS)</option>
            <option value="gate-a">Gate A — North Entrance</option>
            <option value="gate-b">Gate B — South Entrance</option>
            <option value="gate-c">Gate C — East Entrance</option>
            <option value="gate-d">Gate D — West Entrance</option>
            <option value="parking-lot-a">Parking Lot A</option>
            <option value="metro-station">MetroLink Stadium Station</option>
            <option value="concourse-1">Main Concourse Level 1</option>
          </select>
        </div>
        <div class="input-group">
          <label class="input-label" for="navTo">🎯 To (Destination)</label>
          <select class="select-field" id="navTo" aria-label="Destination">
            <option value="">Select destination...</option>
            <optgroup label="Seating">
              <option value="section-104">Section 104 — Row 12</option>
              <option value="section-118">Section 118 (Accessible)</option>
              <option value="section-200">Section 200 — Upper Deck</option>
              <option value="vip-lounge">VIP Hospitality Lounge</option>
            </optgroup>
            <optgroup label="Amenities">
              <option value="food-court-a">Food Court A</option>
              <option value="food-court-b">Food Court B (Green Zone)</option>
              <option value="restroom-1">Restrooms — Level 1</option>
              <option value="restroom-2">Restrooms — Level 2</option>
              <option value="first-aid">First Aid Center</option>
              <option value="fan-store">Official Fan Store</option>
            </optgroup>
            <optgroup label="Services">
              <option value="info-desk">Information Desk</option>
              <option value="lost-found">Lost & Found</option>
              <option value="accessibility-center">Accessibility Center</option>
              <option value="prayer-room">Prayer & Meditation Room</option>
            </optgroup>
          </select>
        </div>
      </div>

      <!-- Preferences Row -->
      <div class="flex gap-md mb-md" style="flex-wrap:wrap;">
        <label style="display:flex; align-items:center; gap:8px; cursor:pointer; font-size:0.875rem; color:var(--text-secondary);">
          <input type="checkbox" id="prefAccessible" style="accent-color:var(--fifa-blue);">
          ♿ Wheelchair/Accessible Route
        </label>
        <label style="display:flex; align-items:center; gap:8px; cursor:pointer; font-size:0.875rem; color:var(--text-secondary);">
          <input type="checkbox" id="prefQuiet" style="accent-color:var(--fifa-blue);">
          🔕 Avoid Crowded Areas
        </label>
        <label style="display:flex; align-items:center; gap:8px; cursor:pointer; font-size:0.875rem; color:var(--text-secondary);">
          <input type="checkbox" id="prefFastest" checked style="accent-color:var(--fifa-blue);">
          ⚡ Fastest Route
        </label>
        <label style="display:flex; align-items:center; gap:8px; cursor:pointer; font-size:0.875rem; color:var(--text-secondary);">
          <input type="checkbox" id="prefOutdoor" style="accent-color:var(--fifa-blue);">
          🌤️ Outdoor Paths Preferred
        </label>
      </div>

      <div class="flex gap-sm">
        <button class="btn btn-primary" onclick="getAIDirections()" id="getDirectionsBtn" aria-label="Get AI directions">
          🧭 Get AI Directions
        </button>
        <button class="btn btn-ghost" onclick="startVoiceNav()" aria-label="Voice navigation">
          🎤 Voice Command
        </button>
        <button class="btn btn-ghost" onclick="findNearestAmenity()" aria-label="Find nearest amenity">
          📍 Nearest Amenity
        </button>
      </div>
    </div>

    <!-- Directions + Map Grid -->
    <div class="grid-2 mb-lg">
      <!-- Map -->
      <div class="card" role="region" aria-label="Stadium interactive map">
        <div class="card-header">
          <div class="card-title">
            <div class="card-icon blue" aria-hidden="true">🗺️</div>
            Interactive Stadium Map
          </div>
          <div class="toggle-group" style="width:auto;">
            <button class="toggle-btn active" onclick="switchMapLayer(this, 'L1')">Level 1</button>
            <button class="toggle-btn" onclick="switchMapLayer(this, 'L2')">Level 2</button>
            <button class="toggle-btn" onclick="switchMapLayer(this, 'L3')">Level 3</button>
          </div>
        </div>
        <div class="map-container">
          <canvas id="navMapCanvas" aria-label="Stadium floor plan with navigation route"></canvas>
          <div class="map-legend">
            <div class="legend-item"><div class="legend-dot" style="background:#4CAF50;"></div>Your Route</div>
            <div class="legend-item"><div class="legend-dot" style="background:#2196F3;"></div>You Are Here</div>
            <div class="legend-item"><div class="legend-dot" style="background:#FFD700;"></div>Destination</div>
            <div class="legend-item"><div class="legend-dot heat-high"></div>Busy Area</div>
          </div>
        </div>
      </div>

      <!-- AI Turn-by-Turn -->
      <div class="card" role="region" aria-label="Turn by turn directions">
        <div class="card-header">
          <div class="card-title">
            <div class="card-icon red" aria-hidden="true">📋</div>
            AI Directions
          </div>
          <span class="tag tag-blue" id="routeTimeTag">~5 min walk</span>
        </div>
        <div id="directionsPanel" aria-live="polite">
          <div class="alert alert-blue mb-md">
            ℹ️ Select your origin and destination above, then click <strong>Get AI Directions</strong>.
          </div>
          <div id="stepsList" style="display:flex; flex-direction:column; gap:8px;"></div>
        </div>
        
        <!-- Crowd Conditions -->
        <div style="margin-top:16px; padding-top:16px; border-top:1px solid var(--border-glass);">
          <div style="font-size:0.75rem; font-weight:700; color:var(--text-muted); text-transform:uppercase; 
                      letter-spacing:1px; margin-bottom:8px;">Route Conditions</div>
          <div id="routeConditions" style="display:flex; flex-direction:column; gap:6px;">
            ${renderRouteConditions()}
          </div>
        </div>
      </div>
    </div>

    <!-- Natural Language Nav + Voice -->
    <div class="grid-2 mb-lg">
      <!-- NL Query -->
      <div class="card" role="region" aria-label="Natural language navigation assistant">
        <div class="card-header">
          <div class="card-title">
            <div class="card-icon gold" aria-hidden="true">🤖</div>
            Ask AI in Natural Language
          </div>
        </div>
        <p style="font-size:0.8rem; margin-bottom:16px;">Try: <em>"Take me to the nearest halal food stall"</em> or <em>"How do I get to section 104 avoiding crowds?"</em></p>
        <div id="navChatContainer">
          <!-- Chat interface will be rendered here -->
        </div>
      </div>

      <!-- Quick Destinations -->
      <div class="card" role="region" aria-label="Quick destination shortcuts">
        <div class="card-header">
          <div class="card-title">
            <div class="card-icon orange" aria-hidden="true">⚡</div>
            Quick Destinations
          </div>
        </div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
          ${renderQuickDestinations()}
        </div>
        
        <div style="margin-top:20px; padding-top:16px; border-top:1px solid var(--border-glass);">
          <div style="font-size:0.75rem; font-weight:700; color:var(--text-muted); text-transform:uppercase; 
                      letter-spacing:1px; margin-bottom:10px;">Nearby Right Now</div>
          ${renderNearbyItems()}
        </div>
      </div>
    </div>
  `;

  // Initialize map
  setTimeout(() => {
    const canvas = document.getElementById('navMapCanvas');
    if (canvas) drawNavMap(canvas, null, null);
  }, 100);

  // Initialize AI chat
  createAIChatInterface('navChatContainer', 'Stadium navigation, wayfinding, and amenity finding for FIFA World Cup 2026', 
    'E.g., "How do I get to Section 104 avoiding crowds?"');
};

function renderRouteConditions() {
  const conditions = [
    { section: 'Main Corridor A', density: 72, status: 'Medium', color: 'gold' },
    { section: 'East Concourse', density: 45, status: 'Clear', color: 'green' },
    { section: 'Elevator Bank B', density: 88, status: 'Busy', color: 'orange' },
  ];
  
  return conditions.map(c => `
    <div style="display:flex; align-items:center; justify-content:space-between; 
                padding:8px 12px; background:var(--bg-glass); border-radius:8px;">
      <span style="font-size:0.8rem; color:var(--text-secondary);">${c.section}</span>
      <div style="display:flex; align-items:center; gap:8px;">
        <div style="width:60px;">
          <div class="progress-bar-container" style="height:4px;">
            <div class="progress-bar ${c.color}" style="width:${c.density}%;"></div>
          </div>
        </div>
        <span class="tag tag-${c.color}">${c.status}</span>
      </div>
    </div>
  `).join('');
}

function renderQuickDestinations() {
  const dests = [
    { icon: '🚻', label: 'Nearest Restroom', time: '1 min' },
    { icon: '🏥', label: 'First Aid', time: '3 min' },
    { icon: '🍔', label: 'Food Court A', time: '2 min' },
    { icon: '☕', label: 'Coffee Kiosk', time: '45 sec' },
    { icon: '♿', label: 'Lift/Elevator', time: '1 min' },
    { icon: '🛍️', label: 'Fan Store', time: '4 min' },
    { icon: 'ℹ️', label: 'Info Desk', time: '3 min' },
    { icon: '🚰', label: 'Water Refill', time: '30 sec' },
  ];
  
  return dests.map(d => `
    <button style="padding:12px; background:var(--bg-glass); border:1px solid var(--border-glass); 
                   border-radius:10px; cursor:pointer; text-align:left; transition:all 0.2s;"
            onmouseover="this.style.borderColor='var(--fifa-blue)'"
            onmouseout="this.style.borderColor='var(--border-glass)'"
            onclick="quickNavTo('${d.label}')"
            aria-label="Navigate to ${d.label}, approximately ${d.time} away">
      <div style="font-size:1.3rem; margin-bottom:4px;" aria-hidden="true">${d.icon}</div>
      <div style="font-size:0.75rem; font-weight:600; color:var(--text-primary);">${d.label}</div>
      <div style="font-size:0.65rem; color:var(--status-green);">~${d.time}</div>
    </button>
  `).join('');
}

function renderNearbyItems() {
  return `
    <div style="display:flex; flex-direction:column; gap:6px;">
      <div style="display:flex; align-items:center; justify-content:space-between; 
                  padding:8px 12px; background:var(--bg-glass); border-radius:8px;">
        <div style="display:flex; align-items:center; gap:8px;">
          <span aria-hidden="true">🍕</span>
          <span style="font-size:0.8rem; color:var(--text-primary);">Pizza Corner K7</span>
        </div>
        <span style="font-size:0.7rem; color:var(--status-green);">No queue</span>
      </div>
      <div style="display:flex; align-items:center; justify-content:space-between; 
                  padding:8px 12px; background:var(--bg-glass); border-radius:8px;">
        <div style="display:flex; align-items:center; gap:8px;">
          <span aria-hidden="true">🚻</span>
          <span style="font-size:0.8rem; color:var(--text-primary);">Restroom — Row 5 End</span>
        </div>
        <span style="font-size:0.7rem; color:var(--status-yellow);">~2 min wait</span>
      </div>
      <div style="display:flex; align-items:center; justify-content:space-between; 
                  padding:8px 12px; background:var(--bg-glass); border-radius:8px;">
        <div style="display:flex; align-items:center; gap:8px;">
          <span aria-hidden="true">💊</span>
          <span style="font-size:0.8rem; color:var(--text-primary);">Medical Station B</span>
        </div>
        <span style="font-size:0.7rem; color:var(--status-green);">Available</span>
      </div>
    </div>
  `;
}

async function getAIDirections() {
  const from = document.getElementById('navFrom').value || 'Gate A';
  const to = document.getElementById('navTo').value;
  const accessible = document.getElementById('prefAccessible').checked;
  const avoidCrowds = document.getElementById('prefQuiet').checked;

  if (!to) {
    showToast('Please select a destination', 'warning');
    return;
  }

  const btn = document.getElementById('getDirectionsBtn');
  btn.disabled = true;
  btn.innerHTML = '<div class="loader"><div class="loader-dot"></div><div class="loader-dot"></div><div class="loader-dot"></div></div> Calculating...';

  const toLabel = document.getElementById('navTo').options[document.getElementById('navTo').selectedIndex].text;
  const fromLabel = document.getElementById('navFrom').options[document.getElementById('navFrom').selectedIndex].text || 'Current Location';

  const prefs = [];
  if (accessible) prefs.push('wheelchair accessible');
  if (avoidCrowds) prefs.push('avoid crowded areas');
  prefs.push('fastest route');

  const directions = await GeminiAI.generateRoute(fromLabel, toLabel, { preferences: prefs.join(', ') });

  // Display directions
  const panel = document.getElementById('directionsPanel');
  panel.innerHTML = `
    <div class="alert alert-green mb-md">
      ✅ Route found! <strong>${fromLabel}</strong> → <strong>${toLabel}</strong>
    </div>
    <div style="font-size:0.85rem; line-height:1.8; color:var(--text-primary); 
                background:rgba(0,0,0,0.2); border-radius:10px; padding:14px;">
      ${formatAIResponse(directions)}
    </div>
  `;

  // Update map
  const canvas = document.getElementById('navMapCanvas');
  if (canvas) drawNavMap(canvas, from, to);

  // Update time tag
  document.getElementById('routeTimeTag').textContent = '~' + (Math.floor(Math.random() * 8) + 3) + ' min walk';

  // Speak if TTS supported
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance('Route calculated. ' + directions.replace(/\*\*/g, '').replace(/\n/g, ' '));
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }

  btn.disabled = false;
  btn.innerHTML = '🧭 Get AI Directions';
  showToast('Route calculated successfully!', 'success');
}

async function quickNavTo(destination) {
  document.getElementById('navTo').value = destination.toLowerCase().replace(/\s/g, '-');
  showToast(`Finding route to ${destination}...`, 'info', 2000);
  await getAIDirections();
}

async function findNearestAmenity() {
  showToast('🔍 Finding nearest amenities...', 'info', 2000);
  const response = await GeminiAI.call(
    'What are the 3 nearest amenities to a fan in Section 104 of MetLife Stadium? Include restrooms, food, and medical.',
    'FIFA World Cup 2026 fan navigation'
  );
  const panel = document.getElementById('directionsPanel');
  panel.innerHTML = `
    <div class="alert alert-blue mb-md">📍 Nearest amenities from your location:</div>
    <div style="font-size:0.85rem; line-height:1.8; color:var(--text-primary); 
                background:rgba(0,0,0,0.2); border-radius:10px; padding:14px;">
      ${formatAIResponse(response)}
    </div>
  `;
}

function startVoiceNav() {
  if (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window)) {
    showToast('Voice not supported. Try Chrome browser.', 'warning');
    return;
  }
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SR();
  recognition.lang = 'en-US';
  
  showToast('🎤 Say your destination (e.g., "Take me to Section 104")', 'info', 4000);
  
  recognition.onresult = async (e) => {
    const transcript = e.results[0][0].transcript;
    showToast(`🎤 Heard: "${transcript}"`, 'success', 2000);
    const input = document.querySelector('#navChatContainer input');
    if (input) {
      input.value = transcript;
      sendChatMessage('navChatContainer', 'Stadium navigation');
    }
  };
  recognition.start();
}

function switchMapLayer(btn, layer) {
  document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const canvas = document.getElementById('navMapCanvas');
  if (canvas) drawNavMap(canvas, null, null, layer);
}

function drawNavMap(canvas, from, to, layer = 'L1') {
  const W = canvas.width = canvas.offsetWidth || 500;
  const H = canvas.height = canvas.offsetHeight || 380;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#010D1F';
  ctx.fillRect(0, 0, W, H);

  // Stadium outline
  ctx.strokeStyle = 'rgba(0,61,165,0.4)';
  ctx.lineWidth = 2;
  ctx.fillStyle = 'rgba(0,30,80,0.3)';
  ctx.beginPath();
  ctx.ellipse(W / 2, H / 2, W * 0.45, H * 0.45, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Pitch
  ctx.fillStyle = '#1a4d1a';
  ctx.strokeStyle = '#2d7a2d';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(W * 0.3, H * 0.3, W * 0.4, H * 0.4, 4);
  ctx.fill();
  ctx.stroke();

  // Pitch center line and circle
  ctx.strokeStyle = 'rgba(255,255,255,0.2)';
  ctx.beginPath();
  ctx.moveTo(W / 2, H * 0.3);
  ctx.lineTo(W / 2, H * 0.7);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(W / 2, H / 2, H * 0.1, 0, Math.PI * 2);
  ctx.stroke();

  // Gates
  const gates = [
    { x: W / 2, y: 15, label: 'Gate A (N)', color: '#00B0FF' },
    { x: W / 2, y: H - 15, label: 'Gate B (S)', color: '#00B0FF' },
    { x: 15, y: H / 2, label: 'Gate C', color: '#00B0FF' },
    { x: W - 15, y: H / 2, label: 'Gate D', color: '#00B0FF' },
  ];

  gates.forEach(g => {
    ctx.fillStyle = g.color;
    ctx.beginPath();
    ctx.arc(g.x, g.y, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.font = '9px Inter';
    ctx.textAlign = 'center';
    const labelY = g.y < H / 2 ? g.y + 18 : g.y - 10;
    ctx.fillText(g.label, g.x + (g.x < W / 2 ? 25 : g.x > W - 30 ? -20 : 0), labelY);
  });

  // Draw animated route if directions requested
  if (from && to) {
    const startX = W / 2, startY = 10;
    const endX = W * 0.6, endY = H * 0.65;

    // Route line with glow
    ctx.shadowColor = '#4CAF50';
    ctx.shadowBlur = 8;
    ctx.strokeStyle = '#4CAF50';
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 4]);
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.quadraticCurveTo(startX + 60, H / 2, endX, endY);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.shadowBlur = 0;

    // Start point
    ctx.fillStyle = '#2196F3';
    ctx.beginPath();
    ctx.arc(startX, startY + 5, 7, 0, Math.PI * 2);
    ctx.fill();

    // End point (destination)
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(endX, endY, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#000';
    ctx.font = 'bold 9px Inter';
    ctx.textAlign = 'center';
    ctx.fillText('🎯', endX, endY + 4);
  }

  // Section labels
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.font = '8px Inter';
  const sectionPositions = [
    { x: W * 0.2, y: H * 0.2, label: '101' },
    { x: W * 0.5, y: H * 0.1, label: '108' },
    { x: W * 0.8, y: H * 0.2, label: '115' },
    { x: W * 0.85, y: H * 0.5, label: '122' },
    { x: W * 0.8, y: H * 0.8, label: '130' },
    { x: W * 0.2, y: H * 0.8, label: '138' },
    { x: W * 0.15, y: H * 0.5, label: '145' },
  ];
  sectionPositions.forEach(s => {
    ctx.textAlign = 'center';
    ctx.fillText(s.label, s.x, s.y);
  });

  // Layer label
  ctx.fillStyle = 'rgba(255,215,0,0.5)';
  ctx.font = '10px Inter';
  ctx.textAlign = 'left';
  ctx.fillText(`Level ${layer.replace('L', '')}`, 10, H - 10);
}

window.getAIDirections = getAIDirections;
window.quickNavTo = quickNavTo;
window.findNearestAmenity = findNearestAmenity;
window.startVoiceNav = startVoiceNav;
window.switchMapLayer = switchMapLayer;
