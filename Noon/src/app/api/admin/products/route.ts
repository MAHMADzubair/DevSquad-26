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

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 20;

  const where = search
    ? { OR: [{ name: { contains: search } }, { brand: { contains: search } }] }
    : {};

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.count({ where }),
  ]);

  return NextResponse.json({ products, total, totalPages: Math.ceil(total / limit) });
}

export async function POST(req: NextRequest) {
  const session = await checkAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();
  const slug = data.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") + "-" + Date.now();

  const product = await prisma.product.create({
    data: {
      ...data,
      slug,
      images: JSON.stringify(data.images || []),
    },
  });
  return NextResponse.json(product, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const session = await checkAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, ...data } = await req.json();
  const product = await prisma.product.update({
    where: { id },
    data: {
      ...data,
      images: typeof data.images === "string" ? data.images : JSON.stringify(data.images),
    },
  });
  return NextResponse.json(product);
}

export async function DELETE(req: NextRequest) {
  const session = await checkAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ message: "Deleted" });
}
