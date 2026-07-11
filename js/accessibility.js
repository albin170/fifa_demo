/* ========================================
   StadiumIQ 2026 — Accessibility Module
   Inclusive Support Hub
   ======================================== */

window.renderAccessibility = function(container) {
  container.innerHTML = `
    <div class="section-header">
      <div class="flex items-center gap-md mb-md">
        <span class="tag tag-gold">♿ ACCESSIBILITY HUB</span>
        <span class="tag tag-green">WCAG 2.1 AA</span>
        <span class="tag tag-blue">AI Powered</span>
      </div>
      <h2>Accessibility & Inclusive Experience Hub</h2>
      <p>AI-driven accessibility services ensuring every fan, regardless of ability, enjoys the full FIFA World Cup 2026 experience.</p>
    </div>

    <!-- Quick Services Banner -->
    <div class="card mb-lg" style="background:linear-gradient(135deg, rgba(0,61,165,0.2), rgba(255,215,0,0.05)); border-color:rgba(255,215,0,0.2);">
      <div class="flex items-center gap-md mb-lg" style="flex-wrap:wrap;">
        <span style="font-size:2rem;" aria-hidden="true">♿</span>
        <div>
          <h3 style="color:var(--fifa-gold);">Need Immediate Assistance?</h3>
          <p style="font-size:0.875rem; margin:0;">Our AI-dispatched accessibility team is always available</p>
        </div>
      </div>
      <div class="flex gap-sm" style="flex-wrap:wrap;">
        <button class="btn btn-gold" onclick="requestAssistance('wheelchair')" aria-label="Request wheelchair assistance">
          ♿ Wheelchair Escort
        </button>
        <button class="btn btn-secondary" onclick="requestAssistance('visual')" aria-label="Request visual assistance">
          👁️ Visual Assistance
        </button>
        <button class="btn btn-ghost" onclick="requestAssistance('hearing')" aria-label="Request hearing assistance">
          👂 Hearing Support
        </button>
        <button class="btn btn-ghost" onclick="requestAssistance('medical')" aria-label="Request medical assistance">
          🏥 Medical Help
        </button>
        <button class="btn btn-ghost" onclick="requestAssistance('sensory')" aria-label="Sensory support request">
          🧠 Sensory Support
        </button>
      </div>
      <div id="assistanceStatus" class="mt-md" style="display:none;"></div>
    </div>

    <!-- Accessibility Stats -->
    <div class="grid-4 mb-lg">
      <div class="stat-card gold">
        <div class="stat-label">Accessible Seats</div>
        <div class="stat-value">847</div>
        <div class="stat-change up">All equipped</div>
      </div>
      <div class="stat-card blue">
        <div class="stat-label">Volunteers On-call</div>
        <div class="stat-value">48</div>
        <div class="stat-change up">↑ Full coverage</div>
      </div>
      <div class="stat-card green">
        <div class="stat-label">Requests Fulfilled</div>
        <div class="stat-value">127</div>
        <div class="stat-change up">Avg response: 3 min</div>
      </div>
      <div class="stat-card red">
        <div class="stat-label">Active Requests</div>
        <div class="stat-value">4</div>
        <div class="stat-change" style="color:var(--status-yellow);">Being handled</div>
      </div>
    </div>

    <!-- Main Grid -->
    <div class="grid-2 mb-lg">
      <!-- Accessible Facilities Map -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">
            <div class="card-icon gold" aria-hidden="true">🗺️</div>
            Accessible Facilities Map
          </div>
          <div class="toggle-group" style="width:auto;">
            <button class="toggle-btn active" onclick="filterFacilities(this,'all')">All</button>
            <button class="toggle-btn" onclick="filterFacilities(this,'mobility')">Mobility</button>
            <button class="toggle-btn" onclick="filterFacilities(this,'sensory')">Sensory</button>
          </div>
        </div>
        <div class="map-container" style="aspect-ratio:4/3;">
          <canvas id="accessibilityMap" aria-label="Stadium accessibility facilities map"></canvas>
        </div>
        <div class="flex gap-sm mt-md" style="flex-wrap:wrap;">
          <div style="display:flex;align-items:center;gap:4px;font-size:0.7rem;color:var(--text-muted);">
            <div style="width:10px;height:10px;border-radius:50%;background:#FFD700;"></div>Wheelchair Access
          </div>
          <div style="display:flex;align-items:center;gap:4px;font-size:0.7rem;color:var(--text-muted);">
            <div style="width:10px;height:10px;border-radius:50%;background:#00B0FF;"></div>Lift/Elevator
          </div>
          <div style="display:flex;align-items:center;gap:4px;font-size:0.7rem;color:var(--text-muted);">
            <div style="width:10px;height:10px;border-radius:50%;background:#4CAF50;"></div>Sensory Room
          </div>
          <div style="display:flex;align-items:center;gap:4px;font-size:0.7rem;color:var(--text-muted);">
            <div style="width:10px;height:10px;border-radius:50%;background:#E91E63;"></div>Companion Aid
          </div>
        </div>
      </div>

      <!-- Sensory & Comfort -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">
            <div class="card-icon purple" aria-hidden="true">🧠</div>
            Sensory & Comfort Services
          </div>
        </div>
        
        <div style="display:flex; flex-direction:column; gap:12px;">
          ${renderSensoryServices()}
        </div>
        
        <div style="margin-top:20px; padding-top:16px; border-top:1px solid var(--border-glass);">
          <div style="font-size:0.75rem; font-weight:700; color:var(--text-muted); 
                      text-transform:uppercase; letter-spacing:1px; margin-bottom:10px;">
            Audio Settings
          </div>
          ${renderAudioSettings()}
        </div>
      </div>
    </div>

    <!-- Features Grid -->
    <div class="grid-2 mb-lg">
      <!-- Sign Language & Visual Support -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">
            <div class="card-icon blue" aria-hidden="true">🤟</div>
            Sign Language & Visual AI
          </div>
          <span class="tag tag-blue">AI-Powered</span>
        </div>
        
        <div class="tabs">
          <button class="tab-btn active" onclick="switchAccessTab(this,'asl')" aria-label="ASL tab">ASL Support</button>
          <button class="tab-btn" onclick="switchAccessTab(this,'audio-desc')" aria-label="Audio description tab">Audio Description</button>
          <button class="tab-btn" onclick="switchAccessTab(this,'live-caption')" aria-label="Live captions tab">Live Captions</button>
        </div>

        <div class="tab-panel active" id="tab-asl">
          <div class="alert alert-blue mb-md">
            🤟 AI sign language interpreter available for all announcements and match commentary.
          </div>
          <div style="background:rgba(0,0,0,0.3); border-radius:10px; padding:20px; text-align:center; margin-bottom:12px; min-height:120px; display:flex; align-items:center; justify-content:center;">
            <div>
              <div style="font-size:3rem; margin-bottom:8px;" aria-hidden="true">🤟</div>
              <div style="font-size:0.85rem; color:var(--text-secondary);">ASL Interpreter Feed Active</div>
              <div class="tag tag-green mt-sm">🟢 LIVE</div>
            </div>
          </div>
          <button class="btn btn-secondary btn-full" onclick="activateASL()" aria-label="Activate sign language feed">
            Activate ASL Feed for This Section
          </button>
        </div>

        <div class="tab-panel" id="tab-audio-desc">
          <div class="alert alert-gold mb-md">
            🎧 AI-generated audio descriptions of match events, crowd atmosphere, and announcements.
          </div>
          <div style="display:flex; flex-direction:column; gap:8px;">
            <div style="padding:10px 14px; background:var(--bg-glass); border-radius:8px; font-size:0.85rem;">
              <strong>🔊 Now Playing:</strong> "Brazil's striker Vinicius Jr. approaches the penalty box from the left wing, 
              the crowd rises to their feet as he shoots..."
            </div>
            <button class="btn btn-secondary btn-full" onclick="startAudioDesc()" aria-label="Start audio description">
              🎧 Start Audio Description
            </button>
            <div class="flex gap-sm items-center">
              <span style="font-size:0.8rem; color:var(--text-muted);">Speed:</span>
              <select class="select-field" style="flex:1; padding:6px;" aria-label="Playback speed">
                <option>0.75x Slow</option>
                <option selected>1.0x Normal</option>
                <option>1.25x Fast</option>
              </select>
            </div>
          </div>
        </div>

        <div class="tab-panel" id="tab-live-caption">
          <div class="alert alert-green mb-md">
            📝 Real-time AI captions for all announcements in 50+ languages.
          </div>
          <div style="background:rgba(0,0,0,0.3); border-radius:10px; padding:16px; min-height:100px; font-size:0.85rem; line-height:1.8;" id="captionsBox">
            <span style="color:var(--text-secondary);">📢 Announcement: </span>
            "Welcome to MetLife Stadium. Tonight's match, Brazil versus Germany, 
            will kick off in approximately 10 minutes. Please take your seats..."
          </div>
          <div class="flex gap-sm mt-md">
            <select class="select-field" style="flex:1;" aria-label="Caption language">
              <option>English</option><option>Spanish</option><option>Portuguese</option>
              <option>Arabic</option><option>French</option><option>German</option>
            </select>
            <button class="btn btn-secondary" onclick="activateCaptions()" aria-label="Activate live captions">Activate</button>
          </div>
        </div>
      </div>

      <!-- AI Accessibility Concierge -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">
            <div class="card-icon gold" aria-hidden="true">🤖</div>
            Accessibility AI Concierge
          </div>
        </div>
        <p style="font-size:0.8rem; margin-bottom:12px;">
          Describe your needs and I'll provide personalized accessible route, seating, and service recommendations.
        </p>
        <div style="display:flex; flex-direction:column; gap:8px; margin-bottom:12px;">
          <button class="btn btn-ghost btn-sm" onclick="quickAccessQuery('I use a wheelchair')" 
                  aria-label="Quick query: wheelchair user">♿ I use a wheelchair</button>
          <button class="btn btn-ghost btn-sm" onclick="quickAccessQuery('I have visual impairment')"
                  aria-label="Quick query: visual impairment">👁️ I have visual impairment</button>
          <button class="btn btn-ghost btn-sm" onclick="quickAccessQuery('I am deaf or hard of hearing')"
                  aria-label="Quick query: deaf or hard of hearing">🦻 I am deaf/hard of hearing</button>
          <button class="btn btn-ghost btn-sm" onclick="quickAccessQuery('I need a sensory-friendly environment')"
                  aria-label="Quick query: sensory friendly">🧠 I need sensory-friendly seating</button>
          <button class="btn btn-ghost btn-sm" onclick="quickAccessQuery('I have a companion who needs assistance')"
                  aria-label="Quick query: companion assistance">👥 Companion/carer assistance</button>
        </div>
        <div id="accessChatContainer"></div>
      </div>
    </div>
  `;

  // Draw accessibility map
  setTimeout(() => {
    const canvas = document.getElementById('accessibilityMap');
    if (canvas) drawAccessibilityMap(canvas);
  }, 100);

  // Initialize AI chat
  createAIChatInterface('accessChatContainer', 
    'Accessibility services, accessible routes, and inclusive support for FIFA World Cup 2026 fans',
    'Describe your accessibility needs...');
};

