import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth, isAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!isAdmin(session?.user?.role)) {
    return NextResponse.json({ error: "権限がありません" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || "PENDING";
  const page = Number(searchParams.get("page") || "1");
  const limit = 20;

  const [reports, total] = await Promise.all([
    prisma.report.findMany({
      where: { status },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        reporter: { select: { id: true, displayName: true, email: true } },
      },
    }),
    prisma.report.count({ where: { status } }),
  ]);

  return NextResponse.json({ reports, total, page, limit });
}
