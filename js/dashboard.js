/* ========================================
   StadiumIQ 2026 — Dashboard Module
   Command Center with Live KPIs
   ======================================== */

window.renderDashboard = function(container) {
  // Live data simulation
  const stats = {
    attendance: Math.floor(67000 + Math.random() * 3000),
    crowdDensity: Math.floor(78 + Math.random() * 12),
    activeVolunteers: Math.floor(320 + Math.random() * 40),
    shuttlesRunning: Math.floor(24 + Math.random() * 6),
    co2Saved: (12.4 + Math.random() * 2).toFixed(1),
    incidents: Math.floor(2 + Math.random() * 3),
    satisfactionScore: (4.6 + Math.random() * 0.3).toFixed(1),
    aiAlertsToday: Math.floor(47 + Math.random() * 15),
  };

  container.innerHTML = `
    <!-- Hero Banner -->
    <div class="hero-banner" role="region" aria-label="Match Day Overview">
      <div style="position:relative; z-index:1;">
        <div class="flex items-center gap-md mb-md">
          <span class="tag tag-green">🟢 LIVE</span>
          <span class="tag tag-gold">Match Day 12</span>
          <span class="tag tag-blue">MetLife Stadium · New Jersey</span>
        </div>
        <h1 style="font-size: clamp(1.6rem, 4vw, 2.8rem); margin-bottom: 0.5rem;">
          ⚡ StadiumIQ Command Center
        </h1>
        <p style="font-size:1rem; color: rgba(255,255,255,0.7); max-width: 600px; margin-bottom: 1.5rem;">
          AI-powered intelligence for FIFA World Cup 2026 — Real-time crowd management, 
          fan experience, and operational decision support.
        </p>
        <div class="flex gap-sm" style="flex-wrap:wrap;">
          <button class="btn btn-primary" onclick="navigateTo('crowd')" aria-label="View crowd intelligence">
            🚦 Crowd Intel
          </button>
          <button class="btn btn-secondary" onclick="navigateTo('navigation')" aria-label="AI navigation">
            🧭 Navigate
          </button>
          <button class="btn btn-gold" onclick="navigateTo('decision')" aria-label="Decision support">
            🎯 AI Advisor
          </button>
        </div>
      </div>
      <!-- Floating Match Score -->
      <div style="position:absolute; top:24px; right:32px; text-align:center; z-index:1; background: rgba(0,0,0,0.4); 
                  border: 1px solid rgba(255,215,0,0.3); border-radius: 16px; padding: 16px 24px; backdrop-filter:blur(10px);">
        <div style="font-size:0.7rem; color: var(--fifa-gold); font-weight:700; letter-spacing:1px; margin-bottom:8px;">LIVE MATCH</div>
        <div style="font-size:2rem; font-weight:900; font-family: var(--font-display);">🇧🇷 3 — 2 🇩🇪</div>
        <div style="font-size:0.75rem; color: var(--text-secondary); margin-top:4px;">Brazil vs Germany · 73'</div>
        <div style="margin-top: 8px;">
          <span class="tag tag-red">⚽ GOAL ALERT</span>
        </div>
      </div>
    </div>

    <!-- KPI Stats Row -->
    <div class="grid-4 mb-lg" role="region" aria-label="Key performance indicators">
      <div class="stat-card blue" role="article">
        <div class="stat-label">Total Attendance</div>
        <div class="stat-value" id="stat-attendance">${stats.attendance.toLocaleString()}</div>
        <div class="stat-change up" aria-label="trending up">↑ 94.2% capacity</div>
      </div>
      <div class="stat-card red" role="article">
        <div class="stat-label">Crowd Density</div>
        <div class="stat-value" id="stat-density">${stats.crowdDensity}%</div>
        <div class="stat-change" style="color: var(--status-orange);" aria-label="status">⚠ Sections 101-108 HIGH</div>
      </div>
      <div class="stat-card green" role="article">
        <div class="stat-label">Active Volunteers</div>
        <div class="stat-value">${stats.activeVolunteers}</div>
        <div class="stat-change up" aria-label="trending up">↑ 12 dispatched today</div>
      </div>
      <div class="stat-card gold" role="article">
        <div class="stat-label">Fan Satisfaction</div>
        <div class="stat-value">${stats.satisfactionScore}/5</div>
        <div class="stat-change up" aria-label="trending up">↑ +0.3 from yesterday</div>
      </div>
    </div>

    <!-- Second Row Stats -->
    <div class="grid-4 mb-lg" role="region" aria-label="Secondary metrics">
      <div class="stat-card green">
        <div class="stat-label">CO₂ Saved (tonnes)</div>
        <div class="stat-value">${stats.co2Saved}</div>
        <div class="stat-change up">🌱 Green target: on track</div>
      </div>
      <div class="stat-card blue">
        <div class="stat-label">Shuttles Running</div>
        <div class="stat-value">${stats.shuttlesRunning}</div>
        <div class="stat-change up">↑ 3 added for surge</div>
      </div>
      <div class="stat-card red">
        <div class="stat-label">Active Incidents</div>
        <div class="stat-value">${stats.incidents}</div>
        <div class="stat-change" style="color:var(--status-yellow)">⚡ ${stats.incidents} being resolved</div>
      </div>
      <div class="stat-card gold">
        <div class="stat-label">AI Alerts Today</div>
        <div class="stat-value">${stats.aiAlertsToday}</div>
        <div class="stat-change up">🤖 AI handled 94%</div>
      </div>
    </div>

    <!-- Main Dashboard Grid -->
    <div class="grid-2 mb-lg">
      <!-- Crowd Heatmap -->
      <div class="card" role="region" aria-label="Stadium crowd heatmap">
        <div class="card-header">
          <div class="card-title">
            <div class="card-icon red" aria-hidden="true">🚦</div>
            Live Crowd Heatmap
          </div>
          <div class="flex gap-sm items-center">
            <span class="tag tag-green">LIVE</span>
            <button class="btn btn-ghost btn-sm" onclick="navigateTo('crowd')" aria-label="View full crowd map">Full View →</button>
          </div>
        </div>
        <div class="map-container" style="aspect-ratio: 16/10;">
          <canvas id="dashboardHeatmap" aria-label="Crowd density heatmap for MetLife Stadium"></canvas>
          <div class="map-legend" aria-label="Heatmap legend">
            <div class="legend-item"><div class="legend-dot heat-low"></div>Low (0-50%)</div>
            <div class="legend-item"><div class="legend-dot heat-med"></div>Medium (50-75%)</div>
            <div class="legend-item"><div class="legend-dot heat-high"></div>High (75-90%)</div>
            <div class="legend-item"><div class="legend-dot heat-crit"></div>Critical (90%+)</div>
          </div>
        </div>
      </div>

      <!-- AI Alert Feed -->
      <div class="card" role="region" aria-label="AI alert feed">
        <div class="card-header">
          <div class="card-title">
            <div class="card-icon gold" aria-hidden="true">🎯</div>
            AI Alert Feed
          </div>
          <span class="tag tag-red">REAL-TIME</span>
        </div>
        <div id="alertFeed" style="display:flex; flex-direction:column; gap:8px; max-height:320px; overflow-y:auto;"
             aria-live="polite" aria-label="Live AI alerts">
          ${generateAlertFeed()}
        </div>
        <button class="btn btn-ghost btn-sm btn-full mt-md" onclick="navigateTo('decision')" 
                aria-label="View all alerts in decision support">
          View All in Decision Support →
        </button>
      </div>
    </div>

    <!-- Module Quick Access -->
    <div class="card mb-lg" role="region" aria-label="Quick access to modules">
      <div class="card-header">
        <div class="card-title">
          <div class="card-icon blue" aria-hidden="true">⚡</div>
          AI Module Quick Access
        </div>
        <span class="tag tag-gold">8 Modules Active</span>
      </div>
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px;">
        ${renderModuleCards()}
      </div>
    </div>

    <!-- Bottom Grid -->
    <div class="grid-2">
      <!-- Transport Status -->
      <div class="card" role="region" aria-label="Transport status">
        <div class="card-header">
          <div class="card-title">
            <div class="card-icon blue" aria-hidden="true">🚌</div>
            Transport Dashboard
          </div>
          <button class="btn btn-ghost btn-sm" onclick="navigateTo('transport')">Full →</button>
        </div>
        ${renderTransportMini()}
      </div>

      <!-- Sustainability Snapshot -->
      <div class="card" role="region" aria-label="Sustainability snapshot">
        <div class="card-header">
          <div class="card-title">
            <div class="card-icon green" aria-hidden="true">🌱</div>
            Sustainability Snapshot
          </div>
          <button class="btn btn-ghost btn-sm" onclick="navigateTo('sustainability')">Full →</button>
        </div>
        ${renderSustainabilityMini()}
      </div>
    </div>
  `;

  // Initialize heatmap
  setTimeout(() => {
    const canvas = document.getElementById('dashboardHeatmap');
    if (canvas) drawStadiumHeatmap(canvas, 'dashboard');
  }, 100);

  // Auto-refresh stats
  setInterval(() => {
    const attendance = document.getElementById('stat-attendance');
    const density = document.getElementById('stat-density');
    if (attendance) {
      const newAtt = Math.floor(67000 + Math.random() * 3000);
      attendance.textContent = newAtt.toLocaleString();
    }
    if (density) {
      density.textContent = Math.floor(78 + Math.random() * 12) + '%';
    }
  }, 5000);
};

