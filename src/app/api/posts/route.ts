import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { postRateLimit, checkRateLimit } from "@/lib/ratelimit";

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

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
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
    prisma.post.count({ where }),
  ]);

  return NextResponse.json({ posts, total, page, totalPages: Math.ceil(total / take) });
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
        { error: "投稿の頻度が高すぎます。しばらくお待ちください" },
        { status: 429, headers }
      );
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
      body: postBody,
      scamType,
      damageAmount,
      period,
      relationship,
      isAnonymous,
      tagIds,
      newTags,
      orgId,
    } = body;

    if (!categoryId || !title || !postBody) {
      return NextResponse.json(
        { error: "カテゴリ、タイトル、本文は必須です" },
        { status: 400 }
      );
    }

    if (title.length > 100) {
      return NextResponse.json({ error: "タイトルは100文字以内で入力してください" }, { status: 400 });
    }

    if (postBody.length > 2000) {
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

    // Resolve tag IDs: existing tagIds + upsert newTags
    const allTagIds: number[] = [];
    if (Array.isArray(tagIds)) {
      allTagIds.push(...tagIds.map(Number).filter((n) => !isNaN(n)));
    }
    if (Array.isArray(newTags)) {
      const validNewTags = newTags
        .map((t: string) => t.trim())
        .filter((t: string) => t.length > 0 && t.length <= 20)
        .slice(0, 10);
      for (const name of validNewTags) {
        const tag = await prisma.tag.upsert({
          where: { name },
          update: {},
          create: { name },
        });
        allTagIds.push(tag.id);
      }
    }
    const uniqueTagIds = [...new Set(allTagIds)].slice(0, 10);

    const post = await prisma.post.create({
      data: {
        userId: Number(session.user.id),
        categoryId: Number(categoryId),
        orgId: validOrgId,
        title,
        body: postBody,
        scamType: scamType || null,
        damageAmount: damageAmount || null,
        period: period || null,
        relationship: relationship || null,
        isAnonymous: isAnonymous ?? true,
        tags: uniqueTagIds.length > 0
          ? { create: uniqueTagIds.map((tagId) => ({ tagId })) }
          : undefined,
      },
    });

    // Update organization postCount if orgId is set
    if (validOrgId) {
      const count = await prisma.post.count({
        where: { orgId: validOrgId, deletedAt: null, status: "PUBLISHED" },
      });
      await prisma.organization.update({
        where: { id: validOrgId },
        data: { postCount: count },
      });
    }

    return NextResponse.json({ success: true, postId: post.id });
  } catch {
    return NextResponse.json({ error: "投稿に失敗しました" }, { status: 500 });
  }
}
