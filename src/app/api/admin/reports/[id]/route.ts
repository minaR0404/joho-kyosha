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
  const { action } = await req.json();

  if (!["RESOLVED", "DISMISSED"].includes(action)) {
    return NextResponse.json({ error: "無効なアクションです" }, { status: 400 });
  }

  const report = await prisma.report.update({
    where: { id: Number(id) },
    data: {
      status: action,
      resolvedBy: Number(session!.user!.id),
      resolvedAt: new Date(),
    },
  });

  return NextResponse.json(report);
}
