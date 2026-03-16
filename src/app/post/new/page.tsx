import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import PostForm from "@/components/PostForm";
import EmailVerificationBanner from "@/components/EmailVerificationBanner";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "投稿する",
};

export default async function NewPostPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login?callbackUrl=/post/new");
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
        <Link href="/posts" className="hover:text-blue-600">投稿一覧</Link>
        {" > "}
        <span className="text-gray-900">投稿する</span>
      </nav>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">投稿する</h1>
      <p className="text-gray-600 mb-6">
        あなたの体験を共有して、他の人が騙されないよう助けましょう。組織名がわからない場合でも投稿できます。
      </p>

      {!isEmailVerified && <EmailVerificationBanner />}
      <PostForm tags={tags} />
    </div>
  );
}
