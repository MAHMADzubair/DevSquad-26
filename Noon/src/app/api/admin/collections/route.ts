import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

async function checkAdmin() {
  const session = await auth();
  if (!session?.user?.id || (session.user as any).role !== "ADMIN") return null;
  return session;
}

export async function GET(req: NextRequest) {
  const session = await checkAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const collections = await prisma.collection.findMany({
    include: { products: { select: { id: true, name: true } } },
    orderBy: { order: "asc" }
  });
  return NextResponse.json(collections);
}

export async function POST(req: NextRequest) {
  const session = await checkAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();
  const slug = data.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") + "-" + Date.now();

  const collection = await prisma.collection.create({
    data: {
      title: data.title,
      description: data.description || null,
      slug,
      imageUrl: data.imageUrl || null,
      showOnHome: data.showOnHome !== undefined ? data.showOnHome : true,
      order: data.order || 0,
      products: data.productIds ? {
        connect: data.productIds.map((id: string) => ({ id }))
      } : undefined
    },
  });
  return NextResponse.json(collection, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const session = await checkAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, ...data } = await req.json();
  
  // First disconnect all products to re-sync
  await prisma.collection.update({
    where: { id },
    data: { products: { set: [] } }
  });

  const collection = await prisma.collection.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description || null,
      imageUrl: data.imageUrl || null,
      showOnHome: data.showOnHome !== undefined ? data.showOnHome : true,
      order: data.order || 0,
      products: data.productIds ? {
        connect: data.productIds.map((pid: string) => ({ id: pid }))
      } : undefined
    },
  });
  return NextResponse.json(collection);
}

export async function DELETE(req: NextRequest) {
  const session = await checkAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  await prisma.collection.delete({ where: { id } });
  return NextResponse.json({ message: "Deleted" });
}
