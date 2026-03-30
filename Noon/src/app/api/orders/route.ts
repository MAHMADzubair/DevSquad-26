import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(orders);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { items, address, subtotal, shipping, total } = await req.json();

  const order = await prisma.order.create({
    data: {
      userId: session.user.id,
      items: JSON.stringify(items),
      address: JSON.stringify(address),
      subtotal,
      shipping,
      total,
    },
  });

  // Clear cart after order
  await prisma.cartItem.deleteMany({ where: { userId: session.user.id } });

  return NextResponse.json(order, { status: 201 });
}
