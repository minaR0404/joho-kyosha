import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { MessageSquare, ThumbsUp, Calendar } from "lucide-react";
import AccountSettings from "@/components/AccountSettings";
import PostList from "@/components/PostList";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "マイページ",
};

export default async function MyPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login?callbackUrl=/mypage");
  }

  const user = await prisma.user.findUnique({
    where: { id: Number(session.user.id) },
    include: {
      posts: {
        where: { deletedAt: null },
        orderBy: { createdAt: "desc" },
        include: {
          category: { select: { name: true } },
          org: { select: { slug: true, name: true } },
        },
      },
    },
  });

  if (!user) redirect("/auth/login");

  const totalHelpful = user.posts.reduce((sum, p) => sum + p.helpfulCount, 0);

  // Fetch user's votes on own posts
  const userVotes = await prisma.postVote.findMany({
    where: { userId: user.id, postId: { in: user.posts.map((p) => p.id) }, value: 1 },
    select: { postId: true },
  });
  const votedPostIds = new Set(userVotes.map((v) => v.postId));

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Profile */}
      <div className="bg-white border border-gray-200 rounded-lg p-8 mb-4 flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-3xl font-bold mb-3">
          {user.displayName.charAt(0)}
        </div>
        <h1 className="text-xl font-bold text-gray-900">{user.displayName}</h1>
        <p className="text-sm text-gray-500 mt-1">{user.email}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-5 flex flex-col sm:flex-row items-center gap-1 sm:gap-3 text-center sm:text-left">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
            <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
          </div>
          <div className="flex flex-col justify-center">
            <p className="h-7 sm:h-8 flex items-center justify-center sm:justify-start text-xl sm:text-2xl font-bold text-gray-900">{user.posts.length}</p>
            <p className="text-xs text-gray-500">投稿</p>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-5 flex flex-col sm:flex-row items-center gap-1 sm:gap-3 text-center sm:text-left">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-50 rounded-lg flex items-center justify-center shrink-0">
            <ThumbsUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
          </div>
          <div className="flex flex-col justify-center">
            <p className="h-7 sm:h-8 flex items-center justify-center sm:justify-start text-xl sm:text-2xl font-bold text-gray-900">{totalHelpful}</p>
            <p className="text-xs text-gray-500">参考になった</p>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-5 flex flex-col sm:flex-row items-center gap-1 sm:gap-3 text-center sm:text-left">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-50 rounded-lg flex items-center justify-center shrink-0">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
          </div>
          <div className="flex flex-col justify-center">
            <p className="h-7 sm:h-8 flex items-center justify-center sm:justify-start text-sm sm:text-lg font-bold text-gray-900">
              {user.createdAt.toLocaleDateString("ja-JP", { year: "numeric", month: "short" })}
            </p>
            <p className="text-xs text-gray-500">登録日</p>
          </div>
        </div>
      </div>

      {/* Settings */}
      <section className="mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4">アカウント設定</h2>
        <AccountSettings currentName={user.displayName} email={user.email || ""} />
      </section>

      {/* Posts */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          あなたの投稿（{user.posts.length}件）
        </h2>

        {user.posts.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500 mb-3">まだ投稿していません</p>
            <Link href="/post/new" className="text-blue-600 hover:underline text-sm">
              投稿する
            </Link>
          </div>
        ) : (
          <PostList posts={JSON.parse(JSON.stringify(user.posts.map((p) => ({
            id: p.id,
            title: p.title,
            body: p.body,
            helpfulCount: p.helpfulCount,
            createdAt: p.createdAt,
            categoryName: p.category.name,
            orgName: p.org?.name,
            orgSlug: p.org?.slug,
            userVoted: votedPostIds.has(p.id),
          }))))} />
        )}
      </section>
    </div>
  );
}
