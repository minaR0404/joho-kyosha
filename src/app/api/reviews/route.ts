import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { calculateOverallRating } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "ログインが必要です" }, { status: 401 });
    }

    const body = await req.json();
    const {
      orgId,
      ratingDanger,
      ratingCost,
      ratingPressure,
      ratingTransparency,
      ratingExit,
      title,
      body: reviewBody,
      relationship,
      period,
      isAnonymous,
      tagIds,
    } = body;

    if (!orgId || !title || !reviewBody || !relationship) {
      return NextResponse.json(
        { error: "必須項目を入力してください" },
        { status: 400 }
      );
    }

    for (const r of [ratingDanger, ratingCost, ratingPressure, ratingTransparency, ratingExit]) {
      if (!r || r < 1 || r > 5) {
        return NextResponse.json(
          { error: "すべての評価を1〜5で入力してください" },
          { status: 400 }
        );
      }
    }

    const ratingOverall = calculateOverallRating({
      ratingDanger,
      ratingCost,
      ratingPressure,
      ratingTransparency,
      ratingExit,
    });

    const review = await prisma.review.create({
      data: {
        orgId: Number(orgId),
        userId: Number(session.user.id),
        ratingOverall,
        ratingDanger,
        ratingCost,
        ratingPressure,
        ratingTransparency,
        ratingExit,
        title,
        body: reviewBody,
        relationship,
        period: period || null,
        isAnonymous: isAnonymous ?? true,
        tags: Array.isArray(tagIds) && tagIds.length > 0
          ? { create: tagIds.map((tagId: number) => ({ tagId })) }
          : undefined,
      },
    });

    // Update organization's average rating and review count
    const agg = await prisma.review.aggregate({
      where: { orgId: Number(orgId) },
      _avg: { ratingOverall: true },
      _count: true,
    });

    await prisma.organization.update({
      where: { id: Number(orgId) },
      data: {
        avgRating: Math.round((agg._avg.ratingOverall || 0) * 10) / 10,
        reviewCount: agg._count,
      },
    });

    return NextResponse.json({ success: true, reviewId: review.id });
  } catch {
    return NextResponse.json(
      { error: "口コミの投稿に失敗しました" },
      { status: 500 }
    );
  }
}
