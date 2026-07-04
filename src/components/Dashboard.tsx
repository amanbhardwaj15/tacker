"use client";

import { useEffect, useState } from "react";
import {
  FileText, Sparkles, MessageSquare, Globe, TrendingUp, TrendingDown,
  Eye, MousePointer, DollarSign, Users, AlertTriangle, BarChart3, Bot, List, Target
} from "lucide-react";
import {
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Funnel, FunnelChart, LabelList
} from "recharts";

type DashboardData = {
  summary: {
    totalNewBlogs: number;
    totalRevampedBlogs: number;
    totalAeoBlogs: number;
    totalLandingPages: number;
    totalListicles: number;
    listedListicles: number;
    totalSocialPosts: number;
    totalRedditPosts: number;
    totalQuoraPosts: number;
    totalTraffic: number;
    totalDeals: number;
    totalDemos: number;
    totalClicks: number;
    totalImpressions: number;
    llmMentions: number;
    totalAeo: number;
    socialUpvotes: number;
    socialViews: number;
    socialReferrals: number;
  };
  rankingBuckets: Record<string, number>;
  statusDist: Record<string, number>;
  contentTypeDist: Array<{ name: string; value: number; color: string }>;
  llmDist: Array<{ name: string; value: number; color: string }>;
  trafficTrend: Array<{ month: string; traffic: number; clicks: number }>;
  conversionFunnel: Array<{ stage: string; value: number }>;
  alerts: Array<{ type: "error" | "warning" | "info"; message: string }>;
  weeklyGoals: Array<{ goal: string; current: number; target: number }>;
  recentBlogs: Array<Record<string, unknown>>;
  recentAeo: Array<Record<string, unknown>>;
  recentSocial: Array<Record<string, unknown>>;
  recentPages: Array<Record<string, unknown>>;
};

