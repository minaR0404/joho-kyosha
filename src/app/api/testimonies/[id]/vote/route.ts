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
    const testimonyId = Number(id);
    const userId = Number(session.user.id);
    const { value } = await req.json();

    if (value !== 1 && value !== -1) {
      return NextResponse.json({ error: "無効な投票です" }, { status: 400 });
    }

    const testimony = await prisma.testimony.findUnique({
      where: { id: testimonyId },
      select: { deletedAt: true, status: true },
    });
    if (!testimony || testimony.deletedAt || testimony.status !== "PUBLISHED") {
      return NextResponse.json({ error: "体験談が見つかりません" }, { status: 404 });
    }

    const existing = await prisma.testimonyVote.findUnique({
      where: { testimonyId_userId: { testimonyId, userId } },
    });

    if (existing) {
      if (existing.value === value) {
        await prisma.testimonyVote.delete({ where: { id: existing.id } });
      } else {
        await prisma.testimonyVote.update({ where: { id: existing.id }, data: { value } });
      }
    } else {
      await prisma.testimonyVote.create({ data: { testimonyId, userId, value } });
    }

    const helpfulCount = await prisma.testimonyVote.count({
      where: { testimonyId, value: 1 },
    });

    await prisma.testimony.update({
      where: { id: testimonyId },
      data: { helpfulCount },
    });

    return NextResponse.json({ success: true, helpfulCount });
  } catch {
    return NextResponse.json({ error: "投票に失敗しました" }, { status: 500 });
  }
}
