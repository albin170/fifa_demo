/* ========================================
   StadiumIQ 2026 — Crowd Intelligence Module
   Real-time density tracking & management
   ======================================== */

let crowdSimInterval = null;

window.renderCrowd = function(container) {
  container.innerHTML = `
    <div class="section-header">
      <div class="flex items-center gap-md mb-md">
        <span class="tag tag-red">🚦 CROWD INTEL</span>
        <span class="tag tag-green">REAL-TIME</span>
        <span class="tag tag-gold">AI PREDICTIONS</span>
      </div>
      <h2>Crowd Intelligence & Safety Dashboard</h2>
      <p>AI-powered crowd density monitoring, flow optimization, and predictive safety management for all FIFA World Cup 2026 venues.</p>
    </div>

    <!-- Critical Alert Banner -->
    <div class="alert alert-orange mb-lg" role="alert" aria-live="assertive">
      ⚠️ <strong>CROWD ADVISORY:</strong> Sections 101-108 currently at HIGH density (87-93%).
      AI has activated alternate routing via East Concourse. Estimated relief: <strong>8 minutes</strong>.
    </div>

    <!-- Live Density Stats -->
    <div class="grid-4 mb-lg" role="region" aria-label="Crowd density statistics">
      <div class="stat-card red">
        <div class="stat-label">Current Attendance</div>
        <div class="stat-value" id="crowd-total">68,420</div>
        <div class="stat-change" style="color:var(--status-orange);">94.2% capacity</div>
      </div>
      <div class="stat-card red">
        <div class="stat-label">Critical Zones</div>
        <div class="stat-value" id="crowd-critical">3</div>
        <div class="stat-change down">↑ +1 from 5 min ago</div>
      </div>
      <div class="stat-card gold">
        <div class="stat-label">AI Reroutes Active</div>
        <div class="stat-value" id="crowd-reroutes">7</div>
        <div class="stat-change up">✅ Effective</div>
      </div>
      <div class="stat-card green">
        <div class="stat-label">Avg Flow Speed</div>
        <div class="stat-value" id="crowd-speed">1.2<span style="font-size:1rem">m/s</span></div>
        <div class="stat-change up">↑ Normal range</div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid-2 mb-lg">
      <!-- Animated Heatmap -->
      <div class="card" role="region" aria-label="Live crowd density heatmap">
        <div class="card-header">
          <div class="card-title">
            <div class="card-icon red" aria-hidden="true">🔥</div>
            Live Crowd Heatmap
          </div>
          <div class="flex gap-sm items-center">
            <label class="switch" aria-label="Auto-refresh heatmap">
              <input type="checkbox" id="autoRefresh" checked onchange="toggleAutoRefresh(this.checked)">
              <span class="switch-slider"></span>
            </label>
            <span style="font-size:0.75rem; color:var(--text-muted);">Auto-refresh</span>
          </div>
        </div>
        <div class="map-container" style="aspect-ratio:4/3;">
          <canvas id="crowdHeatmap" aria-label="Animated crowd density heatmap"></canvas>
          <div class="map-legend">
            <div class="legend-item"><div class="legend-dot heat-crit"></div>Critical 90%+</div>
            <div class="legend-item"><div class="legend-dot heat-high"></div>High 75-90%</div>
            <div class="legend-item"><div class="legend-dot heat-med"></div>Medium 50-75%</div>
            <div class="legend-item"><div class="legend-dot heat-low"></div>Low &lt;50%</div>
          </div>
        </div>
        <!-- Section Selector -->
        <div class="flex gap-sm mt-md" style="flex-wrap:wrap;">
          <button class="btn btn-ghost btn-sm" onclick="focusSection('north')" aria-label="View north stand">North Stand</button>
          <button class="btn btn-ghost btn-sm" onclick="focusSection('south')" aria-label="View south stand">South Stand</button>
          <button class="btn btn-ghost btn-sm" onclick="focusSection('east')" aria-label="View east stand">East Stand</button>
          <button class="btn btn-ghost btn-sm" onclick="focusSection('west')" aria-label="View west stand">West Stand</button>
          <button class="btn btn-ghost btn-sm" onclick="focusSection('vip')" aria-label="View VIP sections">VIP Box</button>
        </div>
      </div>

      <!-- Section Table -->
      <div class="card" role="region" aria-label="Section by section crowd data">
        <div class="card-header">
          <div class="card-title">
            <div class="card-icon blue" aria-hidden="true">📊</div>
            Section Analysis
          </div>
          <select class="select-field" style="padding:6px 12px; font-size:0.75rem;" 
                  onchange="filterSections(this.value)" aria-label="Filter sections by density">
            <option value="all">All Sections</option>
            <option value="critical">Critical Only</option>
            <option value="high">High Density</option>
            <option value="clear">Clear Sections</option>
          </select>
        </div>
        <div style="overflow:auto; max-height:380px;">
          <table class="data-table" aria-label="Section crowd data table">
            <thead>
              <tr>
                <th scope="col">Section</th>
                <th scope="col">Density</th>
                <th scope="col">Capacity</th>
                <th scope="col">Trend</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody id="sectionTableBody">
              ${renderSectionTable()}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- AI Predictions -->
    <div class="grid-2 mb-lg">
      <!-- Flow Prediction Chart -->
      <div class="card" role="region" aria-label="Crowd flow predictions">
        <div class="card-header">
          <div class="card-title">
            <div class="card-icon gold" aria-hidden="true">📈</div>
            AI Flow Prediction (Next 60 min)
          </div>
          <span class="tag tag-blue">Gemini Forecast</span>
        </div>
        <canvas id="flowPredictionChart" height="200" aria-label="Crowd flow prediction chart for next 60 minutes"></canvas>
        <div class="flex gap-md mt-md" style="flex-wrap:wrap;">
          <div style="display:flex; align-items:center; gap:6px; font-size:0.75rem; color:var(--text-muted);">
            <div style="width:16px; height:2px; background:#C8102E;"></div>
            Current flow
          </div>
          <div style="display:flex; align-items:center; gap:6px; font-size:0.75rem; color:var(--text-muted);">
            <div style="width:16px; height:2px; background:#FFD700; border-top:2px dashed #FFD700;"></div>
            AI Prediction
          </div>
        </div>
      </div>

      <!-- AI Action Panel -->
      <div class="card" role="region" aria-label="AI crowd management actions">
        <div class="card-header">
          <div class="card-title">
            <div class="card-icon red" aria-hidden="true">🎯</div>
            AI Recommended Actions
          </div>
          <button class="btn btn-primary btn-sm" onclick="refreshCrowdAI()" aria-label="Refresh AI recommendations">
            🔄 Refresh AI
          </button>
        </div>
        <div id="crowdAIActions" style="display:flex; flex-direction:column; gap:10px;">
          ${renderCrowdActions()}
        </div>

        <!-- Emergency Controls -->
        <div style="margin-top:20px; padding-top:16px; border-top:1px solid var(--border-glass);">
          <div style="font-size:0.75rem; font-weight:700; color:var(--text-muted); 
                      text-transform:uppercase; letter-spacing:1px; margin-bottom:10px;">
            Emergency Controls
          </div>
          <div class="flex gap-sm" style="flex-wrap:wrap;">
            <button class="btn btn-ghost btn-sm" onclick="triggerEvacPlan()" 
                    style="border-color:rgba(255,23,68,0.4); color:#ff8099;"
                    aria-label="Activate evacuation plan">
              🚨 Evacuation Plan
            </button>
            <button class="btn btn-ghost btn-sm" onclick="lockdownSection()" 
                    style="border-color:rgba(255,109,0,0.4); color:#ff9966;"
                    aria-label="Section lockdown">
              🔒 Section Lockdown
            </button>
            <button class="btn btn-ghost btn-sm" onclick="allClearSignal()"
                    style="border-color:rgba(0,230,118,0.4); color:var(--status-green);"
                    aria-label="All clear signal">
              ✅ All Clear
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- AI Chat -->
    <div class="card" role="region" aria-label="Crowd intelligence AI assistant">
      <div class="card-header">
        <div class="card-title">
          <div class="card-icon blue" aria-hidden="true">🤖</div>
          Crowd Intelligence AI Assistant
        </div>
      </div>
      <div id="crowdChatContainer"></div>
    </div>
  `;

  // Initialize components
  setTimeout(() => {
    const heatmap = document.getElementById('crowdHeatmap');
    if (heatmap) {
      drawStadiumHeatmap(heatmap, 'live');
      startHeatmapAnimation(heatmap);
    }
    drawFlowPredictionChart();
  }, 100);

  createAIChatInterface('crowdChatContainer', 
    'Crowd management, safety monitoring, and flow optimization for FIFA World Cup 2026',
    'E.g., "Which sections need immediate attention?" or "Predict crowd flow at half-time"');
};

