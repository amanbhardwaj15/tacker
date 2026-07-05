import { db } from "@/db";
import { socialEngagement } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const platform = req.nextUrl.searchParams.get("platform");
  try {
    const results = await db.select().from(socialEngagement).orderBy(desc(socialEngagement.createdAt));
    const filtered = platform ? results.filter(r => r.platform === platform) : results;
    return NextResponse.json(filtered);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch social engagement" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await db.insert(socialEngagement).values({
      platform: body.platform,
      postUrl: body.postUrl || null,
      postTitle: body.postTitle,
      subredditOrTopic: body.subredditOrTopic || null,
      engagementType: body.engagementType,
      content: body.content || null,
      upvotes: body.upvotes || 0,
      comments: body.comments || 0,
      views: body.views || 0,
      referralTraffic: body.referralTraffic || 0,
      status: body.status || "active",
      notes: body.notes || null,
    }).returning();
    return NextResponse.json(result[0]);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create engagement" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    const result = await db.update(socialEngagement).set({ ...data, updatedAt: new Date() }).where(eq(socialEngagement.id, id)).returning();
    return NextResponse.json(result[0]);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update engagement" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    await db.delete(socialEngagement).where(eq(socialEngagement.id, parseInt(id)));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete engagement" }, { status: 500 });
  }
}
