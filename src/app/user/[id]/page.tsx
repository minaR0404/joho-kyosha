import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MessageSquare, ThumbsUp, Calendar } from "lucide-react";
import ReviewCard from "@/components/ReviewCard";
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
      reviews: {
        where: { deletedAt: null, isAnonymous: false },
        orderBy: { createdAt: "desc" },
        include: {
          org: { select: { slug: true, name: true, category: { select: { slug: true, name: true } } } },
          tags: { include: { tag: true } },
        },
      },
    },
  });

  if (!user) notFound();

  const totalHelpful = user.reviews.reduce((sum, r) => sum + r.helpfulCount, 0);

  // Fetch viewer's votes for HelpfulButton
  const session = await auth();
  const viewerId = session?.user?.id ? Number(session.user.id) : null;
  const votedReviewIds = new Set<number>();
  if (viewerId) {
    const votes = await prisma.reviewVote.findMany({
      where: { userId: viewerId, reviewId: { in: user.reviews.map((r) => r.id) }, value: 1 },
      select: { reviewId: true },
    });
    votes.forEach((v) => votedReviewIds.add(v.reviewId));
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
            <p className="text-2xl font-bold text-gray-900">{user.reviews.length}</p>
            <p className="text-xs text-gray-500">口コミ</p>
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

      {/* Reviews */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          投稿した口コミ（{user.reviews.length}件）
        </h2>

        {user.reviews.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">まだ公開口コミはありません</p>
          </div>
        ) : (
          <div className="space-y-4">
            {user.reviews.map((r) => (
              <ReviewCard
                key={r.id}
                reviewId={r.id}
                title={r.title}
                body={r.body}
                ratingOverall={r.ratingOverall}
                ratingDanger={r.ratingDanger}
                ratingCost={r.ratingCost}
                ratingPressure={r.ratingPressure}
                ratingTransparency={r.ratingTransparency}
                ratingExit={r.ratingExit}
                relationship={r.relationship}
                period={r.period}
                isAnonymous={false}
                displayName={user.displayName}
                helpfulCount={r.helpfulCount}
                createdAt={r.createdAt.toISOString()}
                orgName={r.org.name}
                orgSlug={r.org.slug}
                userVoted={votedReviewIds.has(r.id)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
