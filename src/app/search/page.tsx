import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import SearchBar from "@/components/SearchBar";
import OrgCard from "@/components/OrgCard";
import PostCard from "@/components/PostCard";
import type { Metadata } from "next";

type Props = { searchParams: Promise<{ q?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  return { title: q ? `「${q}」の検索結果` : "検索" };
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = q?.trim() || "";

  const [orgs, posts] = query
    ? await Promise.all([
        prisma.organization.findMany({
          where: {
            status: { not: "DELETED" },
            OR: [
              { name: { contains: query } },
              { nameKana: { contains: query } },
              { description: { contains: query } },
              { aliases: { contains: query } },
            ],
          },
          orderBy: { postCount: "desc" },
          take: 50,
          include: { category: { select: { name: true, slug: true } } },
        }),
        prisma.post.findMany({
          where: {
            deletedAt: null,
            status: "PUBLISHED",
            OR: [
              { title: { contains: query } },
              { body: { contains: query } },
            ],
          },
          orderBy: { createdAt: "desc" },
          take: 20,
          include: {
            user: { select: { id: true, displayName: true } },
            category: { select: { slug: true, name: true } },
            tags: { include: { tag: true } },
            org: { select: { name: true, slug: true } },
          },
        }),
      ])
    : [[], []];

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

  const totalCount = orgs.length + posts.length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">検索</h1>

      <div className="mb-8">
        <SearchBar defaultValue={query} size="md" />
      </div>

      {query ? (
        <>
          <p className="text-gray-600 mb-4">
            「{query}」の検索結果: {totalCount}件
          </p>
          {totalCount === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <p className="text-lg mb-2">該当する結果が見つかりませんでした</p>
              <p className="text-sm">別のキーワードで検索してください。</p>
            </div>
          ) : (
            <>
              {orgs.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-lg font-bold text-gray-900 mb-3">
                    組織 ({orgs.length}件)
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {orgs.map((org) => (
                      <OrgCard
                        key={org.id}
                        slug={org.slug}
                        name={org.name}
                        categoryName={org.category.name}
                        categorySlug={org.category.slug}
                        description={org.description}
                        postCount={org.postCount}
                        status={org.status}
                      />
                    ))}
                  </div>
                </div>
              )}

              {posts.length > 0 && (
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-3">
                    投稿 ({posts.length}件)
                  </h2>
                  <div className="space-y-4">
                    {posts.map((p) => (
                      <PostCard
                        key={p.id}
                        postId={p.id}
                        title={p.title}
                        body={p.body}
                        categoryName={p.category.name}
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
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </>
      ) : (
        <div className="text-center py-16 text-gray-500">
          <p>組織名・キーワードを入力して検索してください</p>
        </div>
      )}
    </div>
  );
}
