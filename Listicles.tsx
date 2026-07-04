import { db } from "@/db";
import { seoBlogs } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get("type");
  try {
    let query = db.select().from(seoBlogs).orderBy(desc(seoBlogs.createdAt));
    const results = await query;
    const filtered = type ? results.filter(r => r.type === type) : results;
    return NextResponse.json(filtered);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await db.insert(seoBlogs).values({
      title: body.title,
      url: body.url || null,
      type: body.type || "new",
      status: body.status || "draft",
      targetKeyword: body.targetKeyword || null,
      secondaryKeywords: body.secondaryKeywords || null,
      currentRanking: body.currentRanking || null,
      previousRanking: body.previousRanking || null,
      monthlyTraffic: body.monthlyTraffic || 0,
      impressions: body.impressions || 0,
      clicks: body.clicks || 0,
      ctr: body.ctr || null,
      deals: body.deals || 0,
      demos: body.demos || 0,
      notes: body.notes || null,
    }).returning();
    return NextResponse.json(result[0]);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create blog" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    const result = await db.update(seoBlogs).set({ ...data, updatedAt: new Date() }).where(eq(seoBlogs.id, id)).returning();
    return NextResponse.json(result[0]);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update blog" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    await db.delete(seoBlogs).where(eq(seoBlogs.id, parseInt(id)));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete blog" }, { status: 500 });
  }
}
