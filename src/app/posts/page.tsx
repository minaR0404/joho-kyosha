import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import Link from "next/link";
import PostCard from "@/components/PostCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "投稿一覧",
  description: "最新の投稿一覧。詐欺・悪徳商法の被害体験を共有しています。",
};

const PER_PAGE = 10;

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageStr } = await searchParams;
  const page = Math.max(1, Number(pageStr) || 1);

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where: { deletedAt: null, status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE,
      include: {
        user: { select: { id: true, displayName: true } },
        category: { select: { slug: true, name: true } },
        tags: { include: { tag: true } },
        org: { select: { name: true, slug: true } },
      },
    }),
    prisma.post.count({
      where: { deletedAt: null, status: "PUBLISHED" },
    }),
  ]);

  const totalPages = Math.ceil(total / PER_PAGE);

  const session = await auth();
  const userId = session?.user?.id ? Number(session.user.id) : null;

  const votedIds = new Set<number>();
  if (userId && posts.length > 0) {
    const votes = await prisma.postVote.findMany({
      where: { userId, postId: { in: posts.map((p) => p.id) }, value: 1 },
      select: { postId: true },
    });
    votes.forEach((v) => votedIds.add(v.postId));
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">投稿一覧</h1>
        <Link
          href="/post/new"
          className="px-4 py-2 bg-blue-700 text-white text-sm rounded-md hover:bg-blue-800 transition-colors"
        >
          投稿する
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg mb-2">まだ投稿がありません</p>
          <Link href="/post/new" className="text-blue-600 hover:underline">
            最初の投稿をする
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {posts.map((p) => (
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
                isAnonymous={p.isAnonymous}
                displayName={p.user.displayName}
                userId={p.user.id}
                helpfulCount={p.helpfulCount}
                createdAt={p.createdAt.toISOString()}
                orgName={p.org?.name}
                orgSlug={p.org?.slug}
                userVoted={votedIds.has(p.id)}
                tags={p.tags.map((pt) => ({ id: pt.tag.id, name: pt.tag.name }))}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              {page > 1 && (
                <Link
                  href={`/posts?page=${page - 1}`}
                  className="px-3 py-1 text-sm rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200"
                >
                  前へ
                </Link>
              )}
              <span className="px-3 py-1 text-sm text-gray-500">
                {page} / {totalPages}
              </span>
              {page < totalPages && (
                <Link
                  href={`/posts?page=${page + 1}`}
                  className="px-3 py-1 text-sm rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200"
                >
                  次へ
                </Link>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
