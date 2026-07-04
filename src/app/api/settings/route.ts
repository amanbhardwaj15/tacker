import { db } from "@/db";
import { userSettings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

const defaultSettings = {
  theme: "midnight",
  fontStyle: "sans",
  visibleSections: {
    dashboard: true,
    seoNew: true,
    seoRevamped: true,
    aeoBlogs: true,
    listicles: true,
    social: true,
    landingPages: true,
    aiLlmTester: true,
    aiSocialFinder: true,
    aiContentWriter: true,
    aiSeoAnalyzer: true,
    aiBulkImport: true,
  },
  defaultCountry: "US",
  compactMode: false,
  showAnimations: true,
};

export async function GET() {
  try {
    const results = await db.select().from(userSettings);
    const settings: Record<string, unknown> = { ...defaultSettings };
    
    results.forEach(row => {
      settings[row.settingKey] = row.settingValue;
    });
    
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json(defaultSettings);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { key, value } = body;
    
    // Upsert the setting
    const existing = await db.select().from(userSettings).where(eq(userSettings.settingKey, key));
    
    if (existing.length > 0) {
      await db.update(userSettings)
        .set({ settingValue: value, updatedAt: new Date() })
        .where(eq(userSettings.settingKey, key));
    } else {
      await db.insert(userSettings).values({
        settingKey: key,
        settingValue: value,
      });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save setting" }, { status: 500 });
  }
}
