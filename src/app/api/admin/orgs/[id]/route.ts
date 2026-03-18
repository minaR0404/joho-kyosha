import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth, isAdmin } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!isAdmin(session?.user?.role)) {
    return NextResponse.json({ error: "権限がありません" }, { status: 403 });
  }

  const { id } = await params;
  const { approvalStatus } = await req.json();

  if (!["APPROVED", "REJECTED"].includes(approvalStatus)) {
    return NextResponse.json({ error: "無効なステータスです" }, { status: 400 });
  }

  const org = await prisma.organization.update({
    where: { id: Number(id) },
    data: { approvalStatus },
  });

  return NextResponse.json(org);
}
