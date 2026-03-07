import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import CategoryNav from "@/components/CategoryNav";
import OrgCard from "@/components/OrgCard";
import ReviewCard from "@/components/ReviewCard";

export default async function HomePage() {
  const [categories, trendingOrgs, latestReviews, latestTestimonies, stats] = await Promise.all([
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.organization.findMany({
      where: { status: { not: "DELETED" }, approvalStatus: "APPROVED" },
      orderBy: { reviewCount: "desc" },
      take: 6,
      include: { category: true },
    }),
    prisma.review.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        user: { select: { id: true, displayName: true, image: true } },
        org: { select: { name: true, slug: true } },
      },
    }),
    prisma.testimony.findMany({
      where: { deletedAt: null, status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
      take: 3,
      include: {
        user: { select: { id: true, displayName: true } },
        category: { select: { name: true } },
      },
    }),
    Promise.all([
      prisma.organization.count({ where: { status: { not: "DELETED" } } }),
      prisma.review.count({ where: { deletedAt: null } }),
      prisma.user.count(),
    ]),
  ]);

  const [orgCount, reviewCount, userCount] = stats;

  const session = await auth();
  const userId = session?.user?.id ? Number(session.user.id) : null;
  const reviewIds = latestReviews.map((r) => r.id);
  const userVotes = userId
    ? await prisma.reviewVote.findMany({
        where: { userId, reviewId: { in: reviewIds }, value: 1 },
        select: { reviewId: true },
      })
    : [];
  const votedReviewIds = new Set(userVotes.map((v) => v.reviewId));

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
          <div className="flex justify-center gap-20 mt-10">
            <a href="#categories" className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl w-[110px] h-[110px] flex flex-col items-center justify-center shadow-lg shadow-white/15 hover:bg-white/20 transition-colors">
              <span className="text-3xl font-extrabold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">{orgCount}</span>
              <span className="text-xs text-blue-200 mt-2 tracking-wide">登録組織</span>
            </a>
            <a href="#latest-reviews" className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl w-[110px] h-[110px] flex flex-col items-center justify-center shadow-lg shadow-white/15 hover:bg-white/20 transition-colors">
              <span className="text-3xl font-extrabold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">{reviewCount}</span>
              <span className="text-xs text-blue-200 mt-2 tracking-wide">口コミ</span>
            </a>
            <a href={session?.user ? "/mypage" : "/auth/login"} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl w-[110px] h-[110px] flex flex-col items-center justify-center shadow-lg shadow-white/15 hover:bg-white/20 transition-colors">
              <span className="text-3xl font-extrabold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">{userCount}</span>
              <span className="text-xs text-blue-200 mt-2 tracking-wide">ユーザー</span>
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

        {/* Trending */}
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
                avgRating={org.avgRating}
                reviewCount={org.reviewCount}
                status={org.status}
              />
            ))}
          </div>
        </section>

        {/* Latest Testimonies */}
        {latestTestimonies.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">最新の体験談</h2>
              <Link href="/testimonies" className="text-sm text-blue-600 hover:underline">
                すべて見る →
              </Link>
            </div>
            <div className="space-y-3">
              {latestTestimonies.map((t) => (
                <Link
                  key={t.id}
                  href={`/testimony/${t.id}`}
                  className="block bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs px-2 py-0.5 bg-orange-50 text-orange-700 border border-orange-200 rounded">
                      体験談
                    </span>
                    <span className="text-xs text-gray-500">{t.category.name}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">{t.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{t.body}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                    <span>{t.isAnonymous ? "匿名" : t.user.displayName}</span>
                    <span>{t.createdAt.toLocaleDateString("ja-JP")}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Latest Reviews */}
        <section id="latest-reviews" className="scroll-mt-20">
          <h2 className="text-xl font-bold text-gray-900 mb-4">最新の口コミ</h2>
          <div className="space-y-4">
            {latestReviews.map((review) => (
              <ReviewCard
                key={review.id}
                reviewId={review.id}
                title={review.title}
                body={review.body}
                ratingOverall={review.ratingOverall}
                ratingDanger={review.ratingDanger}
                ratingCost={review.ratingCost}
                ratingPressure={review.ratingPressure}
                ratingTransparency={review.ratingTransparency}
                ratingExit={review.ratingExit}
                relationship={review.relationship}
                period={review.period}
                isAnonymous={review.isAnonymous}
                displayName={review.user.displayName}
                userId={review.user.id}
                helpfulCount={review.helpfulCount}
                createdAt={review.createdAt.toISOString()}
                orgName={review.org.name}
                orgSlug={review.org.slug}
                userVoted={votedReviewIds.has(review.id)}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