function renderSensoryServices() {
  const services = [
    { 
      icon: '🔕', label: 'Quiet Zone — Section 90', 
      desc: 'Reduced audio, low light, calm environment',
      available: true, capacity: '42/60 seats'
    },
    { 
      icon: '🧸', label: 'Family Sensory Room', 
      desc: 'Dedicated room with calming materials',
      available: true, capacity: 'Available now'
    },
    { 
      icon: '🕶️', label: 'High Contrast Mode', 
      desc: 'Stadium screens with enhanced contrast',
      available: true, capacity: 'Enabled on request'
    },
    { 
      icon: '🎧', label: 'Noise Cancelling Headsets', 
      desc: 'Available at Information Desks A, B, C',
      available: false, capacity: 'All 50 checked out'
    },
  ];
  
  return services.map(s => `
    <div style="display:flex; align-items:center; gap:10px; padding:10px 14px; 
                background:var(--bg-glass); border-radius:10px; justify-content:space-between;">
      <div style="display:flex; align-items:center; gap:10px;">
        <span style="font-size:1.3rem;" aria-hidden="true">${s.icon}</span>
        <div>
          <div style="font-size:0.85rem; font-weight:600; color:var(--text-primary);">${s.label}</div>
          <div style="font-size:0.72rem; color:var(--text-muted);">${s.desc}</div>
          <div style="font-size:0.68rem; color:${s.available ? 'var(--status-green)' : 'var(--status-red)'}; margin-top:2px;">${s.capacity}</div>
        </div>
      </div>
      <button class="btn btn-ghost btn-sm" 
              onclick="bookSensoryService('${s.label}')"
              ${s.available ? '' : 'disabled'}
              aria-label="Book ${s.label}">
        ${s.available ? 'Book' : 'Full'}
      </button>
    </div>
  `).join('');
}

