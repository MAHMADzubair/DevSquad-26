import { NextResponse } from "next/server";
import jobs from "@/data/jobs.json";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const job = jobs.find((j) => j.id === parseInt(id));
  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }
  return NextResponse.json(job);
}
