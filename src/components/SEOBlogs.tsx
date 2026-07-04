"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Edit2, Trash2, X, TrendingUp, TrendingDown, Minus, ExternalLink } from "lucide-react";

type Blog = {
  id: number;
  title: string;
  url: string | null;
  type: string;
  status: string;
  targetKeyword: string | null;
  secondaryKeywords: string | null;
  currentRanking: number | null;
  previousRanking: number | null;
  monthlyTraffic: number;
  impressions: number;
  clicks: number;
  ctr: string | null;
  deals: number;
  demos: number;
  notes: string | null;
  createdAt: string;
};

const emptyForm = {
  title: "",
  url: "",
  status: "draft",
  targetKeyword: "",
  secondaryKeywords: "",
  currentRanking: "",
  previousRanking: "",
  monthlyTraffic: "",
  impressions: "",
  clicks: "",
  ctr: "",
  deals: "",
  demos: "",
  notes: "",
};

export default function SEOBlogs({ blogType }: { blogType: "new" | "revamped" }) {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);

  const fetchBlogs = useCallback(() => {
    fetch(`/api/seo-blogs?type=${blogType}`)
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setBlogs(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [blogType]);

  useEffect(() => { fetchBlogs(); }, [fetchBlogs]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = {
      ...form,
      type: blogType,
      currentRanking: form.currentRanking ? parseInt(form.currentRanking) : null,
      previousRanking: form.previousRanking ? parseInt(form.previousRanking) : null,
      monthlyTraffic: parseInt(form.monthlyTraffic) || 0,
      impressions: parseInt(form.impressions) || 0,
      clicks: parseInt(form.clicks) || 0,
      deals: parseInt(form.deals) || 0,
      demos: parseInt(form.demos) || 0,
      ...(editingId ? { id: editingId } : {}),
    };
    
    const method = editingId ? "PUT" : "POST";
    await fetch("/api/seo-blogs", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    fetchBlogs();
  };

  const handleEdit = (blog: Blog) => {
    setEditingId(blog.id);
    setForm({
      title: blog.title,
      url: blog.url || "",
      status: blog.status,
      targetKeyword: blog.targetKeyword || "",
      secondaryKeywords: blog.secondaryKeywords || "",
      currentRanking: blog.currentRanking?.toString() || "",
      previousRanking: blog.previousRanking?.toString() || "",
      monthlyTraffic: blog.monthlyTraffic?.toString() || "",
      impressions: blog.impressions?.toString() || "",
      clicks: blog.clicks?.toString() || "",
      ctr: blog.ctr || "",
      deals: blog.deals?.toString() || "",
      demos: blog.demos?.toString() || "",
      notes: blog.notes || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this blog entry?")) return;
    await fetch(`/api/seo-blogs?id=${id}`, { method: "DELETE" });
    fetchBlogs();
  };

  const getRankingTrend = (current: number | null, previous: number | null) => {
    if (!current || !previous) return <Minus size={14} className="text-text-muted" />;
    if (current < previous) return <TrendingUp size={14} className="text-success" />;
    if (current > previous) return <TrendingDown size={14} className="text-error" />;
    return <Minus size={14} className="text-text-muted" />;
  };

  const getStatusBadge = (status: string) => {
    if (status === "published") return "badge-success";
    if (status === "in-progress") return "badge-warning";
    return "badge-neutral";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-text-primary">
            {blogType === "new" ? "New SEO Blogs" : "Revamped SEO Blogs"}
          </h2>
          <p className="text-sm text-text-muted mt-1">
            {blogType === "new" ? "Fresh content from scratch" : "Optimized & updated content"} • {blogs.length} entries
          </p>
        </div>
        <button onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyForm); }} className="btn btn-primary">
          <Plus size={16} /> Add {blogType === "new" ? "Blog" : "Revamp"}
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 modal-overlay flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-bg-secondary border border-border rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-text-primary">
                {editingId ? "Edit" : "Add"} {blogType === "new" ? "SEO Blog" : "Revamped Blog"}
              </h3>
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
                <div>
                  <label className="text-xs font-medium text-text-muted uppercase">Status</label>
                  <select className="input w-full mt-1" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                    <option value="draft">Draft</option>
                    <option value="in-progress">In Progress</option>
                    <option value="published">Published</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-text-muted uppercase">Target Keyword</label>
                  <input className="input w-full mt-1" value={form.targetKeyword} onChange={e => setForm({ ...form, targetKeyword: e.target.value })} />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-medium text-text-muted uppercase">Secondary Keywords</label>
                  <input className="input w-full mt-1" value={form.secondaryKeywords} onChange={e => setForm({ ...form, secondaryKeywords: e.target.value })} placeholder="comma separated" />
                </div>
                <div>
                  <label className="text-xs font-medium text-text-muted uppercase">Current Ranking</label>
                  <input type="number" className="input w-full mt-1" value={form.currentRanking} onChange={e => setForm({ ...form, currentRanking: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs font-medium text-text-muted uppercase">Previous Ranking</label>
                  <input type="number" className="input w-full mt-1" value={form.previousRanking} onChange={e => setForm({ ...form, previousRanking: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs font-medium text-text-muted uppercase">Monthly Traffic</label>
                  <input type="number" className="input w-full mt-1" value={form.monthlyTraffic} onChange={e => setForm({ ...form, monthlyTraffic: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs font-medium text-text-muted uppercase">Impressions</label>
                  <input type="number" className="input w-full mt-1" value={form.impressions} onChange={e => setForm({ ...form, impressions: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs font-medium text-text-muted uppercase">Clicks</label>
                  <input type="number" className="input w-full mt-1" value={form.clicks} onChange={e => setForm({ ...form, clicks: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs font-medium text-text-muted uppercase">CTR</label>
                  <input className="input w-full mt-1" value={form.ctr} onChange={e => setForm({ ...form, ctr: e.target.value })} placeholder="e.g. 3.2%" />
                </div>
                <div>
                  <label className="text-xs font-medium text-text-muted uppercase">Deals</label>
                  <input type="number" className="input w-full mt-1" value={form.deals} onChange={e => setForm({ ...form, deals: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs font-medium text-text-muted uppercase">Demos</label>
                  <input type="number" className="input w-full mt-1" value={form.demos} onChange={e => setForm({ ...form, demos: e.target.value })} />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-medium text-text-muted uppercase">Notes</label>
                  <textarea className="input w-full mt-1" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={3} />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="btn btn-primary">{editingId ? "Update" : "Create"}</button>
                <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="text-center py-8 text-text-muted">Loading...</div>
      ) : blogs.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-text-muted">No {blogType === "new" ? "new" : "revamped"} blogs yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto custom-scrollbar">
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Keyword</th>
                <th>Rank</th>
                <th>Trend</th>
                <th>Traffic</th>
                <th>Clicks</th>
                <th>CTR</th>
                <th>Deals</th>
                <th>Demos</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map(blog => (
                <tr key={blog.id}>
                  <td className="max-w-[200px]">
                    <div className="font-medium text-text-primary truncate">{blog.title}</div>
                    {blog.url && (
                      <a href={blog.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-500 hover:underline flex items-center gap-1">
                        <ExternalLink size={10} /> Link
                      </a>
                    )}
                  </td>
                  <td>
                    <span className={`badge ${getStatusBadge(blog.status)}`}>{blog.status}</span>
                  </td>
                  <td className="text-xs text-text-muted max-w-[120px] truncate">{blog.targetKeyword || "—"}</td>
                  <td className="text-center font-bold">{blog.currentRanking || "—"}</td>
                  <td className="text-center">{getRankingTrend(blog.currentRanking, blog.previousRanking)}</td>
                  <td className="text-right">{blog.monthlyTraffic?.toLocaleString()}</td>
                  <td className="text-right">{blog.clicks?.toLocaleString()}</td>
                  <td className="text-center text-primary-500">{blog.ctr || "—"}</td>
                  <td className="text-center text-accent-amber">{blog.deals}</td>
                  <td className="text-center text-success">{blog.demos}</td>
                  <td>
                    <div className="flex gap-1">
                      <button onClick={() => handleEdit(blog)} className="p-1 text-text-muted hover:text-primary-500"><Edit2 size={14} /></button>
                      <button onClick={() => handleDelete(blog.id)} className="p-1 text-text-muted hover:text-error"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Summary Stats */}
      {blogs.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: "Traffic", value: blogs.reduce((a, b) => a + (b.monthlyTraffic || 0), 0).toLocaleString(), color: "text-primary-500" },
            { label: "Clicks", value: blogs.reduce((a, b) => a + (b.clicks || 0), 0).toLocaleString(), color: "text-success" },
            { label: "Deals", value: blogs.reduce((a, b) => a + (b.deals || 0), 0), color: "text-accent-amber" },
            { label: "Demos", value: blogs.reduce((a, b) => a + (b.demos || 0), 0), color: "text-accent-violet" },
            { label: "Avg Rank", value: (() => { const ranked = blogs.filter(b => b.currentRanking); return ranked.length > 0 ? (ranked.reduce((a, b) => a + (b.currentRanking || 0), 0) / ranked.length).toFixed(1) : "—"; })(), color: "text-accent-coral" },
          ].map(s => (
            <div key={s.label} className="card p-4 text-center">
              <p className="text-xs text-text-muted uppercase">{s.label}</p>
              <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
