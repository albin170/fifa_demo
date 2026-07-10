/* ========================================
   StadiumIQ 2026 — SPA Router & App Shell
   ======================================== */

// ---- Application State ----
const AppState = {
  currentPage: 'dashboard',
  apiKey: localStorage.getItem('gemini_api_key') || '',
  language: localStorage.getItem('preferred_language') || 'English',
  userRole: localStorage.getItem('user_role') || 'fan',
  notifications: [],
  isLoading: false,
  sidebarOpen: false,
};

// ---- Page Registry ----
const PAGES = {
  dashboard:      { title: 'Command Center',         icon: '⚡', component: 'renderDashboard' },
  navigation:     { title: 'AI Navigation',          icon: '🧭', component: 'renderNavigation' },
  crowd:          { title: 'Crowd Intelligence',     icon: '🚦', component: 'renderCrowd' },
  accessibility:  { title: 'Accessibility Hub',      icon: '♿', component: 'renderAccessibility' },
  transport:      { title: 'Smart Transport',        icon: '🚌', component: 'renderTransport' },
  sustainability: { title: 'Sustainability AI',      icon: '🌱', component: 'renderSustainability' },
  multilingual:   { title: 'Global Concierge',       icon: '🌍', component: 'renderMultilingual' },
  operations:     { title: 'Ops Intelligence',       icon: '📊', component: 'renderOperations' },
  decision:       { title: 'Decision Support',       icon: '🎯', component: 'renderDecision' },
  settings:       { title: 'Settings',               icon: '⚙️', component: 'renderSettings' },
};

// ---- Initialize App ----
document.addEventListener('DOMContentLoaded', () => {
  renderShell();
  navigateTo('dashboard');
  startLiveDataSimulation();
  initKeyboardShortcuts();
  
  // Welcome toast
  setTimeout(() => showToast('🏆 StadiumIQ 2026 loaded — AI modules active', 'success'), 800);
});