function renderSectionTable() {
  const sections = [
    { id: '101', area: 'North Lower', capacity: 2400, density: 93, trend: '↑' },
    { id: '102', area: 'North Lower', capacity: 2400, density: 91, trend: '↑' },
    { id: '103', area: 'North Lower', capacity: 2400, density: 87, trend: '→' },
    { id: '104', area: 'North Lower', capacity: 2400, density: 82, trend: '↑' },
    { id: '108', area: 'East Lower', capacity: 2200, density: 76, trend: '↓' },
    { id: '112', area: 'East Lower', capacity: 2200, density: 64, trend: '→' },
    { id: '118', area: 'South Lower', capacity: 1800, density: 55, trend: '↓' },
    { id: '122', area: 'South Lower', capacity: 2200, density: 48, trend: '↓' },
    { id: '200', area: 'North Upper', capacity: 3200, density: 71, trend: '→' },
    { id: '210', area: 'East Upper', capacity: 3200, density: 59, trend: '↓' },
    { id: 'VIP-A', area: 'VIP Box', capacity: 400, density: 88, trend: '↑' },
  ];

  return sections.map(s => {
    const statusColor = s.density >= 90 ? 'red' : s.density >= 75 ? 'orange' : s.density >= 55 ? 'gold' : 'green';
    const statusLabel = s.density >= 90 ? 'CRITICAL' : s.density >= 75 ? 'HIGH' : s.density >= 55 ? 'MED' : 'LOW';
    const trendColor = s.trend === '↑' ? 'var(--status-red)' : s.trend === '↓' ? 'var(--status-green)' : 'var(--status-yellow)';
    
    return `
      <tr>
        <td><strong style="color:var(--text-primary);">${s.id}</strong></td>
        <td style="font-size:0.78rem; color:var(--text-muted);">${s.area}</td>
        <td>
          <div style="display:flex; align-items:center; gap:8px;">
            <div class="progress-bar-container" style="width:60px; height:4px;">
              <div class="progress-bar ${statusColor === 'red' || statusColor === 'orange' ? 'red' : statusColor === 'gold' ? 'gold' : 'green'}" 
                   style="width:${s.density}%;"></div>
            </div>
            <span style="font-size:0.8rem; font-weight:600; color:var(--text-primary);">${s.density}%</span>
          </div>
        </td>
        <td style="color:${trendColor}; font-weight:700;">${s.trend}</td>
        <td><span class="tag tag-${statusColor}">${statusLabel}</span></td>
      </tr>
    `;
  }).join('');
}

