import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth, isAdmin } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!isAdmin(session?.user?.role)) {
    return NextResponse.json({ error: "権限がありません" }, { status: 403 });
  }

  const { id } = await params;
  const { isBanned } = await req.json();

  if (Number(id) === Number(session!.user!.id)) {
    return NextResponse.json({ error: "自分自身をBANできません" }, { status: 400 });
  }

  const user = await prisma.user.update({
    where: { id: Number(id) },
    data: { isBanned: Boolean(isBanned) },
  });

  return NextResponse.json({ id: user.id, isBanned: user.isBanned });
}
