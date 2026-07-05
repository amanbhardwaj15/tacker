import { db } from "@/db";
import { landingPages } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const results = await db.select().from(landingPages).orderBy(desc(landingPages.createdAt));
    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch landing pages" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await db.insert(landingPages).values({
      title: body.title,
      url: body.url || null,
      pageType: body.pageType,
      status: body.status || "draft",
      targetKeyword: body.targetKeyword || null,
      monthlyTraffic: body.monthlyTraffic || 0,
      conversions: body.conversions || 0,
      bounceRate: body.bounceRate || null,
      deals: body.deals || 0,
      demos: body.demos || 0,
      notes: body.notes || null,
    }).returning();
    return NextResponse.json(result[0]);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create landing page" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    const result = await db.update(landingPages).set({ ...data, updatedAt: new Date() }).where(eq(landingPages.id, id)).returning();
    return NextResponse.json(result[0]);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update landing page" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    await db.delete(landingPages).where(eq(landingPages.id, parseInt(id)));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete landing page" }, { status: 500 });
  }
}
