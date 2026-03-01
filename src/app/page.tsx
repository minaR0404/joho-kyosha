import { prisma } from "@/lib/prisma";
import SearchBar from "@/components/SearchBar";
import CategoryNav from "@/components/CategoryNav";
import OrgCard from "@/components/OrgCard";
import ReviewCard from "@/components/ReviewCard";

export default async function HomePage() {
  const [categories, trendingOrgs, latestReviews, stats] = await Promise.all([
    prisma.category.findMany({ orderBy: { id: "asc" } }),
    prisma.organization.findMany({
      orderBy: { reviewCount: "desc" },
      take: 6,
      include: { category: true },
    }),
    prisma.review.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        user: { select: { id: true, displayName: true, image: true } },
        org: { select: { name: true, slug: true } },
      },
    }),
    Promise.all([
      prisma.organization.count(),
      prisma.review.count(),
      prisma.user.count(),
    ]),
  ]);

  const [orgCount, reviewCount, userCount] = stats;

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
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl w-[110px] h-[110px] flex flex-col items-center justify-center shadow-lg shadow-white/15">
              <span className="text-3xl font-extrabold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">{orgCount}</span>
              <span className="text-xs text-blue-200 mt-2 tracking-wide">登録組織</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl w-[110px] h-[110px] flex flex-col items-center justify-center shadow-lg shadow-white/15">
              <span className="text-3xl font-extrabold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">{reviewCount}</span>
              <span className="text-xs text-blue-200 mt-2 tracking-wide">口コミ</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl w-[110px] h-[110px] flex flex-col items-center justify-center shadow-lg shadow-white/15">
              <span className="text-3xl font-extrabold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">{userCount}</span>
              <span className="text-xs text-blue-200 mt-2 tracking-wide">ユーザー</span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Categories */}
        <section className="mb-12">
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

        {/* Latest Reviews */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">最新の口コミ</h2>
          <div className="space-y-4">
            {latestReviews.map((review) => (
              <ReviewCard
                key={review.id}
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
                helpfulCount={review.helpfulCount}
                createdAt={review.createdAt.toISOString()}
                orgName={review.org.name}
                orgSlug={review.org.slug}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
