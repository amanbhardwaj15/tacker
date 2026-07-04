import { db } from "@/db";
import { aeoBlogs } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const results = await db.select().from(aeoBlogs).orderBy(desc(aeoBlogs.createdAt));
    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch AEO blogs" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await db.insert(aeoBlogs).values({
      title: body.title,
      url: body.url || null,
      targetQuery: body.targetQuery || null,
      status: body.status || "draft",
      serpRanking: body.serpRanking || null,
      monthlyTraffic: body.monthlyTraffic || 0,
      impressions: body.impressions || 0,
      clicks: body.clicks || 0,
      chatgptMentioned: body.chatgptMentioned || false,
      geminiMentioned: body.geminiMentioned || false,
      claudeMentioned: body.claudeMentioned || false,
      perplexityMentioned: body.perplexityMentioned || false,
      chatgptPosition: body.chatgptPosition || null,
      geminiPosition: body.geminiPosition || null,
      claudePosition: body.claudePosition || null,
      perplexityPosition: body.perplexityPosition || null,
      llmTestResults: body.llmTestResults || null,
      notes: body.notes || null,
    }).returning();
    return NextResponse.json(result[0]);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create AEO blog" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    const result = await db.update(aeoBlogs).set({ ...data, updatedAt: new Date() }).where(eq(aeoBlogs.id, id)).returning();
    return NextResponse.json(result[0]);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update AEO blog" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    await db.delete(aeoBlogs).where(eq(aeoBlogs.id, parseInt(id)));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete AEO blog" }, { status: 500 });
  }
}
