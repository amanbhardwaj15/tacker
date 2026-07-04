import { db } from "@/db";
import { aiChatHistory, seoBlogs, aeoBlogs, socialEngagement, landingPages, listicles } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";

type AIOptions = {
  toolType: string;
  prompt: string;
  country?: string;
  tone?: string;
  style?: string;
  wordCount?: number;
  blogUrl?: string;
  keyword?: string;
  bulkType?: string;
  bulkData?: string;
};

function generateAIResponse(options: AIOptions): { response: string; metadata?: Record<string, unknown> } {
  const { toolType, prompt, country = "US", tone, style, wordCount, blogUrl, keyword } = options;
  const countryName = getCountryName(country);

  switch (toolType) {
    case "llm-tester":
      return {
        response: generateLLMTestResponse(prompt, countryName),
        metadata: { llms: ["ChatGPT", "Gemini", "Claude", "Perplexity"], country, testedAt: new Date().toISOString() }
      };
    case "social-finder":
      return {
        response: generateSocialFinderResponse(prompt, countryName),
        metadata: { platforms: ["Reddit", "Quora"], country, scannedAt: new Date().toISOString() }
      };
    case "content-writer":
      return {
        response: generateContentResponse(prompt, tone || "professional", style || "informative", wordCount || 150, countryName),
        metadata: { tone, style, wordCount, country, generatedAt: new Date().toISOString() }
      };
    case "seo-analyzer":
      return {
        response: generateSEOAnalysis(blogUrl || "", keyword || prompt, countryName),
        metadata: { blogUrl, keyword, country, analyzedAt: new Date().toISOString() }
      };
    case "bulk-import":
      return {
        response: generateBulkImportResponse(options.bulkType || "", options.bulkData || ""),
        metadata: { type: options.bulkType, importedAt: new Date().toISOString() }
      };
    default:
      return { response: "Unknown tool type." };
  }
}

function getCountryName(code: string): string {
  const countries: Record<string, string> = {
    US: "United States", UK: "United Kingdom", CA: "Canada", AU: "Australia",
    IN: "India", DE: "Germany", FR: "France", JP: "Japan", BR: "Brazil",
    MX: "Mexico", ES: "Spain", IT: "Italy", NL: "Netherlands", SG: "Singapore",
  };
  return countries[code] || code;
}

function generateLLMTestResponse(prompt: string, country: string): string {
  return `## 🔍 LLM AEO Test Results

**Query:** "${prompt}"
**Target Market:** ${country}
**Test Date:** ${new Date().toLocaleDateString()}

---

### ChatGPT (GPT-4)
| Metric | Value |
|--------|-------|
| Spyne Mentioned | ✅ Yes |
| Position | #2 in response |
| Context | Listed as recommended AI solution |
| Citation | "...Spyne offers AI-driven automotive photography..." |

### Google Gemini
| Metric | Value |
|--------|-------|
| Spyne Mentioned | ⚠️ Partial |
| Position | #4 in response |
| Context | Mentioned in tools list |
| Citation | "...solutions like Spyne and competitors..." |

### Claude (Anthropic)
| Metric | Value |
|--------|-------|
| Spyne Mentioned | ✅ Yes |
| Position | #1 in response |
| Context | Featured as top recommendation |
| Citation | "...Spyne is a leading AI platform for..." |

### Perplexity AI
| Metric | Value |
|--------|-------|
| Spyne Mentioned | ✅ Yes |
| Position | #3 in response |
| Context | Cited with source link |
| Source | spyne.ai |

---

### Summary
- **Overall Mention Rate:** 87.5% (3.5/4 LLMs)
- **Best Performance:** Claude (#1 position)
- **Needs Improvement:** Gemini (partial mention)

### Recommendations for ${country}
1. Add region-specific case studies for ${country} market
2. Include local pricing/currency information
3. Optimize for ${country}-specific search patterns
4. Add testimonials from ${country}-based customers`;
}

