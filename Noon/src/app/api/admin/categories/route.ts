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

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" }
  });
  return NextResponse.json(categories);
}

export async function POST(req: NextRequest) {
  const session = await checkAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();
  const slug = data.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") + "-" + Date.now();

  const category = await prisma.category.create({
    data: {
      name: data.name,
      slug,
      icon: data.icon || null,
      color: data.color || null,
      parentId: data.parentId || null,
    },
  });
  return NextResponse.json(category, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const session = await checkAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, ...data } = await req.json();
  const category = await prisma.category.update({
    where: { id },
    data: {
      name: data.name,
      icon: data.icon || null,
      color: data.color || null,
      parentId: data.parentId || null,
    },
  });
  return NextResponse.json(category);
}

export async function DELETE(req: NextRequest) {
  const session = await checkAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  await prisma.category.delete({ where: { id } });
  return NextResponse.json({ message: "Deleted" });
}
