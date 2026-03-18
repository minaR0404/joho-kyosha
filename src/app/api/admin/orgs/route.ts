import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth, isAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!isAdmin(session?.user?.role)) {
    return NextResponse.json({ error: "権限がありません" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") || "1");
  const search = searchParams.get("search") || "";
  const limit = 20;

  const where = search
    ? { name: { contains: search, mode: "insensitive" as const } }
    : {};

  const [orgs, total] = await Promise.all([
    prisma.organization.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        category: { select: { name: true } },
        _count: { select: { posts: { where: { deletedAt: null } } } },
      },
    }),
    prisma.organization.count({ where }),
  ]);

  return NextResponse.json({ orgs, total, page, limit });
}