// ---- Render App Shell ----
function renderShell() {
  document.getElementById('app').innerHTML = `
    <!-- Toast Container -->
    <div class="toast-container" id="toastContainer" role="status" aria-live="polite"></div>
    
    <!-- Page Overlay (mobile sidebar) -->
    <div class="page-overlay" id="pageOverlay" onclick="closeSidebar()"></div>

    <!-- Sidebar -->
    <aside class="sidebar" id="sidebar" role="navigation" aria-label="Main navigation">
      <div class="sidebar-logo">
        <div class="logo-icon" aria-hidden="true">⚽</div>
        <div class="logo-text">
          <span class="logo-title">StadiumIQ</span>
          <span class="logo-sub">FIFA World Cup 2026</span>
        </div>
      </div>

      <!-- Role Selector -->
      <div class="sidebar-section">
        <div class="sidebar-section-title">Your Role</div>
        <select class="select-field w-full" id="roleSelector" onchange="changeRole(this.value)" aria-label="Select your role">
          <option value="fan">⚽ Fan</option>
          <option value="staff">👷 Venue Staff</option>
          <option value="volunteer">🙋 Volunteer</option>
          <option value="organizer">📋 Organizer</option>
          <option value="security">🛡️ Security</option>
        </select>
      </div>

      <!-- Main Navigation -->
      <div class="sidebar-section">
        <div class="sidebar-section-title">Platform</div>
        <ul class="sidebar-nav" role="list">
          <li class="nav-item">
            <button class="nav-link" id="nav-dashboard" onclick="navigateTo('dashboard')" aria-label="Command Center dashboard">
              <span class="nav-icon" aria-hidden="true">⚡</span>
              Command Center
              <span class="nav-badge green">LIVE</span>
            </button>
          </li>
          <li class="nav-item">
            <button class="nav-link" id="nav-navigation" onclick="navigateTo('navigation')" aria-label="AI Navigation">
              <span class="nav-icon" aria-hidden="true">🧭</span>
              AI Navigation
            </button>
          </li>
          <li class="nav-item">
            <button class="nav-link" id="nav-crowd" onclick="navigateTo('crowd')" aria-label="Crowd Intelligence">
              <span class="nav-icon" aria-hidden="true">🚦</span>
              Crowd Intelligence
              <span class="nav-badge" id="crowdAlert" style="display:none">!</span>
            </button>
          </li>
          <li class="nav-item">
            <button class="nav-link" id="nav-accessibility" onclick="navigateTo('accessibility')" aria-label="Accessibility Hub">
              <span class="nav-icon" aria-hidden="true">♿</span>
              Accessibility Hub
            </button>
          </li>
          <li class="nav-item">
            <button class="nav-link" id="nav-transport" onclick="navigateTo('transport')" aria-label="Smart Transport">
              <span class="nav-icon" aria-hidden="true">🚌</span>
              Smart Transport
            </button>
          </li>
          <li class="nav-item">
            <button class="nav-link" id="nav-sustainability" onclick="navigateTo('sustainability')" aria-label="Sustainability AI">
              <span class="nav-icon" aria-hidden="true">🌱</span>
              Sustainability AI
            </button>
          </li>
          <li class="nav-item">
            <button class="nav-link" id="nav-multilingual" onclick="navigateTo('multilingual')" aria-label="Global Concierge">
              <span class="nav-icon" aria-hidden="true">🌍</span>
              Global Concierge
              <span class="nav-badge gold">50+</span>
            </button>
          </li>
          <li class="nav-item">
            <button class="nav-link" id="nav-operations" onclick="navigateTo('operations')" aria-label="Operations Intelligence">
              <span class="nav-icon" aria-hidden="true">📊</span>
              Ops Intelligence
            </button>
          </li>
          <li class="nav-item">
            <button class="nav-link" id="nav-decision" onclick="navigateTo('decision')" aria-label="Decision Support">
              <span class="nav-icon" aria-hidden="true">🎯</span>
              Decision Support
            </button>
          </li>
        </ul>
      </div>

      <!-- Bottom -->
      <div class="sidebar-bottom">
        <button class="nav-link" onclick="navigateTo('settings')" aria-label="Settings">
          <span class="nav-icon" aria-hidden="true">⚙️</span>
          Settings
        </button>
        <div class="sidebar-status mt-sm">
          <span class="status-dot" aria-hidden="true"></span>
          <span>AI Modules: <strong>8/8 Active</strong></span>
        </div>
      </div>
    </aside>

    <!-- Main Content Area -->
    <div class="main-content">
      <!-- Topbar -->
      <header class="topbar" role="banner">
        <div class="topbar-left">
          <button class="hamburger-btn" onclick="toggleSidebar()" aria-label="Toggle navigation" aria-expanded="false" id="hamburgerBtn">☰</button>
          <div>
            <div class="page-title" id="pageTitle">Command Center</div>
            <div class="page-breadcrumb" id="pageBreadcrumb">FIFA World Cup 2026 · Real-time Intelligence</div>
          </div>
        </div>
        <div class="topbar-right">
          <div class="topbar-badge" aria-label="Current time">
            <span class="live-dot" aria-hidden="true"></span>
            <span id="liveTime">--:--</span>
          </div>
          <div class="topbar-badge" id="matchStatus" aria-label="Match status">
            🏟️ Match Day 12
          </div>
          <div class="ai-status-pill" aria-label="AI status">
            🤖 Gemini AI · Active
          </div>
        </div>
      </header>

      <!-- Dynamic Page Content -->
      <main class="page-content" id="pageContent" role="main" aria-label="Page content">
        <!-- Rendered dynamically -->
      </main>
    </div>
  `;

  // Set role selector initial value
  document.getElementById('roleSelector').value = AppState.userRole;
  
  // Start clock
  updateClock();
  setInterval(updateClock, 1000);
}

// ---- Navigation ----
function navigateTo(page) {
  if (!PAGES[page]) return;
  
  AppState.currentPage = page;
  const pageInfo = PAGES[page];
  
  // Update active nav
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  const navEl = document.getElementById(`nav-${page}`);
  if (navEl) navEl.classList.add('active');
  
  // Update topbar
  document.getElementById('pageTitle').textContent = pageInfo.title;
  document.getElementById('pageBreadcrumb').textContent = 
    `FIFA World Cup 2026 · ${pageInfo.title}`;
  
  // Render page content
  const content = document.getElementById('pageContent');
  content.innerHTML = '';
  content.style.opacity = '0';
  
  // Dispatch to renderer
  if (window[pageInfo.component]) {
    window[pageInfo.component](content);
  }
  
  // Animate in
  requestAnimationFrame(() => {
    content.style.transition = 'opacity 0.25s ease';
    content.style.opacity = '1';
  });

  // Close mobile sidebar
  if (window.innerWidth <= 768) closeSidebar();
}

