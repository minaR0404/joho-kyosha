import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MessageSquare, ThumbsUp } from "lucide-react";
import PostCard from "@/components/PostCard";
import type { Metadata } from "next";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const user = await prisma.user.findUnique({
    where: { id: Number(id) },
    select: { displayName: true },
  });
  if (!user) return {};
  return { title: `${user.displayName}のプロフィール` };
}

export default async function UserProfilePage({ params }: Props) {
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id: Number(id) },
    include: {
      posts: {
        where: { deletedAt: null, isAnonymous: false, status: "PUBLISHED" },
        orderBy: { createdAt: "desc" },
        include: {
          category: { select: { name: true } },
          org: { select: { slug: true, name: true } },
          tags: { include: { tag: true } },
        },
      },
    },
  });

  if (!user) notFound();

  const totalHelpful = user.posts.reduce((sum, p) => sum + p.helpfulCount, 0);

  // Fetch viewer's votes for HelpfulButton
  const session = await auth();
  const viewerId = session?.user?.id ? Number(session.user.id) : null;
  const votedPostIds = new Set<number>();
  if (viewerId) {
    const votes = await prisma.postVote.findMany({
      where: { userId: viewerId, postId: { in: user.posts.map((p) => p.id) }, value: 1 },
      select: { postId: true },
    });
    votes.forEach((v) => votedPostIds.add(v.postId));
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600">トップ</Link>
        {" > "}
        <span className="text-gray-900">{user.displayName}</span>
      </nav>

      {/* Profile */}
      <div className="bg-white border border-gray-200 rounded-lg p-8 mb-4 flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-3xl font-bold mb-3">
          {user.displayName.charAt(0)}
        </div>
        <h1 className="text-xl font-bold text-gray-900">{user.displayName}</h1>
        <p className="text-sm text-gray-500 mt-1">
          {user.createdAt.toLocaleDateString("ja-JP", { year: "numeric", month: "long" })}から利用
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-5 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
            <MessageSquare className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{user.posts.length}</p>
            <p className="text-xs text-gray-500">投稿</p>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-5 flex items-center gap-3">
          <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center shrink-0">
            <ThumbsUp className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{totalHelpful}</p>
            <p className="text-xs text-gray-500">参考になった</p>
          </div>
        </div>
      </div>

      {/* Posts */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          投稿（{user.posts.length}件）
        </h2>

        {user.posts.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">まだ公開投稿はありません</p>
          </div>
        ) : (
          <div className="space-y-4">
            {user.posts.map((p) => (
              <PostCard
                key={p.id}
                postId={p.id}
                title={p.title}
                body={p.body}
                categoryName={p.category.name}
                scamType={p.scamType}
                damageAmount={p.damageAmount}
                period={p.period}
                relationship={p.relationship}
                isAnonymous={false}
                displayName={user.displayName}
                userId={user.id}
                helpfulCount={p.helpfulCount}
                createdAt={p.createdAt.toISOString()}
                orgName={p.org?.name}
                orgSlug={p.org?.slug}
                userVoted={votedPostIds.has(p.id)}
                tags={p.tags.map((pt) => ({ id: pt.tag.id, name: pt.tag.name }))}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
