import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const items = await prisma.cartItem.findMany({
    where: { userId: session!.user!.id as string },
    include: { product: true },
  });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { productId, quantity = 1 } = await req.json();

  const existing = await prisma.cartItem.findUnique({
    where: { userId_productId: { userId: session!.user!.id as string, productId } },
  });

  if (existing) {
    const updated = await prisma.cartItem.update({
      where: { userId_productId: { userId: session.user.id, productId } },
      data: { quantity: existing.quantity + quantity },
      include: { product: true },
    });
    return NextResponse.json(updated);
  }

  const item = await prisma.cartItem.create({
    data: { userId: session!.user!.id as string, productId, quantity },
    include: { product: true },
  });
  return NextResponse.json(item, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { productId, quantity } = await req.json();

  if (quantity <= 0) {
    await prisma.cartItem.deleteMany({
      where: { userId: session.user.id, productId },
    });
    return NextResponse.json({ message: "Removed" });
  }

  const updated = await prisma.cartItem.update({
    where: { userId_productId: { userId: session!.user!.id as string, productId } },
    data: { quantity },
  });
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { productId } = await req.json();
  await prisma.cartItem.deleteMany({
    where: { userId: session!.user!.id as string, productId },
  });
  return NextResponse.json({ message: "Deleted" });
}