// ---- Sidebar Controls ----
function toggleSidebar() {
  AppState.sidebarOpen = !AppState.sidebarOpen;
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('pageOverlay');
  const btn = document.getElementById('hamburgerBtn');
  
  sidebar.classList.toggle('open', AppState.sidebarOpen);
  overlay.classList.toggle('visible', AppState.sidebarOpen);
  btn.setAttribute('aria-expanded', AppState.sidebarOpen.toString());
}

function closeSidebar() {
  AppState.sidebarOpen = false;
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('pageOverlay').classList.remove('visible');
  document.getElementById('hamburgerBtn').setAttribute('aria-expanded', 'false');
}

// ---- Role Change ----
function changeRole(role) {
  AppState.userRole = role;
  localStorage.setItem('user_role', role);
  showToast(`Role changed to ${role}. Interface updating...`, 'info');
  navigateTo(AppState.currentPage);
}

// ---- Clock ----
function updateClock() {
  const now = new Date();
  const time = now.toLocaleTimeString('en-US', { 
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false 
  });
  const el = document.getElementById('liveTime');
  if (el) el.textContent = time;
}

// ---- Toast Notifications ----
function showToast(message, type = 'info', duration = 4000) {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  
  const icons = { success: '✅', warning: '⚠️', error: '❌', info: 'ℹ️' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.setAttribute('role', 'alert');
  toast.innerHTML = `<span aria-hidden="true">${icons[type] || 'ℹ️'}</span> ${message}`;
  
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ---- Live Data Simulation ----
function startLiveDataSimulation() {
  // Simulate alerts periodically
  const alerts = [
    { msg: '🚦 Section 104 reaching HIGH density — rerouting recommended', type: 'warning' },
    { msg: '🚌 Shuttle Bus #12 arriving at Gate B in 3 minutes', type: 'info' },
    { msg: '🌱 Stadium CO₂ offset milestone: 50 tonnes reached!', type: 'success' },
    { msg: '⚽ GOAL! Crowd surge detected — monitoring Gates C, D', type: 'warning' },
    { msg: '🌍 New translation request: Arabic (23 fans in queue)', type: 'info' },
    { msg: '⚡ AI prediction: 8k fans expected in next 15 min', type: 'info' },
    { msg: '♿ Accessibility escort requested at Gate F — volunteer dispatched', type: 'success' },
    { msg: '🎯 Decision AI: Recommend opening secondary food court NOW', type: 'warning' },
  ];
  
  let alertIndex = 0;
  setInterval(() => {
    const alert = alerts[alertIndex % alerts.length];
    showToast(alert.msg, alert.type, 5000);
    alertIndex++;
    
    // Toggle crowd alert badge
    if (alertIndex % 3 === 0) {
      const badge = document.getElementById('crowdAlert');
      if (badge) badge.style.display = badge.style.display === 'none' ? 'inline' : 'none';
    }
  }, 12000);
}

// ---- Keyboard Shortcuts ----
function initKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
      switch(e.key) {
        case '1': e.preventDefault(); navigateTo('dashboard'); break;
        case '2': e.preventDefault(); navigateTo('navigation'); break;
        case '3': e.preventDefault(); navigateTo('crowd'); break;
        case '4': e.preventDefault(); navigateTo('accessibility'); break;
        case '5': e.preventDefault(); navigateTo('transport'); break;
        case '6': e.preventDefault(); navigateTo('sustainability'); break;
        case '7': e.preventDefault(); navigateTo('multilingual'); break;
        case '8': e.preventDefault(); navigateTo('operations'); break;
        case '9': e.preventDefault(); navigateTo('decision'); break;
      }
    }
  });
}

// ---- AI Chat Helper (shared across modules) ----
function createAIChatInterface(containerId, context, placeholder = 'Ask AI anything about the stadium...') {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  container.innerHTML = `
    <div class="chat-messages" id="${containerId}-messages" aria-live="polite" aria-label="AI Chat messages">
      <div class="chat-message ai">
        <div class="message-avatar ai" aria-hidden="true">🤖</div>
        <div class="message-bubble">
          👋 <strong>StadiumIQ AI</strong> ready! I'm here to help with ${context}. Ask me anything!
        </div>
      </div>
    </div>
    <div class="chat-input-area">
      <button class="btn btn-ghost btn-icon" onclick="startVoiceInput('${containerId}')" 
              aria-label="Voice input" title="Voice input">🎤</button>
      <input type="text" class="input-field" id="${containerId}-input" 
             placeholder="${placeholder}" 
             aria-label="Type your message"
             onkeydown="if(event.key==='Enter') sendChatMessage('${containerId}', '${context}')">
      <button class="btn btn-primary" onclick="sendChatMessage('${containerId}', '${context}')" aria-label="Send message">
        Send ➤
      </button>
    </div>
  `;
}

