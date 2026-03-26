import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import CategoryNav from "@/components/CategoryNav";
import OrgCard from "@/components/OrgCard";
import PostCard from "@/components/PostCard";

export default async function HomePage() {
  const [categories, trendingOrgs, latestPosts, stats] = await Promise.all([
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.organization.findMany({
      where: { status: { not: "DELETED" }, approvalStatus: "APPROVED" },
      orderBy: { postCount: "desc" },
      take: 6,
      include: { category: true },
    }),
    prisma.post.findMany({
      where: { deletedAt: null, status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
      take: 4,
      include: {
        user: { select: { id: true, displayName: true } },
        category: { select: { name: true } },
        tags: { include: { tag: true } },
        org: { select: { name: true, slug: true } },
      },
    }),
    Promise.all([
      prisma.organization.count({ where: { status: { not: "DELETED" } } }),
      prisma.post.count({ where: { deletedAt: null, status: "PUBLISHED" } }),
      prisma.user.count({ where: { emailVerifiedAt: { not: null } } }),
    ]),
  ]);

  const [orgCount, postCount, userCount] = stats;

  const session = await auth();
  const userId = session?.user?.id ? Number(session.user.id) : null;

  // Post votes
  const postIds = latestPosts.map((p) => p.id);
  const userVotes = userId
    ? await prisma.postVote.findMany({
        where: { userId, postId: { in: postIds }, value: 1 },
        select: { postId: true },
      })
    : [];
  const votedPostIds = new Set(userVotes.map((v) => v.postId));

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-800 to-blue-950 text-white py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-3">情報強者</h1>
          <p className="text-blue-200 text-lg mb-8">
            騙される前に、まずチェック。
          </p>
          <SearchBar size="lg" />
          <div className="flex justify-center gap-4 md:gap-16 mt-10">
            <a href="#latest-posts" className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl w-[90px] h-[80px] sm:w-[110px] sm:h-[110px] flex flex-col items-center justify-center shadow-lg shadow-white/15 hover:bg-white/20 transition-colors">
              <span className="text-2xl sm:text-3xl font-extrabold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">{postCount}</span>
              <span className="text-xs text-blue-200 mt-1 sm:mt-2 tracking-wide">投稿</span>
            </a>
            <a href="#categories" className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl w-[90px] h-[80px] sm:w-[110px] sm:h-[110px] flex flex-col items-center justify-center shadow-lg shadow-white/15 hover:bg-white/20 transition-colors">
              <span className="text-2xl sm:text-3xl font-extrabold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">{orgCount}</span>
              <span className="text-xs text-blue-200 mt-1 sm:mt-2 tracking-wide">登録組織</span>
            </a>
            <a href={session?.user ? "/mypage" : "/auth/login"} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl w-[90px] h-[80px] sm:w-[110px] sm:h-[110px] flex flex-col items-center justify-center shadow-lg shadow-white/15 hover:bg-white/20 transition-colors">
              <span className="text-2xl sm:text-3xl font-extrabold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">{userCount}</span>
              <span className="text-xs text-blue-200 mt-1 sm:mt-2 tracking-wide">ユーザー</span>
            </a>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Categories */}
        <section id="categories" className="mb-12 scroll-mt-20">
          <h2 className="text-xl font-bold text-gray-900 mb-4">カテゴリから探す</h2>
          <CategoryNav categories={categories} />
        </section>

        {/* Latest Posts */}
        {latestPosts.length > 0 && (
          <section id="latest-posts" className="mb-12 scroll-mt-20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">最新の投稿</h2>
              <Link href="/posts" className="text-sm text-blue-600 hover:underline">
                すべて見る →
              </Link>
            </div>
            <div className="space-y-4">
              {latestPosts.map((p) => (
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
                  userVoted={votedPostIds.has(p.id)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Trending Organizations */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4">注目の組織</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trendingOrgs.map((org) => (
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
        </section>
      </div>
    </div>
  );
}
