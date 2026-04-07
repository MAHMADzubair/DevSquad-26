import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import bcrypt from "bcryptjs";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: session!.user!.id as string },
    select: { id: true, name: true, email: true, avatar: true, role: true, createdAt: true },
  });

  return NextResponse.json(user);
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, currentPassword, newPassword, avatar } = await req.json();

  const updateData: any = {};
  if (name) updateData.name = name;
  if (avatar) updateData.avatar = avatar;

  if (newPassword) {
    const user = await prisma.user.findUnique({ where: { id: session!.user!.id as string } });
    if (!user?.password) return NextResponse.json({ error: "No password set" }, { status: 400 });
    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
    updateData.password = await bcrypt.hash(newPassword, 12);
  }

  const updated = await prisma.user.update({
    where: { id: session!.user!.id as string },
    data: updateData,
    select: { id: true, name: true, email: true, avatar: true },
  });

  return NextResponse.json(updated);
}
