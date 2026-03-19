import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { generateVerificationToken } from "@/lib/verification-token";
import { sendVerificationEmail } from "@/lib/email";
import { postRateLimit, checkRateLimit } from "@/lib/ratelimit";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "anonymous";
    const { success, headers } = await checkRateLimit(postRateLimit, `register:${ip}`);
    if (!success) {
      return NextResponse.json(
        { error: "登録の試行回数が多すぎます。しばらくお待ちください" },
        { status: 429, headers }
      );
    }

    const { email, password, displayName } = await req.json();

    if (!email || !password || !displayName) {
      return NextResponse.json(
        { error: "すべての項目を入力してください" },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      if (!existing.emailVerifiedAt) {
        // 未認証ユーザーは削除して再登録を許可
        await prisma.user.delete({ where: { id: existing.id } });
      } else {
        return NextResponse.json(
          { error: "このメールアドレスは既に登録されています" },
          { status: 400 }
        );
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        displayName,
        hashedPassword,
        provider: "credentials",
      },
    });

    try {
      const verificationToken = await generateVerificationToken(user.id);
      await sendVerificationEmail(email, verificationToken.token);
    } catch (emailError) {
      // メール送信失敗時はユーザーを削除してロールバック
      await prisma.user.delete({ where: { id: user.id } });
      console.error("Verification email failed:", emailError);
      return NextResponse.json(
        { error: "確認メールの送信に失敗しました。しばらく後にお試しください。" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, requiresVerification: true });
  } catch (error) {
    console.error("Registration failed:", error);
    return NextResponse.json(
      { error: "登録に失敗しました" },
      { status: 500 }
    );
  }
}
