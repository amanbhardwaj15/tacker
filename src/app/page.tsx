"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Dashboard from "@/components/Dashboard";
import SEOBlogs from "@/components/SEOBlogs";
import AEOBlogs from "@/components/AEOBlogs";
import Listicles from "@/components/Listicles";
import SocialEngagement from "@/components/SocialEngagement";
import LandingPages from "@/components/LandingPages";
import AITool from "@/components/AITool";
import Settings from "@/components/Settings";

type SettingsType = {
  theme: string;
  fontStyle: string;
  visibleSections: Record<string, boolean>;
  defaultCountry: string;
  compactMode: boolean;
  showAnimations: boolean;
};

const defaultSettings: SettingsType = {
  theme: "midnight",
  fontStyle: "sans",
  visibleSections: {
    dashboard: true,
    seoNew: true,
    seoRevamped: true,
    aeoBlogs: true,
    listicles: true,
    social: true,
    landingPages: true,
    aiLlmTester: true,
    aiSocialFinder: true,
    aiContentWriter: true,
    aiSeoAnalyzer: true,
    aiBulkImport: true,
  },
  defaultCountry: "US",
  compactMode: false,
  showAnimations: true,
};

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<SettingsType>(defaultSettings);

  useEffect(() => {
    // Load settings
    fetch("/api/settings")
      .then(r => r.json())
      .then(data => {
        setSettings(prev => ({
          ...prev,
          ...data,
          visibleSections: { ...prev.visibleSections, ...data.visibleSections },
        }));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    // Apply theme
    document.documentElement.setAttribute("data-theme", settings.theme);
    document.documentElement.setAttribute("data-font", settings.fontStyle);
  }, [settings.theme, settings.fontStyle]);

  const handleUpdateSettings = (key: string, value: unknown) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value }),
    }).catch(() => {});
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "seo-new":
        return <SEOBlogs blogType="new" />;
      case "seo-revamped":
        return <SEOBlogs blogType="revamped" />;
      case "aeo-blogs":
        return <AEOBlogs />;
      case "listicles":
        return <Listicles />;
      case "social":
        return <SocialEngagement />;
      case "landing-pages":
        return <LandingPages />;
      case "ai-llm-tester":
        return <AITool toolType="llm-tester" defaultCountry={settings.defaultCountry} />;
      case "ai-social-finder":
        return <AITool toolType="social-finder" defaultCountry={settings.defaultCountry} />;
      case "ai-content-writer":
        return <AITool toolType="content-writer" defaultCountry={settings.defaultCountry} />;
      case "ai-seo-analyzer":
        return <AITool toolType="seo-analyzer" defaultCountry={settings.defaultCountry} />;
      case "ai-bulk-import":
        return <AITool toolType="bulk-import" defaultCountry={settings.defaultCountry} />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        onOpenSettings={() => setShowSettings(true)}
        visibleSections={settings.visibleSections}
      />
      
      <Settings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
      />

      <main className={`transition-all duration-300 min-h-screen ${sidebarCollapsed ? "ml-16" : "ml-60"}`}>
        {/* Top Bar */}
        <header className="sticky top-0 z-40 bg-bg-primary/95 backdrop-blur border-b border-border px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
              <span className="text-xs text-text-muted uppercase tracking-wide">System Online</span>
              <span className="text-text-muted">|</span>
              <span className="text-xs font-semibold text-primary-500 uppercase tracking-wider">
                Spyne Content Ops
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-text-muted">
                {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </span>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-sm font-bold">
                S
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className={`p-6 ${settings.showAnimations ? "animate-fade-in" : ""}`}>
          {renderContent()}
        </div>

        {/* Footer */}
        <footer className="border-t border-border px-6 py-4">
          <p className="text-xs text-text-muted text-center">
            Spyne Content Tracker v2.0 • Professional Dashboard • {new Date().getFullYear()}
          </p>
        </footer>
      </main>
    </div>
  );
}
