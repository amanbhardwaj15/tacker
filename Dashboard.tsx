import { db } from "@/db";
import { listicles } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const results = await db.select().from(listicles).orderBy(desc(listicles.createdAt));
    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch listicles" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await db.insert(listicles).values({
      title: body.title,
      url: body.url || null,
      targetListicle: body.targetListicle || null,
      status: body.status || "identified",
      spyneListed: body.spyneListed || false,
      spynePosition: body.spynePosition || null,
      listicleOwner: body.listicleOwner || null,
      contactEmail: body.contactEmail || null,
      outreachDate: body.outreachDate ? new Date(body.outreachDate) : null,
      monthlyTraffic: body.monthlyTraffic || 0,
      domainAuthority: body.domainAuthority || null,
      referralTraffic: body.referralTraffic || 0,
      notes: body.notes || null,
    }).returning();
    return NextResponse.json(result[0]);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create listicle" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    if (data.outreachDate) data.outreachDate = new Date(data.outreachDate);
    const result = await db.update(listicles).set({ ...data, updatedAt: new Date() }).where(eq(listicles.id, id)).returning();
    return NextResponse.json(result[0]);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update listicle" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    await db.delete(listicles).where(eq(listicles.id, parseInt(id)));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete listicle" }, { status: 500 });
  }
}