function generateAlertFeed() {
  const alerts = [
    { icon: '🚦', level: 'orange', time: '21:07', msg: 'Section 104 at 91% capacity — rerouting activated via AI' },
    { icon: '🤖', level: 'blue', time: '21:05', msg: 'AI predicted 2,400 fans leaving at 87th minute — gates pre-opened' },
    { icon: '🌱', level: 'green', time: '21:03', msg: 'Recycling target exceeded — 340 kg waste diverted from landfill' },
    { icon: '🚌', level: 'blue', time: '20:58', msg: 'Shuttle surge detected — 4 additional buses deployed to Lot C' },
    { icon: '♿', level: 'gold', time: '20:55', msg: 'Accessibility escort completed — Gate F to Section 118' },
    { icon: '⚽', level: 'red', time: '20:52', msg: 'GOAL ALERT: Crowd surge at North gates — security alerted' },
    { icon: '🌍', level: 'blue', time: '20:48', msg: 'Portuguese translation broadcast sent to Sections 200-220' },
    { icon: '🎯', level: 'gold', time: '20:45', msg: 'AI recommendation: Open secondary food court — adopted' },
  ];
  
  return alerts.map(a => `
    <div class="alert alert-${a.level === 'orange' ? 'orange' : a.level === 'red' ? 'red' : a.level === 'gold' ? 'gold' : a.level === 'green' ? 'green' : 'blue'}"
         style="margin:0; padding:10px 14px;">
      <span aria-hidden="true">${a.icon}</span>
      <div style="flex:1;">
        <div style="font-size:0.8rem; color: var(--text-primary);">${a.msg}</div>
        <div style="font-size:0.65rem; color: var(--text-muted); margin-top:2px;">${a.time}</div>
      </div>
    </div>
  `).join('');
}