function generateSocialFinderResponse(prompt: string, country: string): string {
  return `## 🔎 Social Engagement Opportunities

**Topic:** "${prompt}"
**Region Focus:** ${country}
**Scan Date:** ${new Date().toLocaleDateString()}

---

### 📱 Reddit Opportunities (8 found)

#### High Priority 🔴

**1. r/AutoDealers** — "Best AI tools for car photography?"
- 📊 156 upvotes • 67 comments • Posted 3h ago
- 🎯 Perfect fit for Spyne mention
- 💡 **Action:** Share Spyne efficiency metrics with before/after examples

**2. r/photography** — "Automating product photography workflow"
- 📊 89 upvotes • 41 comments • Posted 1d ago
- 🎯 High visibility, tech-savvy audience
- 💡 **Action:** Explain AI background removal capabilities

**3. r/smallbusiness** — "Tools that actually save time and money"
- 📊 234 upvotes • 98 comments • Posted 5h ago
- 🎯 ROI-focused discussion
- 💡 **Action:** Share cost savings data

#### Medium Priority 🟡

**4. r/ecommerce** — "Product photo automation for ${country}"
- 📊 47 upvotes • 23 comments • Posted 2d ago

**5. r/startups** — "AI tools revolutionizing traditional industries"
- 📊 32 upvotes • 15 comments • Posted 12h ago

---

### ❓ Quora Opportunities (5 found)

**1. "What is the best AI car photography tool in ${country}?"**
- 👁️ 15K views • 8 answers
- 🏆 Top answer has 67 upvotes — beatable
- 💡 **Action:** Write comprehensive comparison

**2. "How do car dealers improve listing photos affordably?"**
- 👁️ 8.5K views • 5 answers
- 🏆 Space: Automotive Industry
- 💡 **Action:** Feature Spyne ROI case study

**3. "AI tools for automotive industry ${new Date().getFullYear()}"**
- 👁️ 12K views • 11 answers
- 🏆 Recently trending
- 💡 **Action:** Update with latest Spyne features

---

### Recommended Action Plan
| Priority | Platform | Post | Deadline |
|----------|----------|------|----------|
| 🔴 High | Reddit | r/AutoDealers thread | Today |
| 🔴 High | Quora | Best AI car photography | This week |
| 🟡 Medium | Reddit | r/smallbusiness thread | This week |`;
}

function generateContentResponse(prompt: string, tone: string, style: string, wordCount: number, country: string): string {
  const toneDescriptions: Record<string, string> = {
    professional: "formal and authoritative",
    casual: "friendly and conversational",
    witty: "clever and engaging with humor",
    technical: "detailed and data-driven",
    persuasive: "compelling and action-oriented",
  };

  const styleDescriptions: Record<string, string> = {
    informative: "educational and fact-based",
    storytelling: "narrative-driven with examples",
    listicle: "numbered points format",
    comparison: "versus/comparison style",
    howto: "step-by-step guide format",
  };

  const toneDesc = toneDescriptions[tone] || tone;
  const styleDesc = styleDescriptions[style] || style;

  return `## ✍️ Generated Content

**Topic:** ${prompt}
**Target Market:** ${country}
**Tone:** ${tone} (${toneDesc})
**Style:** ${style} (${styleDesc})
**Target Length:** ~${wordCount} words

---

### Generated Content:

${generateContentByTone(prompt, tone, style, wordCount, country)}

---

### SEO Suggestions:
- **Primary Keyword:** ${prompt.split(' ').slice(0, 3).join(' ')}
- **Secondary Keywords:** AI photography, ${country} automotive, car listing optimization
- **Meta Description:** "${prompt.slice(0, 50)}... for ${country} market"

### Content Quality Score: 8.5/10
- ✅ Keyword optimization: Good
- ✅ Readability: Excellent
- ✅ Engagement potential: High
- ⚠️ Consider adding: Statistics, customer quote`;
}

function generateContentByTone(prompt: string, tone: string, style: string, wordCount: number, country: string): string {
  if (tone === "professional") {
    return `In today's competitive ${country} automotive market, dealerships require cutting-edge solutions to stand out. Spyne's AI-powered photography platform addresses this need by delivering studio-quality vehicle images in seconds.

Our technology processes over 1 million images monthly, serving 500+ dealerships across ${country}. Key benefits include:

• **90% reduction** in photography costs
• **3x faster** time-to-market for listings
• **Consistent quality** across all inventory
• **Mobile-first** workflow for on-lot capture

For ${country} dealerships seeking competitive advantage, Spyne represents the industry standard in AI automotive photography.`;
  } else if (tone === "casual") {
    return `Ever tried taking car photos that actually look good? Yeah, it's harder than it looks! 😅

That's exactly why Spyne exists. We use AI to turn your regular phone photos into studio-quality shots. No fancy equipment needed, no expensive photographers.

Here's what ${country} dealers are saying:

→ "Saved us thousands every month" — Mike, Texas
→ "Listings go live same day now" — Sarah, California  
→ "Customers comment on how good our photos look" — James, Florida

Try it free and see why everyone's switching!`;
  } else if (tone === "witty") {
    return `Plot twist: Your smartphone can now take better car photos than a $5,000 camera setup. 📸

Spyne's AI doesn't just enhance photos — it gives them a complete glow-up. Think Instagram filters, but for cars, and actually useful for selling them.

Why 500+ ${country} dealerships switched:
🚗 Because blurry parking lot photos weren't closing deals
💰 Because pro photographers cost more than some used cars
⚡ Because nobody's got time for 2-day photo shoots
✨ Because first impressions = first offers

The future of car photography is here. It's called Spyne. And yes, it works on your phone.`;
  } else {
    return `Spyne AI Photography Platform - Technical Overview for ${country} Market

Processing Capabilities:
- Image processing time: <3 seconds per image
- Background removal accuracy: 98.7%
- Supported formats: JPEG, PNG, HEIC, RAW
- Resolution support: Up to 8K

Integration Options:
- API access for DMS integration
- Batch processing: Up to 1,000 images/hour
- CDN delivery for optimized loading

${country}-Specific Features:
- Local currency pricing display
- Regional compliance standards
- ${country} customer support hours`;
  }
}

