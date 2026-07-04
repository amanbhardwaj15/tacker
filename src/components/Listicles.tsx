"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Edit2, Trash2, X, ExternalLink, Check, Clock, Mail, TrendingUp } from "lucide-react";

type Listicle = {
  id: number;
  title: string;
  url: string | null;
  targetListicle: string | null;
  status: string;
  spyneListed: boolean;
  spynePosition: number | null;
  listicleOwner: string | null;
  contactEmail: string | null;
  outreachDate: string | null;
  monthlyTraffic: number;
  domainAuthority: number | null;
  referralTraffic: number;
  notes: string | null;
  createdAt: string;
};

const emptyForm = {
  title: "",
  url: "",
  targetListicle: "",
  status: "identified",
  spyneListed: false,
  spynePosition: "",
  listicleOwner: "",
  contactEmail: "",
  outreachDate: "",
  monthlyTraffic: "",
  domainAuthority: "",
  referralTraffic: "",
  notes: "",
};

export default function Listicles() {
  const [listicles, setListicles] = useState<Listicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [filterStatus, setFilterStatus] = useState("all");

  const fetchListicles = useCallback(() => {
    fetch("/api/listicles")
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setListicles(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => { fetchListicles(); }, [fetchListicles]);

  const filteredListicles = filterStatus === "all" ? listicles : listicles.filter(l => l.status === filterStatus);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = {
      ...form,
      spynePosition: form.spynePosition ? parseInt(form.spynePosition) : null,
      monthlyTraffic: parseInt(form.monthlyTraffic) || 0,
      domainAuthority: form.domainAuthority ? parseInt(form.domainAuthority) : null,
      referralTraffic: parseInt(form.referralTraffic) || 0,
      ...(editingId ? { id: editingId } : {}),
    };
    
    const method = editingId ? "PUT" : "POST";
    await fetch("/api/listicles", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    fetchListicles();
  };

  const handleEdit = (listicle: Listicle) => {
    setEditingId(listicle.id);
    setForm({
      title: listicle.title,
      url: listicle.url || "",
      targetListicle: listicle.targetListicle || "",
      status: listicle.status,
      spyneListed: listicle.spyneListed,
      spynePosition: listicle.spynePosition?.toString() || "",
      listicleOwner: listicle.listicleOwner || "",
      contactEmail: listicle.contactEmail || "",
      outreachDate: listicle.outreachDate ? listicle.outreachDate.split("T")[0] : "",
      monthlyTraffic: listicle.monthlyTraffic?.toString() || "",
      domainAuthority: listicle.domainAuthority?.toString() || "",
      referralTraffic: listicle.referralTraffic?.toString() || "",
      notes: listicle.notes || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this listicle entry?")) return;
    await fetch(`/api/listicles?id=${id}`, { method: "DELETE" });
    fetchListicles();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "listed": return "badge-success";
      case "outreached": return "badge-warning";
      case "rejected": return "badge-error";
      default: return "badge-neutral";
    }
  };

  const listedCount = listicles.filter(l => l.spyneListed).length;
  const totalTraffic = listicles.reduce((a, l) => a + (l.monthlyTraffic || 0), 0);
  const totalReferrals = listicles.reduce((a, l) => a + (l.referralTraffic || 0), 0);
  const avgDA = listicles.filter(l => l.domainAuthority).length > 0
    ? Math.round(listicles.filter(l => l.domainAuthority).reduce((a, l) => a + (l.domainAuthority || 0), 0) / listicles.filter(l => l.domainAuthority).length)
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-text-primary">Target Listicles</h2>
          <p className="text-sm text-text-muted mt-1">Track listicles for AEO placement • {listicles.length} entries</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyForm); }} className="btn btn-primary">
          <Plus size={16} /> Add Listicle
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4 text-center stat-glow-green">
          <p className="text-xs text-text-muted uppercase">Listed</p>
          <p className="text-2xl font-bold text-success">{listedCount}</p>
        </div>
        <div className="card p-4 text-center stat-glow-blue">
          <p className="text-xs text-text-muted uppercase">Total Traffic</p>
          <p className="text-2xl font-bold text-primary-500">{totalTraffic.toLocaleString()}</p>
        </div>
        <div className="card p-4 text-center stat-glow-amber">
          <p className="text-xs text-text-muted uppercase">Referrals</p>
          <p className="text-2xl font-bold text-accent-amber">{totalReferrals}</p>
        </div>
        <div className="card p-4 text-center stat-glow-violet">
          <p className="text-xs text-text-muted uppercase">Avg DA</p>
          <p className="text-2xl font-bold text-accent-violet">{avgDA}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {["all", "identified", "outreached", "listed", "rejected"].map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`btn text-xs ${filterStatus === status ? "btn-primary" : "btn-secondary"}`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 modal-overlay flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-bg-secondary border border-border rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-text-primary">{editingId ? "Edit" : "Add"} Listicle</h3>
              <button onClick={() => setShowForm(false)} className="text-text-muted hover:text-text-primary"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="text-xs font-medium text-text-muted uppercase">Listicle Title *</label>
                  <input className="input w-full mt-1" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required placeholder="e.g., Top 10 AI Photography Tools" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-medium text-text-muted uppercase">URL</label>
                  <input className="input w-full mt-1" value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} placeholder="https://..." />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-medium text-text-muted uppercase">Target Listicle Description</label>
                  <input className="input w-full mt-1" value={form.targetListicle} onChange={e => setForm({ ...form, targetListicle: e.target.value })} placeholder="What we want to be listed in" />
                </div>
                <div>
                  <label className="text-xs font-medium text-text-muted uppercase">Status</label>
                  <select className="input w-full mt-1" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                    <option value="identified">Identified</option>
                    <option value="outreached">Outreached</option>
                    <option value="listed">Listed</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-text-muted uppercase">Spyne Listed</label>
                  <select className="input w-full mt-1" value={form.spyneListed.toString()} onChange={e => setForm({ ...form, spyneListed: e.target.value === "true" })}>
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-text-muted uppercase">Spyne Position</label>
                  <input type="number" className="input w-full mt-1" value={form.spynePosition} onChange={e => setForm({ ...form, spynePosition: e.target.value })} placeholder="#" />
                </div>
                <div>
                  <label className="text-xs font-medium text-text-muted uppercase">Domain Authority</label>
                  <input type="number" className="input w-full mt-1" value={form.domainAuthority} onChange={e => setForm({ ...form, domainAuthority: e.target.value })} placeholder="0-100" />
                </div>
                <div>
                  <label className="text-xs font-medium text-text-muted uppercase">Listicle Owner</label>
                  <input className="input w-full mt-1" value={form.listicleOwner} onChange={e => setForm({ ...form, listicleOwner: e.target.value })} placeholder="Author/Site name" />
                </div>
                <div>
                  <label className="text-xs font-medium text-text-muted uppercase">Contact Email</label>
                  <input type="email" className="input w-full mt-1" value={form.contactEmail} onChange={e => setForm({ ...form, contactEmail: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs font-medium text-text-muted uppercase">Outreach Date</label>
                  <input type="date" className="input w-full mt-1" value={form.outreachDate} onChange={e => setForm({ ...form, outreachDate: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs font-medium text-text-muted uppercase">Monthly Traffic</label>
                  <input type="number" className="input w-full mt-1" value={form.monthlyTraffic} onChange={e => setForm({ ...form, monthlyTraffic: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs font-medium text-text-muted uppercase">Referral Traffic</label>
                  <input type="number" className="input w-full mt-1" value={form.referralTraffic} onChange={e => setForm({ ...form, referralTraffic: e.target.value })} />
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

      {/* Listicles Grid */}
      {loading ? (
        <div className="text-center py-8 text-text-muted">Loading...</div>
      ) : filteredListicles.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-text-muted">No listicles found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredListicles.map(listicle => (
            <div key={listicle.id} className="card p-4 hover:border-primary-500/50 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={`badge ${getStatusBadge(listicle.status)}`}>
                    {listicle.status}
                  </span>
                  {listicle.spyneListed && (
                    <span className="badge badge-success flex items-center gap-1">
                      <Check size={10} /> Listed #{listicle.spynePosition}
                    </span>
                  )}
                </div>
                <div className="flex gap-1">
                  <button onClick={() => handleEdit(listicle)} className="p-1 text-text-muted hover:text-primary-500 transition-colors"><Edit2 size={14} /></button>
                  <button onClick={() => handleDelete(listicle.id)} className="p-1 text-text-muted hover:text-error transition-colors"><Trash2 size={14} /></button>
                </div>
              </div>
              
              <h3 className="font-semibold text-text-primary mb-1">{listicle.title}</h3>
              {listicle.url && (
                <a href={listicle.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-500 hover:underline flex items-center gap-1 mb-2">
                  <ExternalLink size={10} /> View Listicle
                </a>
              )}
              
              {listicle.targetListicle && (
                <p className="text-xs text-text-muted mb-3">{listicle.targetListicle}</p>
              )}

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-bg-primary/50 p-2 rounded">
                  <p className="text-[10px] text-text-muted">DA</p>
                  <p className="text-sm font-bold text-accent-violet">{listicle.domainAuthority || "—"}</p>
                </div>
                <div className="bg-bg-primary/50 p-2 rounded">
                  <p className="text-[10px] text-text-muted">Traffic</p>
                  <p className="text-sm font-bold text-primary-500">{listicle.monthlyTraffic?.toLocaleString() || 0}</p>
                </div>
                <div className="bg-bg-primary/50 p-2 rounded">
                  <p className="text-[10px] text-text-muted">Referrals</p>
                  <p className="text-sm font-bold text-success">{listicle.referralTraffic || 0}</p>
                </div>
              </div>

              {(listicle.listicleOwner || listicle.contactEmail) && (
                <div className="mt-3 pt-3 border-t border-border flex items-center gap-3 text-xs text-text-muted">
                  {listicle.listicleOwner && <span>{listicle.listicleOwner}</span>}
                  {listicle.contactEmail && (
                    <a href={`mailto:${listicle.contactEmail}`} className="flex items-center gap-1 text-primary-500 hover:underline">
                      <Mail size={10} /> Contact
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
