import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const items = await prisma.wishlistItem.findMany({
    where: { userId: session!.user!.id as string },
    include: { product: { include: { category: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { productId } = await req.json();

  const existing = await prisma.wishlistItem.findUnique({
    where: { userId_productId: { userId: session!.user!.id as string, productId } },
  });

  if (existing) {
    await prisma.wishlistItem.delete({
      where: { userId_productId: { userId: session.user.id, productId } },
    });
    return NextResponse.json({ action: "removed" });
  }

  await prisma.wishlistItem.create({
    data: { userId: session!.user!.id as string, productId },
  });
  return NextResponse.json({ action: "added" });
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { productId } = await req.json();
  await prisma.wishlistItem.deleteMany({
    where: { userId: session!.user!.id as string, productId },
  });
  return NextResponse.json({ message: "Deleted" });
}