function renderModuleCards() {
  const modules = [
    { id: 'navigation', icon: '🧭', title: 'AI Navigation', desc: 'Smart wayfinding', color: 'blue' },
    { id: 'crowd', icon: '🚦', title: 'Crowd Intel', desc: 'Density analytics', color: 'red' },
    { id: 'accessibility', icon: '♿', title: 'Accessibility', desc: 'Inclusive support', color: 'gold' },
    { id: 'transport', icon: '🚌', title: 'Transport AI', desc: 'Journey optimizer', color: 'blue' },
    { id: 'sustainability', icon: '🌱', title: 'Eco Tracker', desc: 'CO₂ monitoring', color: 'green' },
    { id: 'multilingual', icon: '🌍', title: 'Global AI', desc: '50+ languages', color: 'purple' },
    { id: 'operations', icon: '📊', title: 'Ops Intel', desc: 'Staff dashboard', color: 'orange' },
    { id: 'decision', icon: '🎯', title: 'Decision AI', desc: 'Real-time advisor', color: 'red' },
  ];
  
  return modules.map(m => `
    <button onclick="navigateTo('${m.id}')" 
            class="card" 
            style="cursor:pointer; text-align:left; padding:16px; border:none; background:var(--bg-card);"
            aria-label="Navigate to ${m.title} module">
      <div style="font-size:1.8rem; margin-bottom:8px;" aria-hidden="true">${m.icon}</div>
      <div style="font-weight:700; font-size:0.875rem; color:var(--text-primary); margin-bottom:4px;">${m.title}</div>
      <div style="font-size:0.75rem; color:var(--text-muted);">${m.desc}</div>
    </button>
  `).join('');
}

