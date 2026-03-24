import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const favorites = await db.favorite.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });
    
    return NextResponse.json(favorites);
  } catch (error) {
    console.error("Get favorites error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const body = await req.json();
    const { vehicleId } = body;
    
    if (!vehicleId) {
      return NextResponse.json({ error: "Vehicle ID required" }, { status: 400 });
    }
    
    const existing = await db.favorite.findUnique({
      where: {
        userId_vehicleId: {
          userId: session.user.id,
          vehicleId,
        },
      },
    });
    
    if (existing) {
      return NextResponse.json({ message: "Already favorited" });
    }
    
    await db.favorite.create({
      data: {
        userId: session.user.id,
        vehicleId,
      },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Add favorite error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { searchParams } = new URL(req.url);
    const vehicleId = searchParams.get("vehicleId");
    
    if (!vehicleId) {
      return NextResponse.json({ error: "Vehicle ID required" }, { status: 400 });
    }
    
    await db.favorite.delete({
      where: {
        userId_vehicleId: {
          userId: session.user.id,
          vehicleId,
        },
      },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Remove favorite error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
