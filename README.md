# Spyne Content Tracker

A comprehensive content operations dashboard for tracking SEO blogs, AEO content, social engagement, listicles, landing pages, and AI-powered tools.

## Features

- 📊 **Dashboard** — Unified metrics with charts, graphs & performance alerts
- ✍️ **SEO Blogs** — Track new and revamped content with rankings
- 🤖 **AEO Blogs** — Monitor LLM mentions (ChatGPT, Gemini, Claude, Perplexity)
- 📋 **Listicles** — Track target listicles for AEO placement
- 💬 **Social Engagement** — Reddit & Quora tracking
- 🌐 **Landing Pages** — Events, webinars, campaigns
- 🔧 **AI Tools** — LLM tester, social finder, content writer, SEO analyzer, bulk import
- ⚙️ **Settings** — Themes, fonts, section visibility, country targeting

## Tech Stack

- Next.js 16 (App Router)
- PostgreSQL + Drizzle ORM
- Tailwind CSS
- Recharts

## Local Development

```bash
npm install
# create .env with DATABASE_URL
npx drizzle-kit push
npm run dev
```

## Environment Variables

```
DATABASE_URL=postgresql://user:password@host:5432/database
```

## Deployment

Deploy on Vercel (recommended for Next.js):
1. Push code to GitHub
2. Import repo at vercel.com
3. Add DATABASE_URL environment variable
4. Deploy

See DEPLOYMENT.md for full step-by-step instructions.
