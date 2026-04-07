import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const orders = await prisma.order.findMany({
    where: { userId: session!.user!.id as string },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(orders);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { items, address, subtotal, shipping, total } = await req.json();

  const order = await prisma.$transaction(async (tx) => {
    const newOrder = await tx.order.create({
      data: {
        userId: session!.user!.id as string,
        items: JSON.stringify(items),
        address: JSON.stringify(address),
        subtotal,
        shipping,
        total,
      },
    });

    // Update stock for each product
    for (const item of items) {
      await tx.product.update({
        where: { id: item.productId as string },
        data: {
          stock: {
            decrement: item.quantity
          }
        },
      });
    }

    // Clear cart
    await tx.cartItem.deleteMany({ where: { userId: session!.user!.id as string } });

    return newOrder;
  });

  return NextResponse.json(order, { status: 201 });
}
