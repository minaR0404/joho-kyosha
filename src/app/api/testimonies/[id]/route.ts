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
    const testimonyId = Number(id);
    const userId = Number(session.user.id);

    const testimony = await prisma.testimony.findUnique({
      where: { id: testimonyId },
    });

    if (!testimony || testimony.deletedAt) {
      return NextResponse.json({ error: "体験談が見つかりません" }, { status: 404 });
    }

    if (testimony.userId !== userId) {
      return NextResponse.json({ error: "権限がありません" }, { status: 403 });
    }

    await prisma.testimony.update({
      where: { id: testimonyId },
      data: { deletedAt: new Date() },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "削除に失敗しました" }, { status: 500 });
  }
}