function renderTransportMini() {
  const routes = [
    { route: 'Metro Line 3 ↔ Stadium', status: 'Running', eta: '3 min', color: 'green' },
    { route: 'Shuttle Lot A → Gate B', status: 'Running', eta: '8 min', color: 'green' },
    { route: 'Shuttle Lot C → Gate D', status: 'Surge', eta: '15 min', color: 'orange' },
    { route: 'Bus 201 (Midtown)', status: 'Delayed', eta: '22 min', color: 'red' },
  ];
  
  return `<div style="display:flex; flex-direction:column; gap:8px;">
    ${routes.map(r => `
      <div style="display:flex; align-items:center; justify-content:space-between; 
                  padding:10px 14px; background:var(--bg-glass); border-radius:10px;">
        <div>
          <div style="font-size:0.8rem; font-weight:600; color:var(--text-primary);">${r.route}</div>
          <div style="font-size:0.7rem; color:var(--text-muted);">ETA: ${r.eta}</div>
        </div>
        <span class="tag tag-${r.color === 'green' ? 'green' : r.color === 'orange' ? 'orange' : 'red'}">${r.status}</span>
      </div>
    `).join('')}
  </div>`;
}

function renderSustainabilityMini() {
  const metrics = [
    { label: 'CO₂ Offset', value: 92, unit: '%', color: 'green' },
    { label: 'Waste Recycled', value: 76, unit: '%', color: 'blue' },
    { label: 'Renewable Energy', value: 88, unit: '%', color: 'gold' },
    { label: 'Water Saved', value: 65, unit: '%', color: 'green' },
  ];
  
  return `<div style="display:flex; flex-direction:column; gap:14px;">
    ${metrics.map(m => `
      <div>
        <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
          <span style="font-size:0.8rem; color:var(--text-secondary);">${m.label}</span>
          <span style="font-size:0.8rem; font-weight:700; color:var(--text-primary);">${m.value}${m.unit}</span>
        </div>
        <div class="progress-bar-container">
          <div class="progress-bar ${m.color}" style="width:${m.value}%;"></div>
        </div>
      </div>
    `).join('')}
  </div>`;
}

