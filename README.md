# Spyne Content Tracker

A comprehensive content operations dashboard for tracking SEO blogs, AEO content, social engagement, and more.

## Features

- 📊 **Dashboard** - Unified metrics with charts and graphs
- ✍️ **SEO Blogs** - Track new and revamped content
- 🤖 **AEO Blogs** - Monitor LLM mentions (ChatGPT, Gemini, Claude, Perplexity)
- 📋 **Listicles** - Track target listicles for AEO placement
- 💬 **Social Engagement** - Reddit & Quora tracking
- 🌐 **Landing Pages** - Events, webinars, campaigns
- 🔧 **AI Tools** - LLM tester, content writer, SEO analyzer, bulk import

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Deployment**: Firebase Hosting

## Setup

### Prerequisites

- Node.js 20+
- PostgreSQL database (local or cloud like Neon/Supabase)

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/spyne-content-tracker.git
cd spyne-content-tracker

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your DATABASE_URL

# Push database schema
npx drizzle-kit push

# Run development server
npm run dev
```

### Environment Variables

Create a `.env` file:

```
DATABASE_URL=postgresql://user:password@host:5432/database
```

## Deployment

### Firebase Deployment

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Firebase Hosting
3. Set up GitHub secrets (see below)
4. Push to main branch

### GitHub Secrets Required

- `DATABASE_URL` - Your PostgreSQL connection string
- `FIREBASE_PROJECT_ID` - Your Firebase project ID
- `FIREBASE_SERVICE_ACCOUNT` - Firebase service account JSON

## License

MIT
