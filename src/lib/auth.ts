import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

export function isAdmin(role: string | null | undefined): boolean {
  return role === "ADMIN";
}

export function isModerator(role: string | null | undefined): boolean {
  return role === "ADMIN" || role === "MODERATOR";
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "メールアドレス",
      credentials: {
        email: { label: "メールアドレス", type: "email" },
        password: { label: "パスワード", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // 一時トークンによる自動ログイン（メール認証後）
        if (credentials.email === "__auto_login__") {
          const tokenRecord = await prisma.verificationToken.findUnique({
            where: { token: credentials.password as string },
          });
          if (!tokenRecord || tokenRecord.expiresAt < new Date()) return null;

          const user = await prisma.user.findUnique({
            where: { id: tokenRecord.userId },
          });
          if (!user || !user.emailVerifiedAt || user.isBanned) return null;

          await prisma.verificationToken.delete({ where: { id: tokenRecord.id } });

          return {
            id: String(user.id),
            name: user.displayName,
            email: user.email,
            role: user.role as string,
            emailVerifiedAt: user.emailVerifiedAt.toISOString(),
          };
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.hashedPassword) return null;
        if (user.isBanned) return null;

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.hashedPassword
        );

        if (!isValid) return null;
        if (!user.emailVerifiedAt) return null;

        return {
          id: String(user.id),
          name: user.displayName,
          email: user.email,
          role: user.role as string,
          emailVerifiedAt: user.emailVerifiedAt?.toISOString() ?? null,
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub;
      }
      if (token.role) {
        session.user.role = token.role as string;
      }
      session.user.emailVerifiedAt = (token.emailVerifiedAt as string) ?? null;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.role = user.role;
        token.emailVerifiedAt = user.emailVerifiedAt;
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
});
