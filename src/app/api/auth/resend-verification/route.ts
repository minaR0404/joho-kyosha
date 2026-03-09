import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateVerificationToken } from "@/lib/verification-token";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "メールアドレスが必要です" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    // ユーザーが存在しない・既に確認済み・メールなしでも同じレスポンスを返す（情報漏洩防止）
    if (!user || !user.email || user.emailVerifiedAt) {
      return NextResponse.json({ success: true });
    }

    // 60秒のレート制限
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
  } catch {
    return NextResponse.json({ error: "送信に失敗しました" }, { status: 500 });
  }
}
