# ⚽ StadiumIQ 2026 — GenAI-Powered FIFA World Cup Platform

> **An AI-enabled stadium intelligence platform for FIFA World Cup 2026 that enhances operations and fan experience through 8 specialized AI modules powered by Google Gemini.**

---

## 🚀 Quick Start

1. Open `index.html` in any modern browser (Chrome, Edge, Firefox)
2. *(Optional)* Add your [Google Gemini API key](https://aistudio.google.com) in **Settings**
3. Use **Ctrl+1–9** keyboard shortcuts to switch between modules

---

## 🏆 8 AI Modules

| Module | Key Features | AI Capability |
|--------|-------------|---------------|
| ⚡ **Command Center** | Live KPIs, heatmap, alert feed | Real-time aggregation |
| 🧭 **AI Navigation** | Wayfinding, voice commands, floor maps | Natural language routing |
| 🚦 **Crowd Intelligence** | Density heatmap, flow prediction, alerts | Safety analytics |
| ♿ **Accessibility Hub** | ASL, audio desc, sensory rooms | Inclusive AI |
| 🚌 **Smart Transport** | Trip planner, shuttles, departure optimizer | Journey AI |
| 🌱 **Sustainability AI** | CO₂ tracking, eco leaderboard, tips | Green analytics |
| 🌍 **Global Concierge** | 50+ language translation, emergency broadcast | Gemini translate |
| 📊 **Ops Intelligence** | Incident management, volunteer dispatch | Operations AI |
| 🎯 **Decision Support** | Scenario simulator, decision queue | Cross-domain AI |

---

## 🎨 Design System

- **Dark Mode First** with FIFA 2026 brand colors (Red `#C8102E`, Blue `#003DA5`, Gold `#FFD700`)
- **Glassmorphism** cards with backdrop-filter blur
- **Micro-animations** — hover effects, progress bars, loader dots
- **Responsive** — mobile-first with collapsible sidebar
- **WCAG 2.1 AA** — full keyboard nav, ARIA labels, skip links, high contrast mode

---

## 🔒 Security

- API key stored in `localStorage` only (never transmitted except to Google's official endpoint)
- All user inputs are sanitized via `escapeHtml()` to prevent XSS
- Content Security Policy compatible (no inline eval)
- No third-party tracking or analytics

---

## ♿ Accessibility

- **ARIA roles and labels** on all interactive elements
- **Skip to main content** link
- **Keyboard navigation** with Tab + Enter/Space
- **Focus-visible** outline with gold highlight
- **Screen reader compatible** `aria-live` regions for AI responses
- **High contrast mode** toggle in Settings
- **Voice input** (Web Speech API) for navigation and chat

---

## 🤖 AI Integration

Uses **Google Gemini 2.0 Flash** API for:
- Natural language wayfinding
- Crowd safety analysis
- Real-time translation (50+ languages)
- Scenario response planning
- Sustainability insights
- Operational intelligence
- Decision support

**Fallback Mode**: When no API key is provided, intelligent built-in responses simulate AI behavior for all modules.

---

## 📁 Project Structure

```
stadiumiq-2026/
├── index.html          ← Main SPA entry point
├── css/
│   └── main.css        ← Complete design system
├── js/
│   ├── gemini.js       ← Gemini AI integration layer
│   ├── app.js          ← SPA router + shell + utilities
│   ├── dashboard.js    ← Command Center module
│   ├── navigation.js   ← AI Navigation module
│   ├── crowd.js        ← Crowd Intelligence module
│   ├── accessibility.js← Accessibility Hub module
│   └── modules.js      ← Transport + Sustainability + Multilingual
│                          + Operations + Decision + Settings
└── README.md
```

---

## 🧪 Testing

Open the browser DevTools Console to verify:
- No JavaScript errors on page load
- Each module renders correctly (Ctrl+1 through Ctrl+9)
- AI chat responds (with fallback or Gemini API)
- Voice input works (requires Chrome/Edge)
- Canvas-based heatmaps draw correctly

---

## 🌍 Browser Support

| Browser | Status |
|---------|--------|
| Chrome 90+ | ✅ Full support (including voice) |
| Edge 90+ | ✅ Full support |
| Firefox 88+ | ✅ Full (no voice API) |
| Safari 15+ | ⚠️ Partial (limited voice API) |

---

*Built for FIFA World Cup 2026 — USA · Canada · Mexico*
