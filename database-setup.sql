-- ============================================================
-- SPYNE CONTENT TRACKER — Database Setup
-- Copy ALL of this and run it in Neon's SQL Editor (one time)
-- ============================================================

-- SEO Blogs (new + revamped)
CREATE TABLE IF NOT EXISTS seo_blogs (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  url TEXT,
  type VARCHAR(20) NOT NULL DEFAULT 'new',
  status VARCHAR(30) NOT NULL DEFAULT 'draft',
  target_keyword VARCHAR(300),
  secondary_keywords TEXT,
  current_ranking INTEGER,
  previous_ranking INTEGER,
  monthly_traffic INTEGER DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  ctr VARCHAR(10),
  deals INTEGER DEFAULT 0,
  demos INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- AEO Blogs
CREATE TABLE IF NOT EXISTS aeo_blogs (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  url TEXT,
  target_query TEXT,
  status VARCHAR(30) NOT NULL DEFAULT 'draft',
  serp_ranking INTEGER,
  monthly_traffic INTEGER DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  chatgpt_mentioned BOOLEAN DEFAULT FALSE,
  gemini_mentioned BOOLEAN DEFAULT FALSE,
  claude_mentioned BOOLEAN DEFAULT FALSE,
  perplexity_mentioned BOOLEAN DEFAULT FALSE,
  chatgpt_position INTEGER,
  gemini_position INTEGER,
  claude_position INTEGER,
  perplexity_position INTEGER,
  llm_test_results JSONB,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Reddit & Quora Engagement
CREATE TABLE IF NOT EXISTS social_engagement (
  id SERIAL PRIMARY KEY,
  platform VARCHAR(20) NOT NULL,
  post_url TEXT,
  post_title TEXT NOT NULL,
  subreddit_or_topic VARCHAR(200),
  engagement_type VARCHAR(30) NOT NULL,
  content TEXT,
  upvotes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  referral_traffic INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'active',
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Landing Pages
CREATE TABLE IF NOT EXISTS landing_pages (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  url TEXT,
  page_type VARCHAR(50) NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'draft',
  target_keyword VARCHAR(300),
  monthly_traffic INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  bounce_rate VARCHAR(10),
  deals INTEGER DEFAULT 0,
  demos INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Listicles
CREATE TABLE IF NOT EXISTS listicles (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  url TEXT,
  target_listicle TEXT,
  status VARCHAR(30) NOT NULL DEFAULT 'identified',
  spyne_listed BOOLEAN DEFAULT FALSE,
  spyne_position INTEGER,
  listicle_owner VARCHAR(200),
  contact_email VARCHAR(200),
  outreach_date TIMESTAMP,
  monthly_traffic INTEGER DEFAULT 0,
  domain_authority INTEGER,
  referral_traffic INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- AI Chat History
CREATE TABLE IF NOT EXISTS ai_chat_history (
  id SERIAL PRIMARY KEY,
  tool_type VARCHAR(50) NOT NULL,
  prompt TEXT NOT NULL,
  response TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- User Settings
CREATE TABLE IF NOT EXISTS user_settings (
  id SERIAL PRIMARY KEY,
  setting_key VARCHAR(100) NOT NULL UNIQUE,
  setting_value JSONB,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Performance Snapshots
CREATE TABLE IF NOT EXISTS performance_snapshots (
  id SERIAL PRIMARY KEY,
  snapshot_date TIMESTAMP DEFAULT NOW(),
  total_blogs INTEGER DEFAULT 0,
  total_aeo_blogs INTEGER DEFAULT 0,
  total_landing_pages INTEGER DEFAULT 0,
  total_social_posts INTEGER DEFAULT 0,
  total_traffic INTEGER DEFAULT 0,
  total_deals INTEGER DEFAULT 0,
  total_demos INTEGER DEFAULT 0,
  avg_ranking INTEGER,
  llm_mention_rate INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- Done! All tables created. Your app is ready to use.
-- ============================================================
