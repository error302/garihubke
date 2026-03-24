import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const body = await req.json();
    const { vehicleIds } = body;
    
    if (!Array.isArray(vehicleIds)) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
    
    const existingFavorites = await db.favorite.findMany({
      where: { userId: session.user.id },
      select: { vehicleId: true },
    });
    
    const existingIds = new Set(existingFavorites.map((f) => f.vehicleId));
    
    const newFavorites = vehicleIds
      .filter((id) => !existingIds.has(id))
      .map((vehicleId) => ({
        userId: session.user.id,
        vehicleId,
      }));
    
    if (newFavorites.length > 0) {
      await db.favorite.createMany({
        data: newFavorites,
      });
    }
    
    return NextResponse.json({ success: true, count: newFavorites.length });
  } catch (error) {
    console.error("Sync favorites error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
