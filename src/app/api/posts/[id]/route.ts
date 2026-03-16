import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "ログインが必要です" }, { status: 401 });
    }

    const { id } = await params;
    const postId = Number(id);
    const userId = Number(session.user.id);

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { userId: true, orgId: true, deletedAt: true },
    });

    if (!post || post.deletedAt) {
      return NextResponse.json({ error: "投稿が見つかりません" }, { status: 404 });
    }

    if (post.userId !== userId) {
      return NextResponse.json({ error: "権限がありません" }, { status: 403 });
    }

    await prisma.post.update({
      where: { id: postId },
      data: { deletedAt: new Date() },
    });

    // Recalculate organization's post count
    if (post.orgId) {
      const count = await prisma.post.count({
        where: { orgId: post.orgId, deletedAt: null, status: "PUBLISHED" },
      });
      await prisma.organization.update({
        where: { id: post.orgId },
        data: { postCount: count },
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "削除に失敗しました" }, { status: 500 });
  }
}
