@import "tailwindcss";

@theme {
  /* Professional color themes */
  --color-primary-50: #f0f9ff;
  --color-primary-100: #e0f2fe;
  --color-primary-200: #bae6fd;
  --color-primary-300: #7dd3fc;
  --color-primary-400: #38bdf8;
  --color-primary-500: #0ea5e9;
  --color-primary-600: #0284c7;
  --color-primary-700: #0369a1;
  --color-primary-800: #075985;
  --color-primary-900: #0c4a6e;
  
  /* Retro-inspired accent colors */
  --color-accent-coral: #ff6b6b;
  --color-accent-amber: #fbbf24;
  --color-accent-emerald: #34d399;
  --color-accent-violet: #a78bfa;
  --color-accent-cyan: #22d3ee;
  --color-accent-rose: #fb7185;
  
  /* UI Colors */
  --color-bg-primary: #0f172a;
  --color-bg-secondary: #1e293b;
  --color-bg-card: #334155;
  --color-bg-hover: #475569;
  --color-border: #475569;
  --color-border-light: #64748b;
  --color-text-primary: #f1f5f9;
  --color-text-secondary: #94a3b8;
  --color-text-muted: #64748b;
  
  /* Success/Warning/Error */
  --color-success: #22c55e;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #3b82f6;
  
  --font-sans: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-mono: "JetBrains Mono", "Fira Code", Consolas, monospace;
}

@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  src: url('https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff2') format('woff2');
}

@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  src: url('https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuI6fAZ9hjp-Ek-_EeA.woff2') format('woff2');
}

@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 600;
  src: url('https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuGKYAZ9hjp-Ek-_EeA.woff2') format('woff2');
}

@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 700;
  src: url('https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYAZ9hjp-Ek-_EeA.woff2') format('woff2');
}

@font-face {
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 400;
  src: url('https://fonts.gstatic.com/s/jetbrainsmono/v18/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKxjPVmUsaaDhw.woff2') format('woff2');
}

* {
  scrollbar-width: thin;
  scrollbar-color: var(--color-primary-500) var(--color-bg-primary);
}

body {
  font-family: var(--font-sans);
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
}

/* Theme variations - applied via data-theme attribute */
[data-theme="midnight"] {
  --color-bg-primary: #0f172a;
  --color-bg-secondary: #1e293b;
  --color-bg-card: #334155;
  --color-primary-500: #0ea5e9;
}

[data-theme="ocean"] {
  --color-bg-primary: #0c1929;
  --color-bg-secondary: #132f4c;
  --color-bg-card: #1e4976;
  --color-primary-500: #29b6f6;
}

[data-theme="forest"] {
  --color-bg-primary: #0d1f17;
  --color-bg-secondary: #14332a;
  --color-bg-card: #1a4d3e;
  --color-primary-500: #4ade80;
}

[data-theme="sunset"] {
  --color-bg-primary: #1a1019;
  --color-bg-secondary: #2d1a2a;
  --color-bg-card: #4a2c46;
  --color-primary-500: #f472b6;
}

[data-theme="amber"] {
  --color-bg-primary: #1c1810;
  --color-bg-secondary: #2e2716;
  --color-bg-card: #4a3f24;
  --color-primary-500: #fbbf24;
}

/* Monospace font option */
[data-font="mono"] body,
[data-font="mono"] input,
[data-font="mono"] select,
[data-font="mono"] textarea,
[data-font="mono"] button {
  font-family: var(--font-mono);
}

/* Professional card styles */
.card {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  transition: all 0.2s ease;
}

.card:hover {
  border-color: var(--color-primary-500);
  box-shadow: 0 0 20px rgba(14, 165, 233, 0.1);
}

.card-glass {
  background: rgba(30, 41, 59, 0.8);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(71, 85, 105, 0.5);
  border-radius: 8px;
}

/* Professional input styles */
.input {
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  color: var(--color-text-primary);
  font-family: inherit;
  padding: 10px 14px;
  border-radius: 6px;
  outline: none;
  transition: all 0.2s ease;
  font-size: 14px;
}

.input:focus {
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.15);
}

.input::placeholder {
  color: var(--color-text-muted);
}

