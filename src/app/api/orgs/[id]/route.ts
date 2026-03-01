import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth, isAdmin } from "@/lib/auth";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const org = await prisma.organization.findUnique({
    where: { id: Number(id) },
    include: {
      category: true,
      tags: { include: { tag: true } },
    },
  });

  if (!org) {
    return NextResponse.json({ error: "見つかりません" }, { status: 404 });
  }

  return NextResponse.json(org);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.email || !isAdmin(session.user.email)) {
    return NextResponse.json({ error: "権限がありません" }, { status: 403 });
  }

  const { id } = await params;
  const orgId = Number(id);

  try {
    await prisma.$transaction([
      prisma.reviewVote.deleteMany({ where: { review: { orgId } } }),
      prisma.review.deleteMany({ where: { orgId } }),
      prisma.tagsOnOrgs.deleteMany({ where: { orgId } }),
      prisma.organization.delete({ where: { id: orgId } }),
    ]);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "削除に失敗しました" }, { status: 500 });
  }
}
