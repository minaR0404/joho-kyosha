import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth, isAdmin } from "@/lib/auth";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!isAdmin(session?.user?.role)) {
    return NextResponse.json({ error: "権限がありません" }, { status: 403 });
  }

  const { id } = await params;

  const post = await prisma.post.findUnique({ where: { id: Number(id) } });
  if (!post) {
    return NextResponse.json({ error: "投稿が見つかりません" }, { status: 404 });
  }

  await prisma.post.update({
    where: { id: Number(id) },
    data: { deletedAt: new Date() },
  });

  if (post.orgId) {
    await prisma.organization.update({
      where: { id: post.orgId },
      data: { postCount: { decrement: 1 } },
    });
  }

  return NextResponse.json({ success: true });
}