function renderAudioSettings() {
  return `
    <div style="display:flex; flex-direction:column; gap:10px;">
      <div style="display:flex; align-items:center; justify-content:space-between;">
        <span style="font-size:0.85rem; color:var(--text-secondary);">🔊 Audio Description</span>
        <label class="switch" aria-label="Toggle audio description">
          <input type="checkbox" checked onchange="showToast('Audio description ' + (this.checked?'enabled':'disabled'), 'info')">
          <span class="switch-slider"></span>
        </label>
      </div>
      <div style="display:flex; align-items:center; justify-content:space-between;">
        <span style="font-size:0.85rem; color:var(--text-secondary);">📝 Live Captions</span>
        <label class="switch" aria-label="Toggle live captions">
          <input type="checkbox" onchange="showToast('Live captions ' + (this.checked?'enabled':'disabled'), 'info')">
          <span class="switch-slider"></span>
        </label>
      </div>
      <div style="display:flex; align-items:center; justify-content:space-between;">
        <span style="font-size:0.85rem; color:var(--text-secondary);">🔔 Vibration Alerts</span>
        <label class="switch" aria-label="Toggle vibration alerts">
          <input type="checkbox" checked onchange="showToast('Vibration alerts ' + (this.checked?'enabled':'disabled'), 'info')">
          <span class="switch-slider"></span>
        </label>
      </div>
      <div style="display:flex; align-items:center; justify-content:space-between;">
        <span style="font-size:0.85rem; color:var(--text-secondary);">🌙 High Contrast UI</span>
        <label class="switch" aria-label="Toggle high contrast">
          <input type="checkbox" onchange="toggleHighContrast(this.checked)">
          <span class="switch-slider"></span>
        </label>
      </div>
    </div>
  `;
}

