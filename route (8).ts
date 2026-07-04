import { db } from "@/db";
import { seoBlogs, aeoBlogs, socialEngagement, landingPages, listicles } from "@/db/schema";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [blogs, aeo, social, pages, lists] = await Promise.all([
      db.select().from(seoBlogs),
      db.select().from(aeoBlogs),
      db.select().from(socialEngagement),
      db.select().from(landingPages),
      db.select().from(listicles),
    ]);

    const newBlogs = blogs.filter(b => b.type === "new");
    const revampedBlogs = blogs.filter(b => b.type === "revamped");
    const redditPosts = social.filter(s => s.platform === "reddit");
    const quoraPosts = social.filter(s => s.platform === "quora");
    const listedListicles = lists.filter(l => l.spyneListed);

    const totalTraffic = [
      ...blogs.map(b => b.monthlyTraffic || 0),
      ...aeo.map(a => a.monthlyTraffic || 0),
      ...pages.map(p => p.monthlyTraffic || 0),
    ].reduce((a, b) => a + b, 0);

    const totalDeals = [
      ...blogs.map(b => b.deals || 0),
      ...pages.map(p => p.deals || 0),
    ].reduce((a, b) => a + b, 0);

    const totalDemos = [
      ...blogs.map(b => b.demos || 0),
      ...pages.map(p => p.demos || 0),
    ].reduce((a, b) => a + b, 0);

    const totalClicks = [
      ...blogs.map(b => b.clicks || 0),
      ...aeo.map(a => a.clicks || 0),
    ].reduce((a, b) => a + b, 0);

    const totalImpressions = [
      ...blogs.map(b => b.impressions || 0),
      ...aeo.map(a => a.impressions || 0),
    ].reduce((a, b) => a + b, 0);

    const llmMentions = aeo.filter(a => 
      a.chatgptMentioned || a.geminiMentioned || a.claudeMentioned || a.perplexityMentioned
    ).length;

    const socialUpvotes = social.reduce((a, s) => a + (s.upvotes || 0), 0);
    const socialViews = social.reduce((a, s) => a + (s.views || 0), 0);
    const socialReferrals = social.reduce((a, s) => a + (s.referralTraffic || 0), 0);

    // Ranking distribution for blogs
    const rankingBuckets = {
      top3: blogs.filter(b => b.currentRanking && b.currentRanking <= 3).length,
      top10: blogs.filter(b => b.currentRanking && b.currentRanking > 3 && b.currentRanking <= 10).length,
      top20: blogs.filter(b => b.currentRanking && b.currentRanking > 10 && b.currentRanking <= 20).length,
      top50: blogs.filter(b => b.currentRanking && b.currentRanking > 20 && b.currentRanking <= 50).length,
      beyond: blogs.filter(b => b.currentRanking && b.currentRanking > 50).length,
    };

    // Status distribution
    const statusDist = {
      draft: blogs.filter(b => b.status === "draft").length,
      inProgress: blogs.filter(b => b.status === "in-progress").length,
      published: blogs.filter(b => b.status === "published").length,
    };

    // Content type distribution for pie chart
    const contentTypeDist = [
      { name: "New Blogs", value: newBlogs.length, color: "#0ea5e9" },
      { name: "Revamped", value: revampedBlogs.length, color: "#22d3ee" },
      { name: "AEO Blogs", value: aeo.length, color: "#a78bfa" },
      { name: "Landing Pages", value: pages.length, color: "#34d399" },
      { name: "Listicles", value: lists.length, color: "#fbbf24" },
    ];

    // LLM Distribution for pie chart
    const llmDist = [
      { name: "ChatGPT", value: aeo.filter(a => a.chatgptMentioned).length, color: "#22c55e" },
      { name: "Gemini", value: aeo.filter(a => a.geminiMentioned).length, color: "#3b82f6" },
      { name: "Claude", value: aeo.filter(a => a.claudeMentioned).length, color: "#a78bfa" },
      { name: "Perplexity", value: aeo.filter(a => a.perplexityMentioned).length, color: "#f59e0b" },
    ];

    // Traffic trend data (simulated monthly data)
    const trafficTrend = [
      { month: "Jan", traffic: Math.round(totalTraffic * 0.6), clicks: Math.round(totalClicks * 0.5) },
      { month: "Feb", traffic: Math.round(totalTraffic * 0.7), clicks: Math.round(totalClicks * 0.6) },
      { month: "Mar", traffic: Math.round(totalTraffic * 0.75), clicks: Math.round(totalClicks * 0.65) },
      { month: "Apr", traffic: Math.round(totalTraffic * 0.85), clicks: Math.round(totalClicks * 0.75) },
      { month: "May", traffic: Math.round(totalTraffic * 0.9), clicks: Math.round(totalClicks * 0.85) },
      { month: "Jun", traffic: totalTraffic, clicks: totalClicks },
    ];

    // Conversion funnel
    const conversionFunnel = [
      { stage: "Impressions", value: totalImpressions },
      { stage: "Clicks", value: totalClicks },
      { stage: "Demos", value: totalDemos },
      { stage: "Deals", value: totalDeals },
    ];

    // Alerts - Performance AI integrated
    const alerts: { type: "error" | "warning" | "info"; message: string }[] = [];
    
    blogs.forEach(b => {
      if (b.currentRanking && b.previousRanking && b.currentRanking > b.previousRanking) {
        alerts.push({ type: "warning", message: `"${b.title}" ranking dropped from #${b.previousRanking} to #${b.currentRanking}` });
      }
    });
    
    if (aeo.length > 0 && llmMentions / aeo.length < 0.5) {
      alerts.push({ type: "error", message: `Only ${Math.round((llmMentions / aeo.length) * 100)}% of AEO blogs are mentioned by LLMs (target: 80%)` });
    }
    
    const draftCount = blogs.filter(b => b.status === "draft").length + aeo.filter(a => a.status === "draft").length;
    if (draftCount > 5) {
      alerts.push({ type: "warning", message: `${draftCount} content pieces still in draft — consider publishing` });
    }

    const unlistedListicles = lists.filter(l => !l.spyneListed).length;
    if (unlistedListicles > 3) {
      alerts.push({ type: "info", message: `${unlistedListicles} target listicles pending — follow up on outreach` });
    }

    // Weekly goals progress
    const weeklyGoals = [
      { goal: "Publish 3 new blogs", current: newBlogs.filter(b => b.status === "published").length, target: 3 },
      { goal: "Revamp 2 old blogs", current: revampedBlogs.filter(b => b.status === "published").length, target: 2 },
      { goal: "Create 2 AEO blogs", current: aeo.filter(a => a.status === "published").length, target: 2 },
      { goal: "10 social engagements", current: social.length, target: 10 },
      { goal: "Get listed in 2 listicles", current: listedListicles.length, target: 2 },
    ];

    return NextResponse.json({
      summary: {
        totalNewBlogs: newBlogs.length,
        totalRevampedBlogs: revampedBlogs.length,
        totalAeoBlogs: aeo.length,
        totalLandingPages: pages.length,
        totalListicles: lists.length,
        listedListicles: listedListicles.length,
        totalSocialPosts: social.length,
        totalRedditPosts: redditPosts.length,
        totalQuoraPosts: quoraPosts.length,
        totalTraffic,
        totalDeals,
        totalDemos,
        totalClicks,
        totalImpressions,
        llmMentions,
        totalAeo: aeo.length,
        socialUpvotes,
        socialViews,
        socialReferrals,
      },
      rankingBuckets,
      statusDist,
      contentTypeDist,
      llmDist,
      trafficTrend,
      conversionFunnel,
      alerts,
      weeklyGoals,
      recentBlogs: blogs.slice(0, 5),
      recentAeo: aeo.slice(0, 5),
      recentSocial: social.slice(0, 5),
      recentPages: pages.slice(0, 5),
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
  }
}
