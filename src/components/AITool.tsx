"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, Sparkles, Search, PenTool, BarChart3, Upload, Globe, Settings2 } from "lucide-react";

type Message = {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

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

const toolConfigs: Record<string, {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  placeholder: string;
  quickPrompts: string[];
  hasAdvancedOptions?: boolean;
}> = {
  "llm-tester": {
    title: "LLM AEO Tester",
    subtitle: "Test prompts across ChatGPT, Gemini, Claude & Perplexity",
    icon: <Bot size={18} />,
    placeholder: 'Enter a query to test across LLMs, e.g. "Best AI car photography tool"',
    quickPrompts: [
      "Best AI car photography tool",
      "Top automotive listing platforms",
      "AI background removal for cars",
      "Best virtual car studio software",
    ],
  },
  "social-finder": {
    title: "Social Post Finder",
    subtitle: "Find Reddit & Quora posts for Spyne engagement",
    icon: <Search size={18} />,
    placeholder: 'Describe what to search, e.g. "AI photography tools for car dealers"',
    quickPrompts: [
      "AI photography tools for car dealers",
      "How to improve online car listings",
      "Best product photography automation",
      "Car dealership marketing tips",
    ],
  },
  "content-writer": {
    title: "Content Writer",
    subtitle: "Generate short-form content with customizable tone & style",
    icon: <PenTool size={18} />,
    placeholder: 'Describe the content topic...',
    quickPrompts: [
      "Spyne AI car photography benefits",
      "Why dealerships need AI photography",
      "5 ways AI transforms car listings",
      "Spyne ROI for car dealers",
    ],
    hasAdvancedOptions: true,
  },
  "seo-analyzer": {
    title: "SEO Gap Analyzer",
    subtitle: "Analyze content gaps against top SERP competitors",
    icon: <BarChart3 size={18} />,
    placeholder: 'Enter target keyword...',
    quickPrompts: [
      "AI car photography",
      "virtual car studio",
      "automotive AI tools",
      "car listing optimization",
    ],
    hasAdvancedOptions: true,
  },
  "bulk-import": {
    title: "Bulk Data Import",
    subtitle: "Import multiple entries at once to reduce manual work",
    icon: <Upload size={18} />,
    placeholder: 'Paste your data here (CSV or line-by-line format)',
    quickPrompts: [],
    hasAdvancedOptions: true,
  },
};

export default function AITool({ toolType, defaultCountry = "US" }: { toolType: string; defaultCountry?: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [country, setCountry] = useState(defaultCountry);
  const [showOptions, setShowOptions] = useState(false);
  
  // Content Writer options
  const [tone, setTone] = useState("professional");
  const [style, setStyle] = useState("informative");
  const [wordCount, setWordCount] = useState(150);
  
  // SEO Analyzer options
  const [blogUrl, setBlogUrl] = useState("");
  const [keyword, setKeyword] = useState("");
  
  // Bulk Import options
  const [bulkType, setBulkType] = useState("seo-blogs");
  const [bulkData, setBulkData] = useState("");
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const config = toolConfigs[toolType];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    setMessages([]);
    setInput("");
    setShowOptions(false);
  }, [toolType]);

  const handleSend = async (prompt?: string) => {
    const text = prompt || input.trim();
    if (!text && toolType !== "bulk-import") return;

    let userContent = text;
    if (toolType === "content-writer") {
      userContent = `Topic: ${text}\nTone: ${tone}, Style: ${style}, Words: ~${wordCount}`;
    } else if (toolType === "seo-analyzer") {
      userContent = `Keyword: ${keyword || text}\nBlog URL: ${blogUrl || "Not provided"}`;
    } else if (toolType === "bulk-import") {
      userContent = `Import ${bulkType}:\n${bulkData.slice(0, 200)}...`;
    }

    const userMsg: Message = { role: "user", content: userContent, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const body: Record<string, unknown> = {
        toolType,
        prompt: text,
        country,
      };

      if (toolType === "content-writer") {
        body.tone = tone;
        body.style = style;
        body.wordCount = wordCount;
      } else if (toolType === "seo-analyzer") {
        body.blogUrl = blogUrl;
        body.keyword = keyword || text;
      } else if (toolType === "bulk-import") {
        body.bulkType = bulkType;
        body.bulkData = bulkData;
      }

      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      const aiMsg: Message = { role: "assistant", content: data.response || "Failed to generate response.", timestamp: new Date() };
      setMessages(prev => [...prev, aiMsg]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Error: Failed to connect to AI service.", timestamp: new Date() }]);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkImport = async () => {
    if (!bulkData.trim()) return;
    
    setLoading(true);
    const lines = bulkData.split('\n').filter(l => l.trim());
    const records = lines.map(line => {
      const parts = line.split(',').map(p => p.trim());
      if (bulkType === "seo-blogs") {
        return { title: parts[0], url: parts[1], status: parts[2], targetKeyword: parts[3], currentRanking: parts[4], monthlyTraffic: parts[5] };
      } else if (bulkType === "aeo-blogs") {
        return { title: parts[0], url: parts[1], targetQuery: parts[2], status: parts[3], serpRanking: parts[4] };
      } else if (bulkType === "social") {
        return { platform: parts[0], postTitle: parts[1], postUrl: parts[2], subredditOrTopic: parts[3], upvotes: parts[4], views: parts[5] };
      } else {
        return { title: parts[0], url: parts[1], spyneListed: parts[2], spynePosition: parts[3], domainAuthority: parts[4] };
      }
    });

    try {
      const res = await fetch("/api/ai", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bulkType, records }),
      });
      const data = await res.json();
      
      const msg: Message = {
        role: "assistant",
        content: `## ✅ Bulk Import Complete\n\n**Type:** ${bulkType}\n**Records Imported:** ${data.imported || records.length}\n\nYou can now view the imported data in the respective section.`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, msg]);
      setBulkData("");
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Error: Import failed.", timestamp: new Date() }]);
    } finally {
      setLoading(false);
    }
  };

  if (!config) return <div className="text-text-muted">Unknown AI tool</div>;

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
            {config.icon}
            {config.title}
          </h2>
          <p className="text-sm text-text-muted mt-1">{config.subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-bg-secondary border border-border rounded-lg px-3 py-1.5">
            <Globe size={14} className="text-text-muted" />
            <select
              value={country}
              onChange={e => setCountry(e.target.value)}
              className="bg-transparent text-sm text-text-primary outline-none cursor-pointer"
            >
              {countries.map(c => (
                <option key={c.code} value={c.code}>{c.name}</option>
              ))}
            </select>
          </div>
          {config.hasAdvancedOptions && (
            <button
              onClick={() => setShowOptions(!showOptions)}
              className={`btn btn-secondary ${showOptions ? "bg-primary-500/10 border-primary-500" : ""}`}
            >
              <Settings2 size={14} />
              Options
            </button>
          )}
        </div>
      </div>

      {/* Advanced Options Panel */}
      {showOptions && config.hasAdvancedOptions && (
        <div className="card p-4 mb-4 animate-fade-in">
          {toolType === "content-writer" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-medium text-text-muted uppercase mb-1 block">Tone</label>
                <select value={tone} onChange={e => setTone(e.target.value)} className="input w-full">
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                  <option value="witty">Witty</option>
                  <option value="technical">Technical</option>
                  <option value="persuasive">Persuasive</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-text-muted uppercase mb-1 block">Style</label>
                <select value={style} onChange={e => setStyle(e.target.value)} className="input w-full">
                  <option value="informative">Informative</option>
                  <option value="storytelling">Storytelling</option>
                  <option value="listicle">Listicle</option>
                  <option value="comparison">Comparison</option>
                  <option value="howto">How-To Guide</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-text-muted uppercase mb-1 block">Word Count</label>
                <input
                  type="number"
                  value={wordCount}
                  onChange={e => setWordCount(parseInt(e.target.value) || 150)}
                  className="input w-full"
                  min={50}
                  max={500}
                />
              </div>
            </div>
          )}

          {toolType === "seo-analyzer" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-text-muted uppercase mb-1 block">Your Blog URL (optional)</label>
                <input
                  value={blogUrl}
                  onChange={e => setBlogUrl(e.target.value)}
                  className="input w-full"
                  placeholder="https://spyne.ai/blog/your-article"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-text-muted uppercase mb-1 block">Target Keyword</label>
                <input
                  value={keyword}
                  onChange={e => setKeyword(e.target.value)}
                  className="input w-full"
                  placeholder="AI car photography"
                />
              </div>
            </div>
          )}

          {toolType === "bulk-import" && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-text-muted uppercase mb-1 block">Import Type</label>
                <select value={bulkType} onChange={e => setBulkType(e.target.value)} className="input w-full md:w-auto">
                  <option value="seo-blogs">SEO Blogs</option>
                  <option value="aeo-blogs">AEO Blogs</option>
                  <option value="social">Social Engagement</option>
                  <option value="listicles">Listicles</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-text-muted uppercase mb-1 block">
                  Data (CSV format, one record per line)
                </label>
                <textarea
                  value={bulkData}
                  onChange={e => setBulkData(e.target.value)}
                  className="input w-full font-mono text-xs"
                  rows={8}
                  placeholder={
                    bulkType === "seo-blogs"
                      ? "Title, URL, Status, Target Keyword, Current Ranking, Traffic\nAI Car Photography Guide, https://..., published, ai car photo, 5, 2500"
                      : bulkType === "aeo-blogs"
                      ? "Title, URL, Target Query, Status, SERP Ranking\nBest AI Photography, https://..., best AI photo tool, published, 3"
                      : bulkType === "social"
                      ? "Platform, Post Title, URL, Subreddit/Topic, Upvotes, Views\nreddit, AI Tools Discussion, https://..., r/technology, 45, 1200"
                      : "Title, URL, Listed (true/false), Position, Domain Authority\nTop 10 AI Tools, https://..., true, 3, 65"
                  }
                />
              </div>
              <button onClick={handleBulkImport} disabled={loading || !bulkData.trim()} className="btn btn-primary">
                <Upload size={14} />
                Import {bulkData.split('\n').filter(l => l.trim()).length} Records
              </button>
            </div>
          )}
        </div>
      )}

      {/* Quick Prompts */}
      {messages.length === 0 && config.quickPrompts.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-medium text-text-muted uppercase mb-2">Quick Prompts:</p>
          <div className="flex flex-wrap gap-2">
            {config.quickPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => {
                  if (toolType === "seo-analyzer") {
                    setKeyword(prompt);
                    setShowOptions(true);
                  } else {
                    handleSend(prompt);
                  }
                }}
                className="btn btn-secondary text-xs"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto custom-scrollbar card p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-text-muted">
            <Sparkles size={48} className="opacity-20 mb-4" />
            <p className="text-sm">
              {toolType === "bulk-import"
                ? "Configure import options above and paste your data"
                : "Start by entering a prompt or selecting a quick prompt"}
            </p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className="flex gap-3 animate-fade-in">
            <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
              msg.role === "user" 
                ? "bg-primary-500/10 text-primary-500" 
                : "bg-accent-violet/10 text-accent-violet"
            }`}>
              {msg.role === "user" ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium text-text-muted uppercase">
                  {msg.role === "user" ? "You" : "AI"}
                </span>
                <span className="text-xs text-text-muted">
                  {msg.timestamp.toLocaleTimeString()}
                </span>
              </div>
              <div className="text-sm whitespace-pre-wrap leading-relaxed bg-bg-primary/50 p-4 rounded-lg border border-border">
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3 animate-fade-in">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center bg-accent-violet/10 text-accent-violet">
              <Bot size={16} />
            </div>
            <div className="flex items-center gap-2 text-text-muted text-sm">
              <Loader2 size={14} className="animate-spin" />
              Processing...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      {toolType !== "bulk-import" && (
        <div className="mt-4 flex gap-2">
          <input
            className="input flex-1"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder={config.placeholder}
            disabled={loading}
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className="btn btn-primary disabled:opacity-50"
          >
            <Send size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