function drawAccessibilityMap(canvas) {
  const W = canvas.width = canvas.offsetWidth || 500;
  const H = canvas.height = canvas.offsetHeight || 380;
  const ctx = canvas.getContext('2d');
  
  ctx.fillStyle = '#010D1F';
  ctx.fillRect(0, 0, W, H);
  
  // Stadium outline
  ctx.strokeStyle = 'rgba(255,215,0,0.2)';
  ctx.lineWidth = 2;
  ctx.fillStyle = 'rgba(0,30,80,0.3)';
  ctx.beginPath();
  ctx.ellipse(W / 2, H / 2, W * 0.44, H * 0.44, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  
  // Pitch
  ctx.fillStyle = '#1a4d1a';
  ctx.strokeStyle = '#2d7a2d';
  ctx.beginPath();
  ctx.roundRect(W * 0.3, H * 0.3, W * 0.4, H * 0.4, 4);
  ctx.fill();
  ctx.stroke();
  
  // Accessible facilities
  const facilities = [
    { x: W * 0.5, y: 18, type: 'wheelchair', color: '#FFD700', icon: '♿', label: 'Accessible Entry' },
    { x: W * 0.15, y: H * 0.3, type: 'lift', color: '#00B0FF', icon: '🛗', label: 'Lift' },
    { x: W * 0.85, y: H * 0.3, type: 'lift', color: '#00B0FF', icon: '🛗', label: 'Lift' },
    { x: W * 0.15, y: H * 0.7, type: 'lift', color: '#00B0FF', icon: '🛗', label: 'Lift' },
    { x: W * 0.85, y: H * 0.7, type: 'lift', color: '#00B0FF', icon: '🛗', label: 'Lift' },
    { x: W * 0.3, y: H * 0.15, type: 'sensory', color: '#4CAF50', icon: '🧠', label: 'Sensory Room' },
    { x: W * 0.7, y: H * 0.85, type: 'sensory', color: '#4CAF50', icon: '🧠', label: 'Quiet Zone' },
    { x: W * 0.8, y: H * 0.5, type: 'companion', color: '#E91E63', icon: '👥', label: 'Aid Station' },
    { x: W * 0.2, y: H * 0.5, type: 'companion', color: '#E91E63', icon: '👥', label: 'Aid Station' },
  ];
  
  // Accessible paths
  ctx.strokeStyle = 'rgba(255,215,0,0.3)';
  ctx.lineWidth = 3;
  ctx.setLineDash([6, 4]);
  ctx.beginPath();
  ctx.ellipse(W / 2, H / 2, W * 0.4, H * 0.4, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
  
  facilities.forEach(f => {
    // Glow
    ctx.shadowColor = f.color;
    ctx.shadowBlur = 12;
    ctx.fillStyle = f.color + '44';
    ctx.beginPath();
    ctx.arc(f.x, f.y, 18, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = f.color;
    ctx.beginPath();
    ctx.arc(f.x, f.y, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    
    // Label
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.font = '8px Inter';
    ctx.textAlign = 'center';
    ctx.fillText(f.label, f.x, f.y + 22);
  });
}

async function requestAssistance(type) {
  const types = {
    wheelchair: 'Wheelchair escort',
    visual: 'Visual assistance',
    hearing: 'Hearing support',
    medical: 'Medical assistance',
    sensory: 'Sensory support'
  };
  
  const statusEl = document.getElementById('assistanceStatus');
  if (statusEl) {
    statusEl.style.display = 'block';
    statusEl.innerHTML = `
      <div class="alert alert-gold">
        <div class="loader" style="margin-right:8px;"><div class="loader-dot"></div><div class="loader-dot"></div><div class="loader-dot"></div></div>
        Dispatching ${types[type] || type}... AI locating nearest available volunteer.
      </div>
    `;
    
    setTimeout(() => {
      statusEl.innerHTML = `
        <div class="alert alert-green">
          ✅ <strong>${types[type]} confirmed!</strong> Volunteer #${Math.floor(100 + Math.random() * 900)} is on their way. 
          Estimated arrival: <strong>${Math.floor(2 + Math.random() * 4)} minutes</strong>. 
          Stay at your current location.
        </div>
      `;
    }, 2500);
  }
  
  showToast(`🆘 ${types[type]} request sent — locating nearest helper`, 'info');
}

async function quickAccessQuery(query) {
  const input = document.querySelector('#accessChatContainer input');
  if (input) {
    input.value = query;
    await sendChatMessage('accessChatContainer', 'Accessibility services and inclusive support for FIFA World Cup 2026');
  }
}

function switchAccessTab(btn, tabId) {
  const allBtns = btn.closest('.tabs').querySelectorAll('.tab-btn');
  allBtns.forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  
  const card = btn.closest('.card');
  card.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  const target = card.querySelector(`#tab-${tabId}`);
  if (target) target.classList.add('active');
}

function filterFacilities(btn, filter) {
  document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  showToast(`Showing: ${filter} facilities`, 'info', 1500);
}

function activateASL() {
  showToast('🤟 ASL Interpreter Feed activated for your section', 'success');
}

function startAudioDesc() {
  showToast('🎧 Audio description started. Check your earpiece or app.', 'success');
  if ('speechSynthesis' in window) {
    const msg = 'Audio description service is now active. Brazil striker Vinicius Junior approaches the penalty box.';
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(msg));
  }
}

function activateCaptions() {
  showToast('📝 Live captions activated in selected language', 'success');
}

function toggleHighContrast(enabled) {
  document.body.style.filter = enabled ? 'contrast(1.3) brightness(1.1)' : '';
  showToast(`High contrast mode ${enabled ? 'enabled' : 'disabled'}`, 'info');
}

function bookSensoryService(service) {
  showToast(`✅ ${service} booked! Confirmation sent to your device.`, 'success');
}

window.requestAssistance = requestAssistance;
window.quickAccessQuery = quickAccessQuery;
window.switchAccessTab = switchAccessTab;
window.filterFacilities = filterFacilities;
window.activateASL = activateASL;
window.startAudioDesc = startAudioDesc;
window.activateCaptions = activateCaptions;
window.toggleHighContrast = toggleHighContrast;
window.bookSensoryService = bookSensoryService;
