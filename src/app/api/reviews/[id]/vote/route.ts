import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(
  req: NextRequest,
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
    const { value } = await req.json();

    if (value !== 1 && value !== -1) {
      return NextResponse.json({ error: "無効な投票です" }, { status: 400 });
    }

    const existing = await prisma.reviewVote.findUnique({
      where: { reviewId_userId: { reviewId, userId } },
    });

    if (existing) {
      if (existing.value === value) {
        // Remove vote
        await prisma.reviewVote.delete({
          where: { id: existing.id },
        });
      } else {
        // Change vote
        await prisma.reviewVote.update({
          where: { id: existing.id },
          data: { value },
        });
      }
    } else {
      await prisma.reviewVote.create({
        data: { reviewId, userId, value },
      });
    }

    // Update helpful count
    const helpfulCount = await prisma.reviewVote.count({
      where: { reviewId, value: 1 },
    });

    await prisma.review.update({
      where: { id: reviewId },
      data: { helpfulCount },
    });

    return NextResponse.json({ success: true, helpfulCount });
  } catch {
    return NextResponse.json({ error: "投票に失敗しました" }, { status: 500 });
  }
}
