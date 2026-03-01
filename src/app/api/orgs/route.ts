import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { toSlug } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  if (searchParams.get("categoriesOnly")) {
    const categories = await prisma.category.findMany({ orderBy: { id: "asc" } });
    return NextResponse.json({ categories });
  }

  const q = searchParams.get("q") || "";
  const orgs = await prisma.organization.findMany({
    where: {
      status: { not: "DELETED" },
      ...(q ? { OR: [{ name: { contains: q } }, { description: { contains: q } }] } : {}),
    },
    orderBy: { reviewCount: "desc" },
    take: 50,
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
      },
    });

    return NextResponse.json({ success: true, slug: org.slug });
  } catch {
    return NextResponse.json({ error: "登録に失敗しました" }, { status: 500 });
  }
}
