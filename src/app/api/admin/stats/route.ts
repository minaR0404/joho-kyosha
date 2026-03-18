import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth, isAdmin } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!isAdmin(session?.user?.role)) {
    return NextResponse.json({ error: "権限がありません" }, { status: 403 });
  }

  const [userCount, postCount, orgCount, pendingReportCount] =
    await Promise.all([
      prisma.user.count(),
      prisma.post.count({ where: { deletedAt: null } }),
      prisma.organization.count(),
      prisma.report.count({ where: { status: "PENDING" } }),
    ]);

  return NextResponse.json({
    userCount,
    postCount,
    orgCount,
    pendingReportCount,
  });
}
