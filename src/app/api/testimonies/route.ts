import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const categorySlug = searchParams.get("category");
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const take = 20;
  const skip = (page - 1) * take;

  const where = {
    deletedAt: null,
    status: "PUBLISHED",
    ...(categorySlug ? { category: { slug: categorySlug } } : {}),
  };

  const [testimonies, total] = await Promise.all([
    prisma.testimony.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take,
      skip,
      include: {
        user: { select: { id: true, displayName: true } },
        category: { select: { slug: true, name: true } },
        tags: { include: { tag: true } },
        org: { select: { name: true, slug: true } },
      },
    }),
    prisma.testimony.count({ where }),
  ]);

  return NextResponse.json({ testimonies, total, page, totalPages: Math.ceil(total / take) });
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "ログインが必要です" }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: Number(session.user.id) },
      select: { emailVerifiedAt: true },
    });
    if (!currentUser?.emailVerifiedAt) {
      return NextResponse.json(
        { error: "メールアドレスの確認が必要です" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      categoryId,
      title,
      body: testimonyBody,
      scamType,
      damageAmount,
      period,
      isAnonymous,
      tagIds,
      orgId,
    } = body;

    if (!categoryId || !title || !testimonyBody) {
      return NextResponse.json(
        { error: "カテゴリ、タイトル、本文は必須です" },
        { status: 400 }
      );
    }

    if (title.length > 100) {
      return NextResponse.json({ error: "タイトルは100文字以内で入力してください" }, { status: 400 });
    }

    if (testimonyBody.length > 2000) {
      return NextResponse.json({ error: "本文は2000文字以内で入力してください" }, { status: 400 });
    }

    if (period && period.length > 20) {
      return NextResponse.json({ error: "時期は20文字以内で入力してください" }, { status: 400 });
    }

    // Validate orgId if provided
    let validOrgId: number | null = null;
    if (orgId) {
      const org = await prisma.organization.findUnique({ where: { id: Number(orgId) } });
      if (!org) {
        return NextResponse.json({ error: "指定された組織が見つかりません" }, { status: 400 });
      }
      validOrgId = org.id;
    }

    const testimony = await prisma.testimony.create({
      data: {
        userId: Number(session.user.id),
        categoryId: Number(categoryId),
        orgId: validOrgId,
        title,
        body: testimonyBody,
        scamType: scamType || null,
        damageAmount: damageAmount || null,
        period: period || null,
        isAnonymous: isAnonymous ?? true,
        tags: Array.isArray(tagIds) && tagIds.length > 0
          ? { create: tagIds.map((tagId: number) => ({ tagId })) }
          : undefined,
      },
    });

    return NextResponse.json({ success: true, testimonyId: testimony.id });
  } catch {
    return NextResponse.json({ error: "体験談の投稿に失敗しました" }, { status: 500 });
  }
}