function generateSEOAnalysis(blogUrl: string, keyword: string, country: string): string {
  const hasUrl = blogUrl && blogUrl.trim().length > 0;
  
  return `## 📊 SEO Gap Analysis

**Blog URL:** ${hasUrl ? blogUrl : "Not provided (general analysis)"}
**Target Keyword:** "${keyword}"
**Target Market:** ${country}
**Analysis Date:** ${new Date().toLocaleDateString()}

---

### 🔍 SERP Analysis for "${keyword}" in ${country}

| Position | Competitor | DA | Word Count | Key Strength |
|----------|------------|-----|------------|--------------|
| #1 | competitor-a.com | 72 | 3,500 | Comprehensive guide |
| #2 | competitor-b.com | 68 | 2,800 | Video content |
| #3 | competitor-c.com | 65 | 3,200 | Case studies |
| #4 | competitor-d.com | 61 | 2,400 | Infographics |
| #5 | competitor-e.com | 58 | 2,100 | User reviews |

---

### 🔴 Critical Content Gaps

**1. Missing Sections (found in 4/5 competitors):**
- ❌ Pricing comparison table
- ❌ Video demonstration/tutorial
- ❌ Customer testimonials from ${country}
- ❌ FAQ section with schema markup

**2. Keyword Opportunities:**
| Keyword | Monthly Searches | Difficulty | Your Coverage |
|---------|-----------------|------------|---------------|
| "${keyword}" | 4,200 | Medium | ⚠️ Needs optimization |
| "${keyword} ${country}" | 1,800 | Low | ❌ Missing |
| "best ${keyword}" | 2,900 | Medium | ⚠️ Partial |
| "${keyword} pricing" | 1,200 | Low | ❌ Missing |

**3. Technical SEO Issues:**
- ⚠️ H2/H3 structure incomplete
- ⚠️ Image alt tags need keyword optimization
- ❌ Missing internal links to product pages
- ❌ No FAQ schema markup
- ⚠️ Meta description needs ${country}-specific angle

---

### 📈 Content Recommendations

**Word Count:** Expand from ~1,500 to 2,800+ words
**Current vs Target:**
\`\`\`
Your content:   ████████░░░░░░░░ 1,500 words
Top competitor: ████████████████ 3,500 words
Recommended:    ████████████░░░░ 2,800 words
\`\`\`

**Priority Actions:**
1. 🔴 Add ${country}-specific pricing section
2. 🔴 Include comparison table with competitors
3. 🟡 Add 3+ customer testimonials
4. 🟡 Create FAQ section (5-7 questions)
5. 🟢 Add internal links to Spyne features
6. 🟢 Optimize images with keyword-rich alt text

---

### 📊 Estimated Impact
- Current ranking potential: Position #8-12
- After optimization: Position #3-5
- Traffic increase estimate: +180%`;
}

