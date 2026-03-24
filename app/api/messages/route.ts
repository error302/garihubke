import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const messages = await db.message.findMany({
      where: {
        OR: [
          { senderId: session.user.id },
        ]
      },
      orderBy: { createdAt: "desc" },
    });
    
    return NextResponse.json(messages);
  } catch (error) {
    console.error("Get messages error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { vehicleId, senderName, senderEmail, senderPhone, content } = body;
    
    if (!vehicleId || !senderName || !senderEmail || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    
    const session = await auth();
    const senderId = session?.user?.id || null;
    
    const message = await db.message.create({
      data: {
        vehicleId,
        senderId,
        senderName,
        senderEmail,
        senderPhone: senderPhone || "",
        content,
      },
    });
    
    return NextResponse.json(message);
  } catch (error) {
    console.error("Send message error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
