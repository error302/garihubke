import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { changePasswordSchema } from "@/lib/validation";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const body = await req.json();
    const validatedFields = changePasswordSchema.safeParse(body);
    
    if (!validatedFields.success) {
      return NextResponse.json(
        { error: validatedFields.error.errors[0].message },
        { status: 400 }
      );
    }
    
    const { currentPassword, newPassword } = validatedFields.data;
    
    const user = await db.user.findUnique({
      where: { id: session.user.id },
    });
    
    if (!user || !user.password) {
      return NextResponse.json(
        { error: "Invalid request" },
        { status: 400 }
      );
    }
    
    const passwordsMatch = await bcrypt.compare(currentPassword, user.password);
    
    if (!passwordsMatch) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 }
      );
    }
    
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);
    
    await db.user.update({
      where: { id: session.user.id },
      data: { password: hashedNewPassword },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