function renderCrowdActions() {
  const actions = [
    { 
      priority: 'URGENT', color: 'red', icon: '🚨',
      action: 'Open Gate F emergency overflow', 
      impact: 'Reduce Sections 101-103 by ~15%',
      implemented: false
    },
    { 
      priority: 'HIGH', color: 'orange', icon: '🚦',
      action: 'Activate secondary food court B',
      impact: 'Divert 800+ fans from crowded concourse',
      implemented: true
    },
    { 
      priority: 'HIGH', color: 'orange', icon: '📣',
      action: 'Broadcast "Use East exits" announcement',
      impact: 'Improve post-match exit flow by 23%',
      implemented: false
    },
    { 
      priority: 'MEDIUM', color: 'gold', icon: '🚌',
      action: 'Deploy 3 additional shuttle buses',
      impact: 'Reduce Lot A queuing by 40%',
      implemented: true
    },
  ];
  
  return actions.map(a => `
    <div style="display:flex; align-items:flex-start; gap:10px; padding:12px; 
                background:var(--bg-glass); border-radius:10px; 
                border-left:3px solid var(--${a.color === 'red' ? 'fifa-red' : a.color === 'orange' ? 'status-orange' : 'fifa-gold'});">
      <span style="font-size:1.2rem;" aria-hidden="true">${a.icon}</span>
      <div style="flex:1;">
        <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
          <span class="tag tag-${a.color}">${a.priority}</span>
          ${a.implemented ? '<span class="tag tag-green">✅ ACTIVE</span>' : ''}
        </div>
        <div style="font-size:0.85rem; font-weight:600; color:var(--text-primary); margin-bottom:2px;">${a.action}</div>
        <div style="font-size:0.75rem; color:var(--text-muted);">${a.impact}</div>
      </div>
      ${!a.implemented ? `
        <button class="btn btn-ghost btn-sm" 
                onclick="implementAction(this, '${a.action}')"
                aria-label="Implement action: ${a.action}">
          Implement
        </button>
      ` : ''}
    </div>
  `).join('');
}

