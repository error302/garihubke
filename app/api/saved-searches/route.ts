import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const savedSearches = await db.savedSearch.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });
    
    return NextResponse.json(savedSearches);
  } catch (error) {
    console.error("Get saved searches error:", error);
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
    const { name, filters } = body;
    
    if (!name || !filters) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    
    const savedSearch = await db.savedSearch.create({
      data: {
        userId: session.user.id,
        name,
        filters: JSON.stringify(filters),
      },
    });
    
    return NextResponse.json(savedSearch);
  } catch (error) {
    console.error("Save search error:", error);
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
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json({ error: "Search ID required" }, { status: 400 });
    }
    
    await db.savedSearch.delete({
      where: { id, userId: session.user.id },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete saved search error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
