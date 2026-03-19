import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { apiRateLimit, checkRateLimit } from "@/lib/ratelimit";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "ログインが必要です" }, { status: 401 });
    }

    const { success, headers } = await checkRateLimit(apiRateLimit, session.user.id);
    if (!success) {
      return NextResponse.json(
        { error: "リクエストが多すぎます。しばらくお待ちください" },
        { status: 429, headers }
      );
    }

    const { id } = await params;
    const postId = Number(id);
    const userId = Number(session.user.id);
    const { value } = await req.json();

    if (value !== 1 && value !== -1) {
      return NextResponse.json({ error: "無効な投票です" }, { status: 400 });
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { deletedAt: true, status: true },
    });
    if (!post || post.deletedAt || post.status !== "PUBLISHED") {
      return NextResponse.json({ error: "投稿が見つかりません" }, { status: 404 });
    }

    const existing = await prisma.postVote.findUnique({
      where: { postId_userId: { postId, userId } },
    });

    if (existing) {
      if (existing.value === value) {
        await prisma.postVote.delete({ where: { id: existing.id } });
      } else {
        await prisma.postVote.update({ where: { id: existing.id }, data: { value } });
      }
    } else {
      await prisma.postVote.create({ data: { postId, userId, value } });
    }

    const helpfulCount = await prisma.postVote.count({
      where: { postId, value: 1 },
    });

    await prisma.post.update({
      where: { id: postId },
      data: { helpfulCount },
    });

    return NextResponse.json({ success: true, helpfulCount });
  } catch {
    return NextResponse.json({ error: "投票に失敗しました" }, { status: 500 });
  }
}