function startHeatmapAnimation(canvas) {
  let tick = 0;
  
  if (crowdSimInterval) clearInterval(crowdSimInterval);
  
  crowdSimInterval = setInterval(() => {
    if (document.getElementById('autoRefresh')?.checked) {
      tick++;
      drawStadiumHeatmap(canvas, 'live');
    }
  }, 3000);
}

function toggleAutoRefresh(enabled) {
  if (!enabled && crowdSimInterval) {
    clearInterval(crowdSimInterval);
  } else if (enabled) {
    const canvas = document.getElementById('crowdHeatmap');
    if (canvas) startHeatmapAnimation(canvas);
  }
}

function drawFlowPredictionChart() {
  const canvas = document.getElementById('flowPredictionChart');
  if (!canvas) return;
  
  const W = canvas.width = canvas.offsetWidth || 400;
  const H = canvas.height = 200;
  const ctx = canvas.getContext('2d');
  
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.fillRect(0, 0, W, H);
  
  const timeLabels = ['-30', '-20', '-10', 'Now', '+10', '+20', '+30', '+45', '+60'];
  const actualData = [58, 65, 72, 87, null, null, null, null, null];
  const predictData = [null, null, null, 87, 91, 88, 82, 74, 68];
  
  const padX = 30, padY = 20;
  const chartW = W - padX * 2, chartH = H - padY * 2;
  
  // Grid
  ctx.strokeStyle = 'rgba(255,255,255,0.05)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = padY + (chartH / 4) * i;
    ctx.beginPath();
    ctx.moveTo(padX, y);
    ctx.lineTo(W - padX, y);
    ctx.stroke();
    
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = '9px Inter';
    ctx.textAlign = 'right';
    ctx.fillText((100 - i * 25) + '%', padX - 2, y + 3);
  }
  
  // X labels
  timeLabels.forEach((label, i) => {
    const x = padX + (i / (timeLabels.length - 1)) * chartW;
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = '8px Inter';
    ctx.textAlign = 'center';
    ctx.fillText(label, x, H - 4);
  });
  
  // Draw actual data line
  ctx.strokeStyle = '#C8102E';
  ctx.lineWidth = 2.5;
  ctx.shadowColor = '#C8102E';
  ctx.shadowBlur = 6;
  ctx.beginPath();
  let started = false;
  actualData.forEach((val, i) => {
    if (val === null) return;
    const x = padX + (i / (timeLabels.length - 1)) * chartW;
    const y = padY + (1 - val / 100) * chartH;
    if (!started) { ctx.moveTo(x, y); started = true; }
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
  ctx.shadowBlur = 0;
  
  // Draw prediction line (dashed)
  ctx.strokeStyle = '#FFD700';
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 3]);
  ctx.shadowColor = '#FFD700';
  ctx.shadowBlur = 4;
  ctx.beginPath();
  started = false;
  predictData.forEach((val, i) => {
    if (val === null) return;
    const x = padX + (i / (timeLabels.length - 1)) * chartW;
    const y = padY + (1 - val / 100) * chartH;
    if (!started) { ctx.moveTo(x, y); started = true; }
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.shadowBlur = 0;
  
  // "NOW" marker
  const nowX = padX + (3 / (timeLabels.length - 1)) * chartW;
  ctx.strokeStyle = 'rgba(255,255,255,0.4)';
  ctx.lineWidth = 1;
  ctx.setLineDash([3, 3]);
  ctx.beginPath();
  ctx.moveTo(nowX, padY);
  ctx.lineTo(nowX, H - padY);
  ctx.stroke();
  ctx.setLineDash([]);
  
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.font = 'bold 9px Inter';
  ctx.textAlign = 'center';
  ctx.fillText('NOW', nowX, padY - 6);
}

async function refreshCrowdAI() {
  showToast('🤖 Refreshing AI crowd analysis...', 'info', 2000);
  
  const data = {
    totalAttendance: 68420,
    criticalSections: ['101', '102', '103'],
    avgDensity: 78,
    incidentCount: 2,
    weatherCondition: 'Clear, 24°C',
    minuteOfMatch: 73,
  };
  
  const analysis = await GeminiAI.analyzeCrowdSafety(data);
  
  const panel = document.getElementById('crowdAIActions');
  if (panel) {
    panel.innerHTML = `
      <div class="alert alert-blue" style="margin:0;">🤖 <strong>AI Analysis:</strong></div>
      <div style="font-size:0.85rem; line-height:1.7; color:var(--text-primary); 
                  background:rgba(0,0,0,0.2); border-radius:10px; padding:14px;">
        ${formatAIResponse(analysis)}
      </div>
    `;
  }
}

function implementAction(btn, action) {
  btn.textContent = '✅ Done';
  btn.disabled = true;
  btn.style.borderColor = 'var(--status-green)';
  btn.style.color = 'var(--status-green)';
  showToast(`✅ Action implemented: ${action}`, 'success');
}

function triggerEvacPlan() {
  if (confirm('⚠️ Are you sure you want to activate the Evacuation Plan? This will broadcast to all staff.')) {
    showToast('🚨 EVACUATION PLAN ACTIVATED — All staff notified via AI broadcast', 'error', 8000);
  }
}

function lockdownSection() {
  showToast('🔒 Section lockdown protocol initiated — Security teams notified', 'warning');
}

function allClearSignal() {
  showToast('✅ All Clear signal broadcast to all staff and fans', 'success');
}

function focusSection(area) {
  showToast(`📍 Focusing on ${area.toUpperCase()} stand...`, 'info', 2000);
  const canvas = document.getElementById('crowdHeatmap');
  if (canvas) drawStadiumHeatmap(canvas, 'live');
}

function filterSections(filter) {
  showToast(`Filtering sections: ${filter}`, 'info', 1500);
}

window.toggleAutoRefresh = toggleAutoRefresh;
window.refreshCrowdAI = refreshCrowdAI;
window.implementAction = implementAction;
window.triggerEvacPlan = triggerEvacPlan;
window.lockdownSection = lockdownSection;
window.allClearSignal = allClearSignal;
window.focusSection = focusSection;
window.filterSections = filterSections;
