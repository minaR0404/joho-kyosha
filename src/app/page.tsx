import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import CategoryNav from "@/components/CategoryNav";
import OrgCard from "@/components/OrgCard";
import ReviewCard from "@/components/ReviewCard";
import TestimonyCard from "@/components/TestimonyCard";

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
      take: 6,
      include: {
        user: { select: { id: true, displayName: true } },
        category: { select: { name: true } },
        tags: { include: { tag: true } },
        org: { select: { name: true, slug: true } },
      },
    }),
    Promise.all([
      prisma.organization.count({ where: { status: { not: "DELETED" } } }),
      prisma.review.count({ where: { deletedAt: null } }),
      prisma.testimony.count({ where: { deletedAt: null, status: "PUBLISHED" } }),
      prisma.user.count({ where: { emailVerifiedAt: { not: null } } }),
    ]),
  ]);

  const [orgCount, reviewCount, testimonyCount, userCount] = stats;

  const session = await auth();
  const userId = session?.user?.id ? Number(session.user.id) : null;

  // Review votes
  const reviewIds = latestReviews.map((r) => r.id);
  const userReviewVotes = userId
    ? await prisma.reviewVote.findMany({
        where: { userId, reviewId: { in: reviewIds }, value: 1 },
        select: { reviewId: true },
      })
    : [];
  const votedReviewIds = new Set(userReviewVotes.map((v) => v.reviewId));

  // Testimony votes
  const testimonyIds = latestTestimonies.map((t) => t.id);
  const userTestimonyVotes = userId
    ? await prisma.testimonyVote.findMany({
        where: { userId, testimonyId: { in: testimonyIds }, value: 1 },
        select: { testimonyId: true },
      })
    : [];
  const votedTestimonyIds = new Set(userTestimonyVotes.map((v) => v.testimonyId));

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
            <a href="#latest-testimonies" className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl w-[90px] h-[80px] sm:w-[110px] sm:h-[110px] flex flex-col items-center justify-center shadow-lg shadow-white/15 hover:bg-white/20 transition-colors">
              <span className="text-2xl sm:text-3xl font-extrabold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">{testimonyCount}</span>
              <span className="text-xs text-blue-200 mt-1 sm:mt-2 tracking-wide">体験談</span>
            </a>
            <a href="#latest-reviews" className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl w-[90px] h-[80px] sm:w-[110px] sm:h-[110px] flex flex-col items-center justify-center shadow-lg shadow-white/15 hover:bg-white/20 transition-colors">
              <span className="text-2xl sm:text-3xl font-extrabold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">{reviewCount}</span>
              <span className="text-xs text-blue-200 mt-1 sm:mt-2 tracking-wide">口コミ</span>
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

        {/* Latest Testimonies */}
        {latestTestimonies.length > 0 && (
          <section id="latest-testimonies" className="mb-12 scroll-mt-20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">最新の体験談</h2>
              <Link href="/testimonies" className="text-sm text-blue-600 hover:underline">
                すべて見る →
              </Link>
            </div>
            <div className="space-y-4">
              {latestTestimonies.map((t) => (
                <TestimonyCard
                  key={t.id}
                  testimonyId={t.id}
                  title={t.title}
                  body={t.body}
                  categoryName={t.category.name}
                  scamType={t.scamType}
                  damageAmount={t.damageAmount}
                  period={t.period}
                  isAnonymous={t.isAnonymous}
                  displayName={t.user.displayName}
                  userId={t.user.id}
                  helpfulCount={t.helpfulCount}
                  createdAt={t.createdAt.toISOString()}
                  orgName={t.org?.name}
                  orgSlug={t.org?.slug}
                  userVoted={votedTestimonyIds.has(t.id)}
                  tags={t.tags.map((tt) => ({ id: tt.tag.id, name: tt.tag.name }))}
                />
              ))}
            </div>
          </section>
        )}

        {/* Latest Reviews */}
        <section id="latest-reviews" className="mb-12 scroll-mt-20">
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
                avgRating={org.avgRating}
                reviewCount={org.reviewCount}
                status={org.status}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