async function sendChatMessage(containerId, context) {
  const input = document.getElementById(`${containerId}-input`);
  const messages = document.getElementById(`${containerId}-messages`);
  const message = input.value.trim();
  if (!message) return;
  
  // Add user message
  const userMsg = document.createElement('div');
  userMsg.className = 'chat-message user';
  userMsg.innerHTML = `
    <div class="message-avatar user" aria-hidden="true">👤</div>
    <div class="message-bubble">${escapeHtml(message)}</div>
  `;
  messages.appendChild(userMsg);
  input.value = '';
  
  // Add loading AI message
  const aiMsg = document.createElement('div');
  aiMsg.className = 'chat-message ai';
  aiMsg.innerHTML = `
    <div class="message-avatar ai" aria-hidden="true">🤖</div>
    <div class="message-bubble" id="streaming-${containerId}">
      <div class="loader" aria-label="AI is thinking">
        <div class="loader-dot"></div>
        <div class="loader-dot"></div>
        <div class="loader-dot"></div>
      </div>
    </div>
  `;
  messages.appendChild(aiMsg);
  messages.scrollTop = messages.scrollHeight;
  
  // Stream AI response
  const streamEl = document.getElementById(`streaming-${containerId}`);
  await GeminiAI.stream(
    message, 
    context,
    (chunk) => {
      if (streamEl) streamEl.innerHTML = formatAIResponse(chunk);
      messages.scrollTop = messages.scrollHeight;
    },
    () => {
      messages.scrollTop = messages.scrollHeight;
    }
  );
}

function startVoiceInput(containerId) {
  if (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window)) {
    showToast('Voice input not supported in this browser', 'warning');
    return;
  }
  
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SR();
  recognition.lang = 'en-US';
  recognition.continuous = false;
  recognition.interimResults = false;
  
  showToast('🎤 Listening... Speak now', 'info', 3000);
  
  recognition.onresult = (e) => {
    const transcript = e.results[0][0].transcript;
    const input = document.getElementById(`${containerId}-input`);
    if (input) {
      input.value = transcript;
      showToast(`Heard: "${transcript}"`, 'success', 2000);
    }
  };
  
  recognition.onerror = () => showToast('Voice recognition error', 'error');
  recognition.start();
}

// ---- Utility Functions ----
function escapeHtml(text) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(text));
  return div.innerHTML;
}

function formatAIResponse(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>')
    .replace(/^#{1,3}\s(.+)$/gm, '<strong>$1</strong>');
}

function generateBarChart(canvas, labels, values, colors) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width = canvas.offsetWidth * 2;
  const H = canvas.height = canvas.offsetHeight * 2;
  canvas.style.width = canvas.offsetWidth + 'px';
  
  ctx.clearRect(0, 0, W, H);
  
  const padding = 60;
  const barArea = W - padding * 2;
  const maxVal = Math.max(...values) || 100;
  const barWidth = (barArea / labels.length) * 0.6;
  const gap = (barArea / labels.length) * 0.4;
  
  values.forEach((val, i) => {
    const x = padding + i * (barWidth + gap) + gap / 2;
    const barH = ((val / maxVal) * (H - padding * 2));
    const y = H - padding - barH;
    
    // Draw bar
    const grad = ctx.createLinearGradient(x, y, x, H - padding);
    grad.addColorStop(0, colors[i % colors.length] + 'ff');
    grad.addColorStop(1, colors[i % colors.length] + '44');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(x, y, barWidth, barH, 4);
    ctx.fill();
    
    // Label
    ctx.fillStyle = '#8BA4C8';
    ctx.font = `${24}px Inter`;
    ctx.textAlign = 'center';
    ctx.fillText(labels[i], x + barWidth / 2, H - padding / 3);
    
    // Value
    ctx.fillStyle = '#F0F4FF';
    ctx.font = `bold ${22}px Inter`;
    ctx.fillText(val + '%', x + barWidth / 2, y - 10);
  });
}

// Export to global
window.AppState = AppState;
window.navigateTo = navigateTo;
window.showToast = showToast;
window.createAIChatInterface = createAIChatInterface;
window.sendChatMessage = sendChatMessage;
window.startVoiceInput = startVoiceInput;
window.formatAIResponse = formatAIResponse;
window.generateBarChart = generateBarChart;
window.changeRole = changeRole;
window.toggleSidebar = toggleSidebar;
window.closeSidebar = closeSidebar;
