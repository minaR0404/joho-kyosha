import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth, isAdmin } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!isAdmin(session?.user?.role)) {
    return NextResponse.json({ error: "権限がありません" }, { status: 403 });
  }

  const { id } = await params;
  const org = await prisma.organization.findUnique({
    where: { id: Number(id) },
    include: { category: { select: { name: true } } },
  });

  if (!org) {
    return NextResponse.json({ error: "組織が見つかりません" }, { status: 404 });
  }

  return NextResponse.json(org);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!isAdmin(session?.user?.role)) {
    return NextResponse.json({ error: "権限がありません" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();

  const allowedFields = [
    "name", "nameKana", "aliases", "categoryId", "description",
    "website", "representative", "founded", "address", "approvalStatus",
  ];

  const data: Record<string, unknown> = {};
  for (const field of allowedFields) {
    if (field in body) {
      if (field === "categoryId") {
        data[field] = Number(body[field]);
      } else if (field === "approvalStatus") {
        if (!["APPROVED", "REJECTED"].includes(body[field])) continue;
        data[field] = body[field];
      } else {
        data[field] = body[field] || null;
      }
    }
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "更新するフィールドがありません" }, { status: 400 });
  }

  const org = await prisma.organization.update({
    where: { id: Number(id) },
    data,
  });

  return NextResponse.json(org);
}