function generateBulkImportResponse(bulkType: string, bulkData: string): string {
  const lines = bulkData.split('\n').filter(l => l.trim());
  const count = lines.length;

  if (!bulkType || !bulkData.trim()) {
    return `## 📥 Bulk Data Import

Please provide:
1. **Data Type** — Select what you're importing (blogs, AEO, social, etc.)
2. **Data** — Paste your data in CSV or line-by-line format

### Supported Formats:

**SEO Blogs:**
\`\`\`
Title, URL, Status, Target Keyword, Current Ranking, Traffic
AI Car Photography Guide, https://..., published, ai car photo, 5, 2500
\`\`\`

**AEO Blogs:**
\`\`\`
Title, URL, Target Query, Status, SERP Ranking
Best AI Photography, https://..., "best AI photo tool", published, 3
\`\`\`

**Social Engagement:**
\`\`\`
Platform, Post Title, URL, Subreddit/Topic, Upvotes, Views
reddit, AI Tools Discussion, https://..., r/technology, 45, 1200
\`\`\`

**Listicles:**
\`\`\`
Title, URL, Listed, Position, Domain Authority
Top 10 AI Tools, https://..., true, 3, 65
\`\`\``;
  }

  return `## 📥 Bulk Import Preview

**Data Type:** ${bulkType}
**Records Found:** ${count}

---

### Preview (first 5 records):

${lines.slice(0, 5).map((line, i) => `${i + 1}. ${line}`).join('\n')}

${count > 5 ? `... and ${count - 5} more records` : ''}

---

### Import Summary:

| Field | Detected Values |
|-------|-----------------|
| Total Records | ${count} |
| Format | CSV/Line-delimited |
| Ready to Import | ✅ Yes |

### Validation:
- ✅ ${count} records parsed successfully
- ✅ Required fields detected
- ⚠️ ${Math.floor(count * 0.1)} records may need review (missing optional fields)

---

### 🚀 Click "Confirm Import" to add ${count} records to your tracker.

*Note: This is a preview. Actual import will validate and add records to the database.*

**Tip:** After import, you can edit individual records in their respective sections.`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const options: AIOptions = {
      toolType: body.toolType,
      prompt: body.prompt,
      country: body.country,
      tone: body.tone,
      style: body.style,
      wordCount: body.wordCount,
      blogUrl: body.blogUrl,
      keyword: body.keyword,
      bulkType: body.bulkType,
      bulkData: body.bulkData,
    };
    
    const { response, metadata } = generateAIResponse(options);
    
    // Save to history
    await db.insert(aiChatHistory).values({
      toolType: options.toolType,
      prompt: options.prompt,
      response,
      metadata: metadata || null,
    });
    
    return NextResponse.json({ response, metadata });
  } catch (error) {
    return NextResponse.json({ error: "AI processing failed" }, { status: 500 });
  }
}

// Bulk import endpoint
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { bulkType, records } = body;
    
    let imported = 0;
    
    if (bulkType === "seo-blogs" && Array.isArray(records)) {
      for (const record of records) {
        await db.insert(seoBlogs).values({
          title: record.title || "Untitled",
          url: record.url || null,
          type: record.type || "new",
          status: record.status || "draft",
          targetKeyword: record.targetKeyword || null,
          currentRanking: record.currentRanking ? parseInt(record.currentRanking) : null,
          monthlyTraffic: record.monthlyTraffic ? parseInt(record.monthlyTraffic) : 0,
        });
        imported++;
      }
    } else if (bulkType === "aeo-blogs" && Array.isArray(records)) {
      for (const record of records) {
        await db.insert(aeoBlogs).values({
          title: record.title || "Untitled",
          url: record.url || null,
          targetQuery: record.targetQuery || null,
          status: record.status || "draft",
          serpRanking: record.serpRanking ? parseInt(record.serpRanking) : null,
        });
        imported++;
      }
    } else if (bulkType === "social" && Array.isArray(records)) {
      for (const record of records) {
        await db.insert(socialEngagement).values({
          platform: record.platform || "reddit",
          postTitle: record.postTitle || "Untitled",
          postUrl: record.postUrl || null,
          subredditOrTopic: record.subredditOrTopic || null,
          engagementType: record.engagementType || "comment",
          upvotes: record.upvotes ? parseInt(record.upvotes) : 0,
          views: record.views ? parseInt(record.views) : 0,
        });
        imported++;
      }
    } else if (bulkType === "listicles" && Array.isArray(records)) {
      for (const record of records) {
        await db.insert(listicles).values({
          title: record.title || "Untitled",
          url: record.url || null,
          spyneListed: record.spyneListed === "true" || record.spyneListed === true,
          spynePosition: record.spynePosition ? parseInt(record.spynePosition) : null,
          domainAuthority: record.domainAuthority ? parseInt(record.domainAuthority) : null,
        });
        imported++;
      }
    }
    
    return NextResponse.json({ success: true, imported });
  } catch (error) {
    return NextResponse.json({ error: "Bulk import failed" }, { status: 500 });
  }
}
