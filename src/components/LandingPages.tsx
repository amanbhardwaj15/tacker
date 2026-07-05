"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Edit2, Trash2, X, ExternalLink, Globe } from "lucide-react";

type LandingPage = {
  id: number;
  title: string;
  url: string | null;
  pageType: string;
  status: string;
  targetKeyword: string | null;
  monthlyTraffic: number;
  conversions: number;
  bounceRate: string | null;
  deals: number;
  demos: number;
  notes: string | null;
  createdAt: string;
};

const emptyForm = {
  title: "",
  url: "",
  pageType: "event",
  status: "draft",
  targetKeyword: "",
  monthlyTraffic: "",
  conversions: "",
  bounceRate: "",
  deals: "",
  demos: "",
  notes: "",
};

export default function LandingPages() {
  const [pages, setPages] = useState<LandingPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);

  const fetchPages = useCallback(() => {
    fetch("/api/landing-pages")
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setPages(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => { fetchPages(); }, [fetchPages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = {
      ...form,
      monthlyTraffic: parseInt(form.monthlyTraffic) || 0,
      conversions: parseInt(form.conversions) || 0,
      deals: parseInt(form.deals) || 0,
      demos: parseInt(form.demos) || 0,
      ...(editingId ? { id: editingId } : {}),
    };
    
    const method = editingId ? "PUT" : "POST";
    await fetch("/api/landing-pages", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    fetchPages();
  };

  const handleEdit = (page: LandingPage) => {
    setEditingId(page.id);
    setForm({
      title: page.title,
      url: page.url || "",
      pageType: page.pageType,
      status: page.status,
      targetKeyword: page.targetKeyword || "",
      monthlyTraffic: page.monthlyTraffic?.toString() || "",
      conversions: page.conversions?.toString() || "",
      bounceRate: page.bounceRate || "",
      deals: page.deals?.toString() || "",
      demos: page.demos?.toString() || "",
      notes: page.notes || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this landing page entry?")) return;
    await fetch(`/api/landing-pages?id=${id}`, { method: "DELETE" });
    fetchPages();
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "event": return "badge-error";
      case "webinar": return "badge-info";
      case "product": return "badge-success";
      case "campaign": return "badge-warning";
      default: return "badge-neutral";
    }
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
          <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <Globe size={22} className="text-success" />
            Landing Pages
          </h2>
          <p className="text-sm text-text-muted mt-1">Events, webinars, campaigns & more • {pages.length} entries</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyForm); }} className="btn btn-primary">
          <Plus size={16} /> Add Page
        </button>
      </div>

      {/* Stats */}
      {pages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: "Total Pages", value: pages.length, color: "text-success", glow: "stat-glow-green" },
            { label: "Traffic", value: pages.reduce((a, p) => a + (p.monthlyTraffic || 0), 0).toLocaleString(), color: "text-primary-500", glow: "stat-glow-blue" },
            { label: "Conversions", value: pages.reduce((a, p) => a + (p.conversions || 0), 0), color: "text-accent-amber", glow: "stat-glow-amber" },
            { label: "Deals", value: pages.reduce((a, p) => a + (p.deals || 0), 0), color: "text-accent-coral", glow: "stat-glow-coral" },
            { label: "Demos", value: pages.reduce((a, p) => a + (p.demos || 0), 0), color: "text-accent-violet", glow: "stat-glow-violet" },
          ].map(s => (
            <div key={s.label} className={`card p-4 text-center ${s.glow}`}>
              <p className="text-xs text-text-muted uppercase">{s.label}</p>
              <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 modal-overlay flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-bg-secondary border border-border rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-text-primary">{editingId ? "Edit" : "Add"} Landing Page</h3>
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
                  <label className="text-xs font-medium text-text-muted uppercase">Page Type *</label>
                  <select className="input w-full mt-1" value={form.pageType} onChange={e => setForm({ ...form, pageType: e.target.value })}>
                    <option value="event">Event</option>
                    <option value="webinar">Webinar</option>
                    <option value="product">Product</option>
                    <option value="campaign">Campaign</option>
                  </select>
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
                <div>
                  <label className="text-xs font-medium text-text-muted uppercase">Monthly Traffic</label>
                  <input type="number" className="input w-full mt-1" value={form.monthlyTraffic} onChange={e => setForm({ ...form, monthlyTraffic: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs font-medium text-text-muted uppercase">Conversions</label>
                  <input type="number" className="input w-full mt-1" value={form.conversions} onChange={e => setForm({ ...form, conversions: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs font-medium text-text-muted uppercase">Bounce Rate</label>
                  <input className="input w-full mt-1" value={form.bounceRate} onChange={e => setForm({ ...form, bounceRate: e.target.value })} placeholder="e.g. 45%" />
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

      {/* Pages Grid */}
      {loading ? (
        <div className="text-center py-8 text-text-muted">Loading...</div>
      ) : pages.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-text-muted">No landing pages yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pages.map(page => (
            <div key={page.id} className="card p-4 hover:border-success/50 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`badge ${getTypeBadge(page.pageType)}`}>{page.pageType}</span>
                  <span className={`badge ${getStatusBadge(page.status)}`}>{page.status}</span>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => handleEdit(page)} className="p-1 text-text-muted hover:text-primary-500"><Edit2 size={14} /></button>
                  <button onClick={() => handleDelete(page.id)} className="p-1 text-text-muted hover:text-error"><Trash2 size={14} /></button>
                </div>
              </div>
              <h3 className="font-semibold text-text-primary mb-1">{page.title}</h3>
              {page.url && (
                <a href={page.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-500 hover:underline flex items-center gap-1 mb-2">
                  <ExternalLink size={10} /> {page.url}
                </a>
              )}
              {page.targetKeyword && <p className="text-xs text-text-muted mb-3">Keyword: {page.targetKeyword}</p>}
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-bg-primary/50 p-2 rounded">
                  <p className="text-[10px] text-text-muted">Traffic</p>
                  <p className="text-sm font-bold text-primary-500">{page.monthlyTraffic?.toLocaleString()}</p>
                </div>
                <div className="bg-bg-primary/50 p-2 rounded">
                  <p className="text-[10px] text-text-muted">Conv.</p>
                  <p className="text-sm font-bold text-success">{page.conversions}</p>
                </div>
                <div className="bg-bg-primary/50 p-2 rounded">
                  <p className="text-[10px] text-text-muted">Deals</p>
                  <p className="text-sm font-bold text-accent-amber">{page.deals}</p>
                </div>
                <div className="bg-bg-primary/50 p-2 rounded">
                  <p className="text-[10px] text-text-muted">Demos</p>
                  <p className="text-sm font-bold text-accent-violet">{page.demos}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
