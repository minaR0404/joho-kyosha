import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const VALID_TARGET_TYPES = ["REVIEW", "TESTIMONY", "ORGANIZATION"];
const VALID_REASONS = ["SPAM", "FALSE_INFO", "DEFAMATION", "INAPPROPRIATE", "OTHER"];

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "ログインが必要です" }, { status: 401 });
    }

    const { targetType, targetId, reason, detail } = await req.json();

    if (!VALID_TARGET_TYPES.includes(targetType)) {
      return NextResponse.json({ error: "無効な通報対象です" }, { status: 400 });
    }

    if (!VALID_REASONS.includes(reason)) {
      return NextResponse.json({ error: "無効な通報理由です" }, { status: 400 });
    }

    if (!targetId) {
      return NextResponse.json({ error: "通報対象が指定されていません" }, { status: 400 });
    }

    const existing = await prisma.report.findFirst({
      where: {
        reporterId: Number(session.user.id),
        targetType,
        targetId: Number(targetId),
        status: "PENDING",
      },
    });

    if (existing) {
      return NextResponse.json({ error: "すでに通報済みです" }, { status: 409 });
    }

    await prisma.report.create({
      data: {
        reporterId: Number(session.user.id),
        targetType,
        targetId: Number(targetId),
        reason,
        detail: detail || null,
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "通報に失敗しました" }, { status: 500 });
  }
}
