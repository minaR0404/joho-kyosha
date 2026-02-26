import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const org = await prisma.organization.findUnique({
    where: { id: Number(id) },
    include: {
      category: true,
      tags: { include: { tag: true } },
    },
  });

  if (!org) {
    return NextResponse.json({ error: "見つかりません" }, { status: 404 });
  }

  return NextResponse.json(org);
}