/* Professional button styles */
.btn {
  font-family: inherit;
  font-weight: 500;
  padding: 10px 18px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: none;
}

.btn-primary {
  background: linear-gradient(135deg, var(--color-primary-500), var(--color-primary-600));
  color: white;
  box-shadow: 0 2px 8px rgba(14, 165, 233, 0.3);
}

.btn-primary:hover {
  background: linear-gradient(135deg, var(--color-primary-400), var(--color-primary-500));
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.4);
}

.btn-secondary {
  background: var(--color-bg-card);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}

.btn-secondary:hover {
  background: var(--color-bg-hover);
  border-color: var(--color-primary-500);
}

.btn-ghost {
  background: transparent;
  color: var(--color-text-secondary);
}

.btn-ghost:hover {
  background: var(--color-bg-card);
  color: var(--color-text-primary);
}

.btn-success {
  background: linear-gradient(135deg, var(--color-success), #16a34a);
  color: white;
}

.btn-danger {
  background: linear-gradient(135deg, var(--color-error), #dc2626);
  color: white;
}

/* Badge styles */
.badge {
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.badge-success {
  background: rgba(34, 197, 94, 0.15);
  color: var(--color-success);
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.badge-warning {
  background: rgba(245, 158, 11, 0.15);
  color: var(--color-warning);
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.badge-error {
  background: rgba(239, 68, 68, 0.15);
  color: var(--color-error);
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.badge-info {
  background: rgba(59, 130, 246, 0.15);
  color: var(--color-info);
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.badge-neutral {
  background: rgba(100, 116, 139, 0.15);
  color: var(--color-text-secondary);
  border: 1px solid rgba(100, 116, 139, 0.3);
}

/* Table styles */
.table {
  width: 100%;
  border-collapse: collapse;
}

.table th {
  background: var(--color-bg-primary);
  border-bottom: 2px solid var(--color-border);
  padding: 12px 16px;
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--color-text-secondary);
}

.table td {
  border-bottom: 1px solid var(--color-border);
  padding: 12px 16px;
  font-size: 14px;
}

.table tr:hover td {
  background: var(--color-bg-card);
}

/* Stat card glow effects */
.stat-glow-blue {
  box-shadow: 0 0 20px rgba(14, 165, 233, 0.15);
  border-color: rgba(14, 165, 233, 0.3);
}

.stat-glow-green {
  box-shadow: 0 0 20px rgba(34, 197, 94, 0.15);
  border-color: rgba(34, 197, 94, 0.3);
}

.stat-glow-amber {
  box-shadow: 0 0 20px rgba(251, 191, 36, 0.15);
  border-color: rgba(251, 191, 36, 0.3);
}

.stat-glow-violet {
  box-shadow: 0 0 20px rgba(167, 139, 250, 0.15);
  border-color: rgba(167, 139, 250, 0.3);
}

.stat-glow-coral {
  box-shadow: 0 0 20px rgba(255, 107, 107, 0.15);
  border-color: rgba(255, 107, 107, 0.3);
}

/* Scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: var(--color-bg-primary);
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: var(--color-primary-500);
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideIn {
  from { opacity: 0; transform: translateX(-10px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 10px rgba(14, 165, 233, 0.3); }
  50% { box-shadow: 0 0 20px rgba(14, 165, 233, 0.5); }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

.animate-slide-in {
  animation: slideIn 0.3s ease-out;
}

.animate-pulse-glow {
  animation: pulse-glow 2s ease-in-out infinite;
}

/* Select styling */
select.input {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%2394a3b8' viewBox='0 0 16 16'%3E%3Cpath d='M8 12L2 6h12z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 36px;
}

/* Textarea */
textarea.input {
  resize: vertical;
  min-height: 80px;
}

/* Modal overlay */
.modal-overlay {
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
}

/* Tooltip */
.tooltip {
  position: relative;
}

.tooltip::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  padding: 6px 10px;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s;
}

.tooltip:hover::after {
  opacity: 1;
}

/* Progress bar */
.progress-bar {
  height: 8px;
  background: var(--color-bg-primary);
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.5s ease;
}

/* Charts container */
.chart-container {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 20px;
}
