import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import TestimonyForm from "@/components/TestimonyForm";
import EmailVerificationBanner from "@/components/EmailVerificationBanner";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "体験談を投稿する",
};

export default async function NewTestimonyPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login?callbackUrl=/testimony/new");
  }

  const currentUser = await prisma.user.findUnique({
    where: { id: Number(session.user.id) },
    select: { emailVerifiedAt: true },
  });
  const isEmailVerified = !!currentUser?.emailVerifiedAt;

  const tags = await prisma.tag.findMany({ orderBy: { id: "asc" } });

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600">トップ</Link>
        {" > "}
        <Link href="/testimonies" className="hover:text-blue-600">体験談一覧</Link>
        {" > "}
        <span className="text-gray-900">体験談を投稿</span>
      </nav>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">体験談を投稿する</h1>
      <p className="text-gray-600 mb-6">
        組織名がわからない場合や、個人による被害など、口コミとして書けない体験を共有できます。
      </p>

      {!isEmailVerified && <EmailVerificationBanner />}
      <TestimonyForm tags={tags} />
    </div>
  );
}
