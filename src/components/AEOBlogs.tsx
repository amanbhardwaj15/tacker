"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Edit2, Trash2, X, Check, Minus, ExternalLink, Bot } from "lucide-react";

type AEOBlog = {
  id: number;
  title: string;
  url: string | null;
  targetQuery: string | null;
  status: string;
  serpRanking: number | null;
  monthlyTraffic: number;
  impressions: number;
  clicks: number;
  chatgptMentioned: boolean;
  geminiMentioned: boolean;
  claudeMentioned: boolean;
  perplexityMentioned: boolean;
  chatgptPosition: number | null;
  geminiPosition: number | null;
  claudePosition: number | null;
  perplexityPosition: number | null;
  llmTestResults: unknown;
  notes: string | null;
  createdAt: string;
};

const emptyForm = {
  title: "",
  url: "",
  targetQuery: "",
  status: "draft",
  serpRanking: "",
  monthlyTraffic: "",
  impressions: "",
  clicks: "",
  chatgptMentioned: false,
  geminiMentioned: false,
  claudeMentioned: false,
  perplexityMentioned: false,
  chatgptPosition: "",
  geminiPosition: "",
  claudePosition: "",
  perplexityPosition: "",
  notes: "",
};

export default function AEOBlogs() {
  const [blogs, setBlogs] = useState<AEOBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);

  const fetchBlogs = useCallback(() => {
    fetch("/api/aeo-blogs")
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setBlogs(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => { fetchBlogs(); }, [fetchBlogs]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = {
      ...form,
      serpRanking: form.serpRanking ? parseInt(form.serpRanking) : null,
      monthlyTraffic: parseInt(form.monthlyTraffic) || 0,
      impressions: parseInt(form.impressions) || 0,
      clicks: parseInt(form.clicks) || 0,
      chatgptPosition: form.chatgptPosition ? parseInt(form.chatgptPosition) : null,
      geminiPosition: form.geminiPosition ? parseInt(form.geminiPosition) : null,
      claudePosition: form.claudePosition ? parseInt(form.claudePosition) : null,
      perplexityPosition: form.perplexityPosition ? parseInt(form.perplexityPosition) : null,
      ...(editingId ? { id: editingId } : {}),
    };
    
    const method = editingId ? "PUT" : "POST";
    await fetch("/api/aeo-blogs", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    fetchBlogs();
  };

  const handleEdit = (blog: AEOBlog) => {
    setEditingId(blog.id);
    setForm({
      title: blog.title,
      url: blog.url || "",
      targetQuery: blog.targetQuery || "",
      status: blog.status,
      serpRanking: blog.serpRanking?.toString() || "",
      monthlyTraffic: blog.monthlyTraffic?.toString() || "",
      impressions: blog.impressions?.toString() || "",
      clicks: blog.clicks?.toString() || "",
      chatgptMentioned: blog.chatgptMentioned,
      geminiMentioned: blog.geminiMentioned,
      claudeMentioned: blog.claudeMentioned,
      perplexityMentioned: blog.perplexityMentioned,
      chatgptPosition: blog.chatgptPosition?.toString() || "",
      geminiPosition: blog.geminiPosition?.toString() || "",
      claudePosition: blog.claudePosition?.toString() || "",
      perplexityPosition: blog.perplexityPosition?.toString() || "",
      notes: blog.notes || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this AEO blog entry?")) return;
    await fetch(`/api/aeo-blogs?id=${id}`, { method: "DELETE" });
    fetchBlogs();
  };

  const llmCount = (blog: AEOBlog) => {
    let count = 0;
    if (blog.chatgptMentioned) count++;
    if (blog.geminiMentioned) count++;
    if (blog.claudeMentioned) count++;
    if (blog.perplexityMentioned) count++;
    return count;
  };

  const LLMBadge = ({ mentioned, name, position }: { mentioned: boolean; name: string; position: number | null }) => (
    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded mr-1 mb-1 ${
      mentioned ? "bg-success/10 text-success border border-success/20" : "bg-bg-primary text-text-muted border border-border"
    }`}>
      {mentioned ? <Check size={10} /> : <Minus size={10} />}
      {name}
      {mentioned && position && <span className="text-accent-amber ml-1">#{position}</span>}
    </span>
  );

  const getStatusBadge = (status: string) => {
    if (status === "published") return "badge-success";
    if (status === "in-progress") return "badge-warning";
    return "badge-neutral";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <Bot size={22} className="text-accent-violet" />
            AEO Blogs
          </h2>
          <p className="text-sm text-text-muted mt-1">AI Engine Optimization • LLM Performance Tracking • {blogs.length} entries</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyForm); }} className="btn btn-primary">
          <Plus size={16} /> Add AEO Blog
        </button>
      </div>

      {/* LLM Overview Cards */}
      {blogs.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: "ChatGPT", count: blogs.filter(b => b.chatgptMentioned).length, color: "text-success", bg: "stat-glow-green" },
            { name: "Gemini", count: blogs.filter(b => b.geminiMentioned).length, color: "text-primary-500", bg: "stat-glow-blue" },
            { name: "Claude", count: blogs.filter(b => b.claudeMentioned).length, color: "text-accent-violet", bg: "stat-glow-violet" },
            { name: "Perplexity", count: blogs.filter(b => b.perplexityMentioned).length, color: "text-accent-amber", bg: "stat-glow-amber" },
          ].map(llm => (
            <div key={llm.name} className={`card p-4 text-center ${llm.bg}`}>
              <p className="text-xs text-text-muted uppercase">{llm.name}</p>
              <p className={`text-2xl font-bold ${llm.color}`}>{llm.count}<span className="text-sm text-text-muted">/{blogs.length}</span></p>
              <div className="progress-bar mt-2">
                <div className={`progress-bar-fill ${llm.color.replace("text-", "bg-")}`} style={{ width: `${blogs.length > 0 ? (llm.count / blogs.length) * 100 : 0}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 modal-overlay flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-bg-secondary border border-border rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-text-primary">{editingId ? "Edit" : "Add"} AEO Blog</h3>
              <button onClick={() => setShowForm(false)} className="text-text-muted hover:text-text-primary"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="text-xs font-medium text-text-muted uppercase">Title *</label>
                  <input className="input w-full mt-1" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-medium text-text-muted uppercase">URL</label>
                  <input className="input w-full mt-1" value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-medium text-text-muted uppercase">Target Query</label>
                  <input className="input w-full mt-1" value={form.targetQuery} onChange={e => setForm({ ...form, targetQuery: e.target.value })} placeholder='e.g. "Best AI car photography tool"' />
                </div>
                <div>
                  <label className="text-xs font-medium text-text-muted uppercase">Status</label>
                  <select className="input w-full mt-1" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                    <option value="draft">Draft</option>
                    <option value="in-progress">In Progress</option>
                    <option value="published">Published</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-text-muted uppercase">SERP Ranking</label>
                  <input type="number" className="input w-full mt-1" value={form.serpRanking} onChange={e => setForm({ ...form, serpRanking: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs font-medium text-text-muted uppercase">Monthly Traffic</label>
                  <input type="number" className="input w-full mt-1" value={form.monthlyTraffic} onChange={e => setForm({ ...form, monthlyTraffic: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs font-medium text-text-muted uppercase">Clicks</label>
                  <input type="number" className="input w-full mt-1" value={form.clicks} onChange={e => setForm({ ...form, clicks: e.target.value })} />
                </div>
              </div>

              <div className="card p-4">
                <h4 className="text-sm font-semibold text-accent-violet mb-3">LLM Mentions</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { key: "chatgpt", label: "ChatGPT" },
                    { key: "gemini", label: "Gemini" },
                    { key: "claude", label: "Claude" },
                    { key: "perplexity", label: "Perplexity" },
                  ].map(llm => (
                    <div key={llm.key} className="space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form[`${llm.key}Mentioned` as keyof typeof form] as boolean}
                          onChange={e => setForm({ ...form, [`${llm.key}Mentioned`]: e.target.checked })}
                          className="w-4 h-4 accent-success"
                        />
                        <span className="text-sm">{llm.label}</span>
                      </label>
                      <input
                        type="number"
                        className="input w-full text-sm"
                        placeholder="Position #"
                        value={form[`${llm.key}Position` as keyof typeof form] as string}
                        onChange={e => setForm({ ...form, [`${llm.key}Position`]: e.target.value })}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-text-muted uppercase">Notes</label>
                <textarea className="input w-full mt-1" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={3} />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="btn btn-primary">{editingId ? "Update" : "Create"}</button>
                <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Blog Cards */}
      {loading ? (
        <div className="text-center py-8 text-text-muted">Loading...</div>
      ) : blogs.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-text-muted">No AEO blogs yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {blogs.map(blog => (
            <div key={blog.id} className="card p-4 hover:border-accent-violet/50 transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-text-primary">{blog.title}</h3>
                    <span className={`badge ${getStatusBadge(blog.status)}`}>{blog.status}</span>
                  </div>
                  {blog.targetQuery && (
                    <p className="text-sm text-accent-violet mb-2">Query: &quot;{blog.targetQuery}&quot;</p>
                  )}
                  {blog.url && (
                    <a href={blog.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-500 hover:underline flex items-center gap-1 mb-3">
                      <ExternalLink size={10} /> {blog.url}
                    </a>
                  )}
                  <div className="flex flex-wrap">
                    <LLMBadge mentioned={blog.chatgptMentioned} name="ChatGPT" position={blog.chatgptPosition} />
                    <LLMBadge mentioned={blog.geminiMentioned} name="Gemini" position={blog.geminiPosition} />
                    <LLMBadge mentioned={blog.claudeMentioned} name="Claude" position={blog.claudePosition} />
                    <LLMBadge mentioned={blog.perplexityMentioned} name="Perplexity" position={blog.perplexityPosition} />
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex gap-1">
                    <button onClick={() => handleEdit(blog)} className="p-1 text-text-muted hover:text-primary-500"><Edit2 size={14} /></button>
                    <button onClick={() => handleDelete(blog.id)} className="p-1 text-text-muted hover:text-error"><Trash2 size={14} /></button>
                  </div>
                  <div className="text-right space-y-1 text-xs">
                    <div className="text-text-muted">SERP: <span className="text-primary-500 font-bold">{blog.serpRanking ? `#${blog.serpRanking}` : "—"}</span></div>
                    <div className="text-text-muted">Traffic: <span className="text-success font-bold">{blog.monthlyTraffic?.toLocaleString()}</span></div>
                    <div className="text-text-muted">LLMs: <span className="text-accent-violet font-bold">{llmCount(blog)}/4</span></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
