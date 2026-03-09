import { NextRequest } from "next/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { signIn } from "@/lib/auth";
import crypto from "crypto";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    redirect("/auth/verify-email?error=missing");
  }

  const record = await prisma.verificationToken.findUnique({
    where: { token },
  });

  if (!record || record.expiresAt < new Date()) {
    redirect("/auth/verify-email?error=invalid");
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: { emailVerifiedAt: new Date() },
    }),
    prisma.verificationToken.delete({ where: { id: record.id } }),
  ]);

  // 自動ログイン用の一時トークン生成（5分有効）
  const autoLoginToken = crypto.randomBytes(32).toString("hex");
  await prisma.verificationToken.create({
    data: {
      token: autoLoginToken,
      userId: record.userId,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    },
  });

  // サーバーサイドで直接signIn → セッションcookieが設定される
  await signIn("credentials", {
    email: "__auto_login__",
    password: autoLoginToken,
    redirectTo: "/",
  });
}
