import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  const { displayName } = await req.json();

  if (!displayName || typeof displayName !== "string" || displayName.trim().length === 0) {
    return NextResponse.json({ error: "表示名を入力してください" }, { status: 400 });
  }

  if (displayName.trim().length > 30) {
    return NextResponse.json({ error: "表示名は30文字以内にしてください" }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: Number(session.user.id) },
    data: { displayName: displayName.trim() },
  });

  return NextResponse.json({ success: true });
}