// ---- Stadium Heatmap Drawing ----
function drawStadiumHeatmap(canvas, mode = 'full') {
  const W = canvas.width = canvas.offsetWidth || 600;
  const H = canvas.height = canvas.offsetHeight || 400;
  const ctx = canvas.getContext('2d');
  
  // Background
  ctx.fillStyle = '#010D1F';
  ctx.fillRect(0, 0, W, H);
  
  // Draw pitch (center)
  const pitchW = W * 0.35;
  const pitchH = H * 0.45;
  const pitchX = (W - pitchW) / 2;
  const pitchY = (H - pitchH) / 2;
  
  ctx.fillStyle = '#1a3d1a';
  ctx.strokeStyle = '#2d6b2d';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(pitchX, pitchY, pitchW, pitchH, 6);
  ctx.fill();
  ctx.stroke();
  
  // Pitch markings
  ctx.strokeStyle = 'rgba(255,255,255,0.3)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(W / 2, pitchY);
  ctx.lineTo(W / 2, pitchY + pitchH);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.arc(W / 2, H / 2, Math.min(pitchW, pitchH) * 0.2, 0, Math.PI * 2);
  ctx.stroke();
  
  // Draw sections with density colors
  const sections = generateSectionData(W, H, pitchX, pitchY, pitchW, pitchH);
  
  sections.forEach(section => {
    const gradient = ctx.createRadialGradient(
      section.cx, section.cy, 0,
      section.cx, section.cy, section.r
    );
    gradient.addColorStop(0, section.color + 'cc');
    gradient.addColorStop(1, section.color + '22');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.ellipse(section.cx, section.cy, section.rw, section.rh, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Section label
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.font = `bold ${Math.max(10, W * 0.018)}px Inter`;
    ctx.textAlign = 'center';
    ctx.fillText(section.label, section.cx, section.cy + 4);
  });
  
  // Overlay: "METLIFE STADIUM" text
  ctx.fillStyle = 'rgba(255,215,0,0.6)';
  ctx.font = `bold ${W * 0.025}px Outfit`;
  ctx.textAlign = 'center';
  ctx.fillText('MetLife Stadium', W / 2, H - 14);
  
  // Animate heatmap with subtle pulse
  if (mode === 'live') {
    let frame = 0;
    const animate = () => {
      frame++;
      // subtle variation
      ctx.globalAlpha = 0.1;
      ctx.fillStyle = `hsl(${frame % 360}, 60%, 50%)`;
      ctx.fillRect(0, 0, W, H);
      ctx.globalAlpha = 1;
      requestAnimationFrame(animate);
    };
    // Don't animate for performance on dashboard
  }
}

function generateSectionData(W, H, pitchX, pitchY, pitchW, pitchH) {
  const colors = [
    '#FF1744', // critical red
    '#FF6D00', // high orange
    '#FFD740', // medium yellow
    '#00E676', // low green
  ];
  
  const densities = [
    0.91, 0.75, 0.65, 0.88, 0.72, 0.85, 0.60, 0.93, // around pitch
    0.55, 0.70, 0.82, 0.45, 0.76, 0.50, // upper sections
  ];
  
  const getColor = (d) => {
    if (d >= 0.9) return colors[0];
    if (d >= 0.75) return colors[1];
    if (d >= 0.6) return colors[2];
    return colors[3];
  };
  
  const margin = 30;
  const sections = [];
  
  // Ring of sections around the pitch
  const cx = W / 2, cy = H / 2;
  const angles = 8;
  for (let i = 0; i < angles; i++) {
    const angle = (i / angles) * Math.PI * 2;
    const radius = Math.min(W, H) * 0.38;
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;
    const d = densities[i];
    
    sections.push({
      cx: x, cy: y,
      rw: 45, rh: 35, r: 50,
      color: getColor(d),
      label: `${100 + i}`,
    });
  }
  
  // Corner sections
  [[margin, margin], [W - margin, margin], [margin, H - margin], [W - margin, H - margin]].forEach((pos, i) => {
    const d = densities[8 + i] || 0.6;
    sections.push({
      cx: pos[0], cy: pos[1],
      rw: 35, rh: 25, r: 40,
      color: getColor(d),
      label: `2${i}0`,
    });
  });
  
  return sections;
}

window.drawStadiumHeatmap = drawStadiumHeatmap;
