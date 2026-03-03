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
    const reviewId = Number(id);
    const userId = Number(session.user.id);

    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      select: { userId: true, orgId: true, deletedAt: true },
    });

    if (!review || review.deletedAt) {
      return NextResponse.json({ error: "口コミが見つかりません" }, { status: 404 });
    }

    if (review.userId !== userId) {
      return NextResponse.json({ error: "権限がありません" }, { status: 403 });
    }

    await prisma.review.update({
      where: { id: reviewId },
      data: { deletedAt: new Date() },
    });

    // Recalculate organization's average rating and review count
    const agg = await prisma.review.aggregate({
      where: { orgId: review.orgId, deletedAt: null },
      _avg: { ratingOverall: true },
      _count: true,
    });

    await prisma.organization.update({
      where: { id: review.orgId },
      data: {
        avgRating: Math.round((agg._avg.ratingOverall || 0) * 10) / 10,
        reviewCount: agg._count,
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "削除に失敗しました" }, { status: 500 });
  }
}
