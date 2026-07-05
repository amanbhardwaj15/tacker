"use client";

import { useState, useEffect } from "react";
import { X, Palette, Type, Layout, Globe, Sparkles } from "lucide-react";

type Settings = {
  theme: string;
  fontStyle: string;
  visibleSections: Record<string, boolean>;
  defaultCountry: string;
  compactMode: boolean;
  showAnimations: boolean;
};

const themes = [
  { id: "midnight", name: "Midnight Blue", color: "#0f172a" },
  { id: "ocean", name: "Deep Ocean", color: "#0c1929" },
  { id: "forest", name: "Forest Green", color: "#0d1f17" },
  { id: "sunset", name: "Sunset Purple", color: "#1a1019" },
  { id: "amber", name: "Warm Amber", color: "#1c1810" },
];

const fonts = [
  { id: "sans", name: "Inter (Modern)" },
  { id: "mono", name: "JetBrains Mono" },
];

const sections = [
  { key: "dashboard", label: "Dashboard" },
  { key: "seoNew", label: "New SEO Blogs" },
  { key: "seoRevamped", label: "Revamped Blogs" },
  { key: "aeoBlogs", label: "AEO Blogs" },
  { key: "listicles", label: "Listicles" },
  { key: "social", label: "Reddit & Quora" },
  { key: "landingPages", label: "Landing Pages" },
  { key: "aiLlmTester", label: "LLM Tester" },
  { key: "aiSocialFinder", label: "Social Finder" },
  { key: "aiContentWriter", label: "Content Writer" },
  { key: "aiSeoAnalyzer", label: "SEO Analyzer" },
  { key: "aiBulkImport", label: "Bulk Import AI" },
];

const countries = [
  { code: "US", name: "United States" },
  { code: "UK", name: "United Kingdom" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
  { code: "IN", name: "India" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "JP", name: "Japan" },
  { code: "BR", name: "Brazil" },
  { code: "SG", name: "Singapore" },
];

export default function Settings({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}: {
  isOpen: boolean;
  onClose: () => void;
  settings: Settings;
  onUpdateSettings: (key: string, value: unknown) => void;
}) {
  const [activeTab, setActiveTab] = useState("appearance");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] modal-overlay flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-bg-secondary border border-border rounded-lg w-full max-w-2xl max-h-[85vh] overflow-hidden animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-text-primary">Settings</h2>
          <button onClick={onClose} className="p-1 text-text-muted hover:text-text-primary transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          {[
            { id: "appearance", label: "Appearance", icon: <Palette size={16} /> },
            { id: "sections", label: "Sections", icon: <Layout size={16} /> },
            { id: "defaults", label: "Defaults", icon: <Globe size={16} /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "text-primary-500 border-b-2 border-primary-500 -mb-px"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh] custom-scrollbar">
          {activeTab === "appearance" && (
            <div className="space-y-6">
              {/* Theme */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-text-primary mb-3">
                  <Palette size={16} className="text-primary-500" />
                  Color Theme
                </label>
                <div className="grid grid-cols-5 gap-3">
                  {themes.map(theme => (
                    <button
                      key={theme.id}
                      onClick={() => onUpdateSettings("theme", theme.id)}
                      className={`p-3 rounded-lg border transition-all ${
                        settings.theme === theme.id
                          ? "border-primary-500 ring-2 ring-primary-500/20"
                          : "border-border hover:border-primary-500/50"
                      }`}
                    >
                      <div
                        className="w-full h-8 rounded mb-2"
                        style={{ backgroundColor: theme.color }}
                      />
                      <p className="text-xs text-text-secondary text-center">{theme.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Font */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-text-primary mb-3">
                  <Type size={16} className="text-primary-500" />
                  Font Style
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {fonts.map(font => (
                    <button
                      key={font.id}
                      onClick={() => onUpdateSettings("fontStyle", font.id)}
                      className={`p-4 rounded-lg border text-left transition-all ${
                        settings.fontStyle === font.id
                          ? "border-primary-500 bg-primary-500/5"
                          : "border-border hover:border-primary-500/50"
                      }`}
                    >
                      <p className={`text-sm font-medium ${font.id === "mono" ? "font-mono" : ""}`}>
                        {font.name}
                      </p>
                      <p className={`text-xs text-text-muted mt-1 ${font.id === "mono" ? "font-mono" : ""}`}>
                        The quick brown fox jumps over the lazy dog
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Display Options */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-text-primary mb-3">
                  <Sparkles size={16} className="text-primary-500" />
                  Display Options
                </label>
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary-500/50 cursor-pointer">
                    <span className="text-sm text-text-secondary">Compact Mode</span>
                    <input
                      type="checkbox"
                      checked={settings.compactMode}
                      onChange={e => onUpdateSettings("compactMode", e.target.checked)}
                      className="w-4 h-4 accent-primary-500"
                    />
                  </label>
                  <label className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary-500/50 cursor-pointer">
                    <span className="text-sm text-text-secondary">Show Animations</span>
                    <input
                      type="checkbox"
                      checked={settings.showAnimations}
                      onChange={e => onUpdateSettings("showAnimations", e.target.checked)}
                      className="w-4 h-4 accent-primary-500"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === "sections" && (
            <div>
              <p className="text-sm text-text-muted mb-4">
                Choose which sections appear in the sidebar. Hidden sections can be re-enabled anytime.
              </p>
              <div className="space-y-2">
                {sections.map(section => (
                  <label
                    key={section.key}
                    className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary-500/50 cursor-pointer"
                  >
                    <span className="text-sm text-text-secondary">{section.label}</span>
                    <input
                      type="checkbox"
                      checked={settings.visibleSections[section.key] !== false}
                      onChange={e => {
                        const newSections = { ...settings.visibleSections, [section.key]: e.target.checked };
                        onUpdateSettings("visibleSections", newSections);
                      }}
                      className="w-4 h-4 accent-primary-500"
                    />
                  </label>
                ))}
              </div>
            </div>
          )}

          {activeTab === "defaults" && (
            <div className="space-y-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-text-primary mb-3">
                  <Globe size={16} className="text-primary-500" />
                  Default Country
                </label>
                <p className="text-xs text-text-muted mb-3">
                  Set the default country for AI tools (content generation, SEO analysis, etc.)
                </p>
                <select
                  value={settings.defaultCountry}
                  onChange={e => onUpdateSettings("defaultCountry", e.target.value)}
                  className="input w-full"
                >
                  {countries.map(country => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border flex justify-end">
          <button onClick={onClose} className="btn btn-primary">
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
