"use client";

import { 
  LayoutDashboard, FileText, Sparkles, MessageSquare, 
  Globe, Bot, Search, PenTool, BarChart3, Settings,
  ChevronLeft, ChevronRight, Zap, List, Upload
} from "lucide-react";

type NavItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
  category?: string;
  settingKey?: string;
};

const navItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} />, category: "OVERVIEW", settingKey: "dashboard" },
  { id: "seo-new", label: "New SEO Blogs", icon: <FileText size={18} />, category: "CONTENT", settingKey: "seoNew" },
  { id: "seo-revamped", label: "Revamped Blogs", icon: <FileText size={18} />, settingKey: "seoRevamped" },
  { id: "aeo-blogs", label: "AEO Blogs", icon: <Sparkles size={18} />, settingKey: "aeoBlogs" },
  { id: "listicles", label: "Listicles", icon: <List size={18} />, settingKey: "listicles" },
  { id: "social", label: "Reddit & Quora", icon: <MessageSquare size={18} />, settingKey: "social" },
  { id: "landing-pages", label: "Landing Pages", icon: <Globe size={18} />, settingKey: "landingPages" },
  { id: "ai-llm-tester", label: "LLM Tester", icon: <Bot size={18} />, category: "AI TOOLS", settingKey: "aiLlmTester" },
  { id: "ai-social-finder", label: "Social Finder", icon: <Search size={18} />, settingKey: "aiSocialFinder" },
  { id: "ai-content-writer", label: "Content Writer", icon: <PenTool size={18} />, settingKey: "aiContentWriter" },
  { id: "ai-seo-analyzer", label: "SEO Analyzer", icon: <BarChart3 size={18} />, settingKey: "aiSeoAnalyzer" },
  { id: "ai-bulk-import", label: "Bulk Import", icon: <Upload size={18} />, settingKey: "aiBulkImport" },
];

type VisibleSections = {
  [key: string]: boolean;
};

export default function Sidebar({ 
  activeTab, 
  onTabChange, 
  collapsed, 
  onToggle,
  onOpenSettings,
  visibleSections = {}
}: { 
  activeTab: string; 
  onTabChange: (tab: string) => void;
  collapsed: boolean;
  onToggle: () => void;
  onOpenSettings: () => void;
  visibleSections?: VisibleSections;
}) {
  let lastCategory = "";

  const filteredItems = navItems.filter(item => {
    if (!item.settingKey) return true;
    return visibleSections[item.settingKey] !== false;
  });

  return (
    <aside className={`fixed top-0 left-0 h-full bg-bg-secondary border-r border-border z-50 transition-all duration-300 flex flex-col ${collapsed ? "w-16" : "w-60"}`}>
      {/* Logo */}
      <div className="p-4 border-b border-border flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center flex-shrink-0">
          <Zap className="text-white" size={20} />
        </div>
        {!collapsed && (
          <div>
            <h1 className="text-sm font-bold text-text-primary tracking-wide">
              SPYNE
            </h1>
            <p className="text-[10px] text-text-muted tracking-wider">Content Tracker</p>
          </div>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 overflow-y-auto py-3 custom-scrollbar">
        {filteredItems.map((item) => {
          const showCategory = item.category && item.category !== lastCategory;
          if (item.category) lastCategory = item.category;
          return (
            <div key={item.id}>
              {showCategory && !collapsed && (
                <div className="px-4 pt-5 pb-2">
                  <span className="text-[10px] font-semibold text-text-muted tracking-[2px] uppercase">{item.category}</span>
                </div>
              )}
              {showCategory && collapsed && <div className="my-3 mx-3 border-t border-border" />}
              <button
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all text-sm ${
                  activeTab === item.id
                    ? "bg-primary-500/10 text-primary-500 border-r-2 border-primary-500"
                    : "text-text-secondary hover:text-text-primary hover:bg-bg-card/50"
                } ${collapsed ? "justify-center px-0" : ""}`}
                title={collapsed ? item.label : undefined}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {!collapsed && <span className="truncate font-medium">{item.label}</span>}
              </button>
            </div>
          );
        })}
      </nav>

      {/* Settings & Toggle */}
      <div className="border-t border-border">
        <button
          onClick={onOpenSettings}
          className={`w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-text-secondary hover:text-text-primary hover:bg-bg-card/50 transition-all ${collapsed ? "justify-center px-0" : ""}`}
          title={collapsed ? "Settings" : undefined}
        >
          <Settings size={18} />
          {!collapsed && <span className="font-medium">Settings</span>}
        </button>
        <button
          onClick={onToggle}
          className="w-full p-3 text-text-muted hover:text-primary-500 transition-colors flex items-center justify-center"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
    </aside>
  );
}
