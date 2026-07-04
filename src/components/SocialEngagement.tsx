"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Edit2, Trash2, X, ExternalLink, ThumbsUp, Eye, MessageSquare, ArrowUpRight } from "lucide-react";

type SocialPost = {
  id: number;
  platform: string;
  postUrl: string | null;
  postTitle: string;
  subredditOrTopic: string | null;
  engagementType: string;
  content: string | null;
  upvotes: number;
  comments: number;
  views: number;
  referralTraffic: number;
  status: string | null;
  notes: string | null;
  createdAt: string;
};

const emptyForm = {
  platform: "reddit",
  postUrl: "",
  postTitle: "",
  subredditOrTopic: "",
  engagementType: "comment",
  content: "",
  upvotes: "",
  comments: "",
  views: "",
  referralTraffic: "",
  status: "active",
  notes: "",
};

export default function SocialEngagement() {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [filterPlatform, setFilterPlatform] = useState<string>("all");

  const fetchPosts = useCallback(() => {
    fetch("/api/social")
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setPosts(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const filteredPosts = filterPlatform === "all" ? posts : posts.filter(p => p.platform === filterPlatform);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = {
      ...form,
      upvotes: parseInt(form.upvotes) || 0,
      comments: parseInt(form.comments) || 0,
      views: parseInt(form.views) || 0,
      referralTraffic: parseInt(form.referralTraffic) || 0,
      ...(editingId ? { id: editingId } : {}),
    };
    
    const method = editingId ? "PUT" : "POST";
    await fetch("/api/social", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    fetchPosts();
  };

  const handleEdit = (post: SocialPost) => {
    setEditingId(post.id);
    setForm({
      platform: post.platform,
      postUrl: post.postUrl || "",
      postTitle: post.postTitle,
      subredditOrTopic: post.subredditOrTopic || "",
      engagementType: post.engagementType,
      content: post.content || "",
      upvotes: post.upvotes?.toString() || "",
      comments: post.comments?.toString() || "",
      views: post.views?.toString() || "",
      referralTraffic: post.referralTraffic?.toString() || "",
      status: post.status || "active",
      notes: post.notes || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this engagement entry?")) return;
    await fetch(`/api/social?id=${id}`, { method: "DELETE" });
    fetchPosts();
  };

  const redditPosts = posts.filter(p => p.platform === "reddit");
  const quoraPosts = posts.filter(p => p.platform === "quora");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-text-primary">Reddit & Quora</h2>
          <p className="text-sm text-text-muted mt-1">Social engagement tracking • {posts.length} entries</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyForm); }} className="btn btn-primary">
          <Plus size={16} /> Add Engagement
        </button>
      </div>

      {/* Platform Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4 text-center stat-glow-coral">
          <p className="text-xs text-text-muted uppercase">Reddit Posts</p>
          <p className="text-2xl font-bold text-accent-coral">{redditPosts.length}</p>
        </div>
        <div className="card p-4 text-center stat-glow-amber">
          <p className="text-xs text-text-muted uppercase">Quora Answers</p>
          <p className="text-2xl font-bold text-accent-amber">{quoraPosts.length}</p>
        </div>
        <div className="card p-4 text-center stat-glow-green">
          <p className="text-xs text-text-muted uppercase">Total Upvotes</p>
          <p className="text-2xl font-bold text-success">{posts.reduce((a, p) => a + (p.upvotes || 0), 0)}</p>
        </div>
        <div className="card p-4 text-center stat-glow-blue">
          <p className="text-xs text-text-muted uppercase">Referral Traffic</p>
          <p className="text-2xl font-bold text-primary-500">{posts.reduce((a, p) => a + (p.referralTraffic || 0), 0)}</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {["all", "reddit", "quora"].map(p => (
          <button
            key={p}
            onClick={() => setFilterPlatform(p)}
            className={`btn text-xs ${filterPlatform === p ? "btn-primary" : "btn-secondary"}`}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 modal-overlay flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-bg-secondary border border-border rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-text-primary">{editingId ? "Edit" : "Add"} Social Engagement</h3>
              <button onClick={() => setShowForm(false)} className="text-text-muted hover:text-text-primary"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-text-muted uppercase">Platform *</label>
                  <select className="input w-full mt-1" value={form.platform} onChange={e => setForm({ ...form, platform: e.target.value })}>
                    <option value="reddit">Reddit</option>
                    <option value="quora">Quora</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-text-muted uppercase">Engagement Type *</label>
                  <select className="input w-full mt-1" value={form.engagementType} onChange={e => setForm({ ...form, engagementType: e.target.value })}>
                    <option value="comment">Comment</option>
                    <option value="post">Post</option>
                    <option value="answer">Answer</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-medium text-text-muted uppercase">Post Title *</label>
                  <input className="input w-full mt-1" value={form.postTitle} onChange={e => setForm({ ...form, postTitle: e.target.value })} required />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-medium text-text-muted uppercase">Post URL</label>
                  <input className="input w-full mt-1" value={form.postUrl} onChange={e => setForm({ ...form, postUrl: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs font-medium text-text-muted uppercase">Subreddit / Topic</label>
                  <input className="input w-full mt-1" value={form.subredditOrTopic} onChange={e => setForm({ ...form, subredditOrTopic: e.target.value })} placeholder="e.g. r/AutoDealer" />
                </div>
                <div>
                  <label className="text-xs font-medium text-text-muted uppercase">Status</label>
                  <select className="input w-full mt-1" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                    <option value="active">Active</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-text-muted uppercase">Upvotes</label>
                  <input type="number" className="input w-full mt-1" value={form.upvotes} onChange={e => setForm({ ...form, upvotes: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs font-medium text-text-muted uppercase">Comments</label>
                  <input type="number" className="input w-full mt-1" value={form.comments} onChange={e => setForm({ ...form, comments: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs font-medium text-text-muted uppercase">Views</label>
                  <input type="number" className="input w-full mt-1" value={form.views} onChange={e => setForm({ ...form, views: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs font-medium text-text-muted uppercase">Referral Traffic</label>
                  <input type="number" className="input w-full mt-1" value={form.referralTraffic} onChange={e => setForm({ ...form, referralTraffic: e.target.value })} />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-medium text-text-muted uppercase">Content / Response</label>
                  <textarea className="input w-full mt-1" value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={4} />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-medium text-text-muted uppercase">Notes</label>
                  <textarea className="input w-full mt-1" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2} />
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

      {/* Posts List */}
      {loading ? (
        <div className="text-center py-8 text-text-muted">Loading...</div>
      ) : filteredPosts.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-text-muted">No social engagement entries yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredPosts.map(post => (
            <div key={post.id} className="card p-4 hover:border-accent-coral/50 transition-all">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`badge ${post.platform === "reddit" ? "badge-error" : "badge-warning"}`}>
                      {post.platform}
                    </span>
                    <span className="badge badge-neutral">{post.engagementType}</span>
                    {post.subredditOrTopic && (
                      <span className="text-xs text-primary-500">{post.subredditOrTopic}</span>
                    )}
                  </div>
                  <h3 className="font-semibold text-text-primary">{post.postTitle}</h3>
                  {post.postUrl && (
                    <a href={post.postUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-500 hover:underline flex items-center gap-1 mt-1">
                      <ExternalLink size={10} /> View Post
                    </a>
                  )}
                </div>
                <div className="flex gap-1">
                  <button onClick={() => handleEdit(post)} className="p-1 text-text-muted hover:text-primary-500"><Edit2 size={14} /></button>
                  <button onClick={() => handleDelete(post.id)} className="p-1 text-text-muted hover:text-error"><Trash2 size={14} /></button>
                </div>
              </div>
              <div className="flex gap-4 mt-3 text-sm">
                <span className="flex items-center gap-1 text-success"><ThumbsUp size={14} /> {post.upvotes}</span>
                <span className="flex items-center gap-1 text-primary-500"><MessageSquare size={14} /> {post.comments}</span>
                <span className="flex items-center gap-1 text-accent-amber"><Eye size={14} /> {post.views?.toLocaleString()}</span>
                <span className="flex items-center gap-1 text-accent-violet"><ArrowUpRight size={14} /> {post.referralTraffic} referrals</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
