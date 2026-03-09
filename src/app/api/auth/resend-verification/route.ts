import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateVerificationToken } from "@/lib/verification-token";
import { sendVerificationEmail } from "@/lib/email";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "ログインが必要です" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: Number(session.user.id) },
  });

  if (!user || !user.email) {
    return NextResponse.json({ error: "ユーザーが見つかりません" }, { status: 400 });
  }

  if (user.emailVerifiedAt) {
    return NextResponse.json({ error: "既に確認済みです" }, { status: 400 });
  }

  const recentToken = await prisma.verificationToken.findFirst({
    where: {
      userId: user.id,
      createdAt: { gt: new Date(Date.now() - 60 * 1000) },
    },
  });

  if (recentToken) {
    return NextResponse.json(
      { error: "1分後に再度お試しください" },
      { status: 429 }
    );
  }

  const verificationToken = await generateVerificationToken(user.id);
  await sendVerificationEmail(user.email, verificationToken.token);

  return NextResponse.json({ success: true });
}