function StatCard({ icon, label, value, subValue, glowClass }: { icon: React.ReactNode; label: string; value: string | number; subValue?: string; glowClass?: string }) {
  return (
    <div className={`card p-4 ${glowClass || ""}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-text-muted uppercase tracking-wide mb-1">{label}</p>
          <p className="text-2xl font-bold text-text-primary">{value}</p>
          {subValue && <p className="text-xs text-text-muted mt-1">{subValue}</p>}
        </div>
        <div className="text-text-muted opacity-60">{icon}</div>
      </div>
    </div>
  );
}

function AlertCard({ alerts }: { alerts: Array<{ type: string; message: string }> }) {
  if (alerts.length === 0) return null;
  
  const getAlertStyle = (type: string) => {
    switch (type) {
      case "error": return "border-l-error bg-error/5";
      case "warning": return "border-l-warning bg-warning/5";
      default: return "border-l-info bg-info/5";
    }
  };
  
  const getIcon = (type: string) => {
    switch (type) {
      case "error": return <AlertTriangle size={14} className="text-error" />;
      case "warning": return <AlertTriangle size={14} className="text-warning" />;
      default: return <Target size={14} className="text-info" />;
    }
  };

  return (
    <div className="card p-4">
      <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
        <AlertTriangle size={16} className="text-warning" />
        Performance Alerts
      </h3>
      <div className="space-y-2">
        {alerts.slice(0, 5).map((alert, i) => (
          <div key={i} className={`p-3 border-l-4 rounded-r ${getAlertStyle(alert.type)}`}>
            <div className="flex items-start gap-2">
              {getIcon(alert.type)}
              <p className="text-xs text-text-secondary flex-1">{alert.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GoalsCard({ goals }: { goals: Array<{ goal: string; current: number; target: number }> }) {
  return (
    <div className="card p-4">
      <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
        <Target size={16} className="text-primary-500" />
        Weekly Goals
      </h3>
      <div className="space-y-3">
        {goals.map((g, i) => {
          const pct = Math.min((g.current / g.target) * 100, 100);
          const isComplete = g.current >= g.target;
          return (
            <div key={i}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-text-secondary">{g.goal}</span>
                <span className={`text-xs font-medium ${isComplete ? "text-success" : "text-text-primary"}`}>
                  {g.current}/{g.target}
                </span>
              </div>
              <div className="progress-bar">
                <div
                  className={`progress-bar-fill ${isComplete ? "bg-success" : "bg-primary-500"}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-primary-500 text-sm animate-pulse">Loading dashboard...</div>
      </div>
    );
  }

  if (!data || data.summary === undefined) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-text-muted text-sm">Failed to load dashboard data</div>
      </div>
    );
  }

  const s = data.summary;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-text-primary">Dashboard</h2>
          <p className="text-sm text-text-muted mt-1">Content operations overview</p>
        </div>
        <div className="text-xs text-text-muted bg-bg-card px-3 py-1.5 rounded-lg border border-border">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* Alerts Row */}
      {data.alerts.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <AlertCard alerts={data.alerts} />
          <GoalsCard goals={data.weeklyGoals} />
        </div>
      )}

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<FileText size={20} />} label="Total Blogs" value={s.totalNewBlogs + s.totalRevampedBlogs} subValue={`${s.totalNewBlogs} new, ${s.totalRevampedBlogs} revamped`} glowClass="stat-glow-blue" />
        <StatCard icon={<Sparkles size={20} />} label="AEO Blogs" value={s.totalAeoBlogs} subValue={`${s.llmMentions} LLM mentions`} glowClass="stat-glow-violet" />
        <StatCard icon={<List size={20} />} label="Listicles" value={s.totalListicles} subValue={`${s.listedListicles} listed`} glowClass="stat-glow-amber" />
        <StatCard icon={<MessageSquare size={20} />} label="Social Posts" value={s.totalSocialPosts} subValue={`${s.totalRedditPosts} Reddit, ${s.totalQuoraPosts} Quora`} glowClass="stat-glow-coral" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Eye size={20} />} label="Total Traffic" value={s.totalTraffic.toLocaleString()} glowClass="stat-glow-blue" />
        <StatCard icon={<MousePointer size={20} />} label="Total Clicks" value={s.totalClicks.toLocaleString()} subValue={`${s.totalImpressions.toLocaleString()} impressions`} glowClass="stat-glow-green" />
        <StatCard icon={<DollarSign size={20} />} label="Deals" value={s.totalDeals} glowClass="stat-glow-amber" />
        <StatCard icon={<Users size={20} />} label="Demos" value={s.totalDemos} glowClass="stat-glow-violet" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Traffic Trend */}
        <div className="chart-container">
          <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-primary-500" />
            Traffic & Clicks Trend
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={data.trafficTrend}>
              <defs>
                <linearGradient id="trafficGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="clicksGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569", borderRadius: "8px" }} />
              <Legend />
              <Area type="monotone" dataKey="traffic" name="Traffic" stroke="#0ea5e9" fill="url(#trafficGradient)" strokeWidth={2} />
              <Area type="monotone" dataKey="clicks" name="Clicks" stroke="#22c55e" fill="url(#clicksGradient)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Content Type Distribution */}
        <div className="chart-container">
          <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
            <BarChart3 size={16} className="text-primary-500" />
            Content Distribution
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={data.contentTypeDist.filter(d => d.value > 0)}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
              >
                {data.contentTypeDist.filter(d => d.value > 0).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569", borderRadius: "8px" }} />
              <Legend formatter={(value) => <span style={{ color: "#94a3b8", fontSize: 12 }}>{value}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Second Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* LLM Distribution */}
        <div className="chart-container">
          <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Bot size={16} className="text-accent-violet" />
            LLM Mention Distribution
          </h3>
          {data.llmDist.some(d => d.value > 0) ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data.llmDist} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis type="number" stroke="#64748b" fontSize={12} />
                <YAxis type="category" dataKey="name" stroke="#64748b" fontSize={12} width={80} />
                <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569", borderRadius: "8px" }} />
                <Bar dataKey="value" name="Mentions" radius={[0, 4, 4, 0]}>
                  {data.llmDist.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[250px] text-text-muted text-sm">
              Add AEO blogs and track LLM mentions to see data
            </div>
          )}
        </div>

        {/* Ranking Distribution */}
        <div className="chart-container">
          <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-success" />
            SERP Ranking Distribution
          </h3>
          {Object.values(data.rankingBuckets).some(v => v > 0) ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={[
                { range: "Top 3", count: data.rankingBuckets.top3, fill: "#22c55e" },
                { range: "Top 10", count: data.rankingBuckets.top10, fill: "#0ea5e9" },
                { range: "Top 20", count: data.rankingBuckets.top20, fill: "#f59e0b" },
                { range: "Top 50", count: data.rankingBuckets.top50, fill: "#a78bfa" },
                { range: "50+", count: data.rankingBuckets.beyond, fill: "#ef4444" },
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="range" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569", borderRadius: "8px" }} />
                <Bar dataKey="count" name="Blogs" radius={[4, 4, 0, 0]}>
                  {[
                    { range: "Top 3", count: data.rankingBuckets.top3, fill: "#22c55e" },
                    { range: "Top 10", count: data.rankingBuckets.top10, fill: "#0ea5e9" },
                    { range: "Top 20", count: data.rankingBuckets.top20, fill: "#f59e0b" },
                    { range: "Top 50", count: data.rankingBuckets.top50, fill: "#a78bfa" },
                    { range: "50+", count: data.rankingBuckets.beyond, fill: "#ef4444" },
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[250px] text-text-muted text-sm">
              Add ranking data to blogs to see distribution
            </div>
          )}
        </div>
      </div>

      {/* Social & Conversion */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Social Stats */}
        <div className="card p-4">
          <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
            <MessageSquare size={16} className="text-accent-coral" />
            Social Engagement
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-bg-primary/50 p-3 rounded-lg">
              <p className="text-xs text-text-muted">Upvotes</p>
              <p className="text-lg font-bold text-accent-coral">{s.socialUpvotes}</p>
            </div>
            <div className="bg-bg-primary/50 p-3 rounded-lg">
              <p className="text-xs text-text-muted">Views</p>
              <p className="text-lg font-bold text-primary-500">{s.socialViews.toLocaleString()}</p>
            </div>
            <div className="bg-bg-primary/50 p-3 rounded-lg">
              <p className="text-xs text-text-muted">Referrals</p>
              <p className="text-lg font-bold text-success">{s.socialReferrals}</p>
            </div>
            <div className="bg-bg-primary/50 p-3 rounded-lg">
              <p className="text-xs text-text-muted">Eng. Rate</p>
              <p className="text-lg font-bold text-accent-violet">
                {s.socialViews > 0 ? ((s.socialUpvotes / s.socialViews) * 100).toFixed(1) : 0}%
              </p>
            </div>
          </div>
        </div>

        {/* Content Status */}
        <div className="card p-4">
          <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
            <FileText size={16} className="text-success" />
            Content Status
          </h3>
          <div className="space-y-3">
            {[
              { label: "Published", count: data.statusDist.published, color: "bg-success" },
              { label: "In Progress", count: data.statusDist.inProgress, color: "bg-warning" },
              { label: "Draft", count: data.statusDist.draft, color: "bg-text-muted" },
            ].map((item) => {
              const total = data.statusDist.draft + data.statusDist.inProgress + data.statusDist.published;
              const pct = total > 0 ? (item.count / total) * 100 : 0;
              return (
                <div key={item.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-text-secondary">{item.label}</span>
                    <span className="text-text-primary font-medium">{item.count}</span>
                  </div>
                  <div className="progress-bar">
                    <div className={`progress-bar-fill ${item.color}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* LLM Mention Rate */}
        <div className="card p-4">
          <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Bot size={16} className="text-accent-violet" />
            AEO Performance
          </h3>
          <div className="text-center py-4">
            <p className="text-4xl font-bold text-accent-violet">
              {s.totalAeo > 0 ? Math.round((s.llmMentions / s.totalAeo) * 100) : 0}%
            </p>
            <p className="text-xs text-text-muted mt-1">LLM Mention Rate</p>
          </div>
          <div className="progress-bar mt-2">
            <div
              className="progress-bar-fill bg-accent-violet"
              style={{ width: `${s.totalAeo > 0 ? (s.llmMentions / s.totalAeo) * 100 : 0}%` }}
            />
          </div>
          <p className="text-xs text-text-muted text-center mt-2">
            {s.llmMentions} of {s.totalAeo} AEO blogs mentioned
          </p>
        </div>
      </div>
    </div>
  );
}
