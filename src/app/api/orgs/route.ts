import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { toSlug } from "@/lib/utils";
import { postRateLimit, checkRateLimit } from "@/lib/ratelimit";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  if (searchParams.get("categoriesOnly")) {
    const categories = await prisma.category.findMany({ orderBy: { sortOrder: "asc" } });
    return NextResponse.json({ categories });
  }

  const q = searchParams.get("q") || "";
  const catId = searchParams.get("categoryId");
  const orgs = await prisma.organization.findMany({
    where: {
      status: { not: "DELETED" },
      approvalStatus: "APPROVED",
      ...(catId ? { categoryId: Number(catId) } : {}),
      ...(q ? { OR: [{ name: { contains: q } }, { description: { contains: q } }] } : {}),
    },
    orderBy: { postCount: "desc" },
    take: catId && !q ? 5 : 50,
    include: { category: { select: { name: true, slug: true } } },
  });

  return NextResponse.json({ orgs });
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "ログインが必要です" }, { status: 401 });
    }

    const { success, headers } = await checkRateLimit(postRateLimit, session.user.id);
    if (!success) {
      return NextResponse.json(
        { error: "リクエストが多すぎます。しばらくお待ちください" },
        { status: 429, headers }
      );
    }

    const { name, categoryId, description, website, representative, founded } =
      await req.json();

    if (!name || !categoryId) {
      return NextResponse.json(
        { error: "組織名とカテゴリは必須です" },
        { status: 400 }
      );
    }

    const existingByName = await prisma.organization.findFirst({ where: { name } });
    if (existingByName) {
      return NextResponse.json(
        { error: "この組織名はすでに登録されています" },
        { status: 409 }
      );
    }

    let slug = toSlug(name);
    const existingBySlug = await prisma.organization.findUnique({ where: { slug } });
    if (existingBySlug) {
      slug = `${slug}-${Date.now()}`;
    }

    const org = await prisma.organization.create({
      data: {
        slug,
        name,
        categoryId: Number(categoryId),
        description: description || null,
        website: website || null,
        representative: representative || null,
        founded: founded || null,
        submittedById: Number(session.user.id),
        approvalStatus: "APPROVED",
      },
    });

    return NextResponse.json({ success: true, slug: org.slug });
  } catch {
    return NextResponse.json({ error: "登録に失敗しました" }, { status: 500 });
  }
}
