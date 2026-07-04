import { pgTable, serial, text, timestamp, integer, varchar, jsonb, boolean } from "drizzle-orm/pg-core";

// SEO Blogs (new + revamped)
export const seoBlogs = pgTable("seo_blogs", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  url: text("url"),
  type: varchar("type", { length: 20 }).notNull().default("new"), // 'new' or 'revamped'
  status: varchar("status", { length: 30 }).notNull().default("draft"), // draft, published, in-progress
  targetKeyword: varchar("target_keyword", { length: 300 }),
  secondaryKeywords: text("secondary_keywords"),
  currentRanking: integer("current_ranking"),
  previousRanking: integer("previous_ranking"),
  monthlyTraffic: integer("monthly_traffic").default(0),
  impressions: integer("impressions").default(0),
  clicks: integer("clicks").default(0),
  ctr: varchar("ctr", { length: 10 }),
  deals: integer("deals").default(0),
  demos: integer("demos").default(0),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// AEO Blogs
export const aeoBlogs = pgTable("aeo_blogs", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  url: text("url"),
  targetQuery: text("target_query"),
  status: varchar("status", { length: 30 }).notNull().default("draft"),
  serpRanking: integer("serp_ranking"),
  monthlyTraffic: integer("monthly_traffic").default(0),
  impressions: integer("impressions").default(0),
  clicks: integer("clicks").default(0),
  // LLM performance tracking
  chatgptMentioned: boolean("chatgpt_mentioned").default(false),
  geminiMentioned: boolean("gemini_mentioned").default(false),
  claudeMentioned: boolean("claude_mentioned").default(false),
  perplexityMentioned: boolean("perplexity_mentioned").default(false),
  chatgptPosition: integer("chatgpt_position"),
  geminiPosition: integer("gemini_position"),
  claudePosition: integer("claude_position"),
  perplexityPosition: integer("perplexity_position"),
  llmTestResults: jsonb("llm_test_results"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Reddit & Quora Engagement
export const socialEngagement = pgTable("social_engagement", {
  id: serial("id").primaryKey(),
  platform: varchar("platform", { length: 20 }).notNull(), // 'reddit' or 'quora'
  postUrl: text("post_url"),
  postTitle: text("post_title").notNull(),
  subredditOrTopic: varchar("subreddit_or_topic", { length: 200 }),
  engagementType: varchar("engagement_type", { length: 30 }).notNull(), // 'comment', 'post', 'answer'
  content: text("content"),
  upvotes: integer("upvotes").default(0),
  comments: integer("comments").default(0),
  views: integer("views").default(0),
  referralTraffic: integer("referral_traffic").default(0),
  status: varchar("status", { length: 20 }).default("active"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Landing Pages
export const landingPages = pgTable("landing_pages", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  url: text("url"),
  pageType: varchar("page_type", { length: 50 }).notNull(), // 'event', 'webinar', 'product', 'campaign'
  status: varchar("status", { length: 30 }).notNull().default("draft"),
  targetKeyword: varchar("target_keyword", { length: 300 }),
  monthlyTraffic: integer("monthly_traffic").default(0),
  conversions: integer("conversions").default(0),
  bounceRate: varchar("bounce_rate", { length: 10 }),
  deals: integer("deals").default(0),
  demos: integer("demos").default(0),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Listicles (Target listicles for AEO)
export const listicles = pgTable("listicles", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  url: text("url"),
  targetListicle: text("target_listicle"), // The listicle we want Spyne listed in
  status: varchar("status", { length: 30 }).notNull().default("identified"), // identified, outreached, listed, rejected
  spyneListed: boolean("spyne_listed").default(false),
  spynePosition: integer("spyne_position"),
  listicleOwner: varchar("listicle_owner", { length: 200 }),
  contactEmail: varchar("contact_email", { length: 200 }),
  outreachDate: timestamp("outreach_date"),
  monthlyTraffic: integer("monthly_traffic").default(0),
  domainAuthority: integer("domain_authority"),
  referralTraffic: integer("referral_traffic").default(0),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// AI Chat History
export const aiChatHistory = pgTable("ai_chat_history", {
  id: serial("id").primaryKey(),
  toolType: varchar("tool_type", { length: 50 }).notNull(),
  prompt: text("prompt").notNull(),
  response: text("response"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

// User Settings
export const userSettings = pgTable("user_settings", {
  id: serial("id").primaryKey(),
  settingKey: varchar("setting_key", { length: 100 }).notNull().unique(),
  settingValue: jsonb("setting_value"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Performance Snapshots (for dashboard trends)
export const performanceSnapshots = pgTable("performance_snapshots", {
  id: serial("id").primaryKey(),
  snapshotDate: timestamp("snapshot_date").defaultNow(),
  totalBlogs: integer("total_blogs").default(0),
  totalAeoBlogs: integer("total_aeo_blogs").default(0),
  totalLandingPages: integer("total_landing_pages").default(0),
  totalSocialPosts: integer("total_social_posts").default(0),
  totalTraffic: integer("total_traffic").default(0),
  totalDeals: integer("total_deals").default(0),
  totalDemos: integer("total_demos").default(0),
  avgRanking: integer("avg_ranking"),
  llmMentionRate: integer("llm_mention_rate"),
  createdAt: timestamp("created_at").defaultNow(),
});
