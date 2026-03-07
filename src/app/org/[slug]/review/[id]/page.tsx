import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";
import Link from "next/link";
import { RatingIconsDisplay } from "@/components/RatingIcons";
import RatingRadar from "@/components/RatingRadar";
import RatingBadge from "@/components/RatingBadge";
import { getRatingTextColor } from "@/lib/utils";
import TagBadge from "@/components/TagBadge";
import { User, Calendar } from "lucide-react";
import HelpfulButton from "@/components/HelpfulButton";
import ReviewDeleteButton from "@/components/ReviewDeleteButton";
import ReportButton from "@/components/ReportButton";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string; id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, id } = await params;
  const review = await prisma.review.findUnique({
    where: { id: Number(id) },
    include: { org: { select: { slug: true, name: true } } },
  });
  if (!review || review.org.slug !== decodeURIComponent(slug)) return {};
  return {
    title: `${review.title} - ${review.org.name}の口コミ`,
    description: review.body.slice(0, 160),
  };
}

export default async function ReviewDetailPage({ params }: Props) {
  const { slug: rawSlug, id } = await params;
  const slug = decodeURIComponent(rawSlug);

  const review = await prisma.review.findUnique({
    where: { id: Number(id) },
    include: {
      org: {
        include: { category: true },
      },
      user: { select: { id: true, displayName: true } },
      tags: { include: { tag: true } },
    },
  });

  if (!review || review.deletedAt || review.org.slug !== slug) notFound();

  const session = await auth();
  const userId = session?.user?.id ? Number(session.user.id) : null;
  const isOwner = userId === review.user.id;
  const userVoted = userId
    ? !!(await prisma.reviewVote.findUnique({
        where: { reviewId_userId: { reviewId: review.id, userId } },
      }))
    : false;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600">トップ</Link>
        {" > "}
        <Link href={`/category/${review.org.category.slug}`} className="hover:text-blue-600">
          {review.org.category.name}
        </Link>
        {" > "}
        <Link href={`/org/${review.org.slug}`} className="hover:text-blue-600">
          {review.org.name}
        </Link>
        {" > "}
        <span className="text-gray-900">口コミ詳細</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-2.5">
              <h1 className="text-xl font-bold text-gray-900 mt-1">{review.title}</h1>
              <div className="flex items-center gap-2 shrink-0 mt-1">
                <RatingIconsDisplay rating={review.ratingOverall} size="md" />
                <span className="text-lg font-bold text-gray-700">
                  {review.ratingOverall.toFixed(1)}
                </span>
              </div>
            </div>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-8 pl-1.5">
              <span className="inline-flex items-center gap-1">
                <User className="w-4.5 h-4.5" />
                {review.isAnonymous ? (
                  <span className="font-medium text-gray-700">匿名</span>
                ) : (
                  <Link href={`/user/${review.user.id}`} className="font-medium text-gray-700 hover:text-blue-600 hover:underline">
                    {review.user.displayName}
                  </Link>
                )}
              </span>
              <span className="inline-flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {review.createdAt.toLocaleDateString("ja-JP")}
              </span>
              <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">{review.relationship}</span>
              {review.period && <span className="text-gray-400">関わった時期: {review.period}</span>}
            </div>

            {/* Body */}
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap mb-6">
              {review.body}
            </p>

            {/* Tags */}
            {review.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-4">
                {review.tags.map((rt) => (
                  <TagBadge key={rt.tag.id} name={rt.tag.name} />
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3 border-t border-gray-100 pt-4">
              <HelpfulButton
                reviewId={review.id}
                initialCount={review.helpfulCount}
                initialVoted={userVoted}
                size="md"
              />
              {isOwner && (
                <ReviewDeleteButton
                  reviewId={review.id}
                  redirectTo={`/org/${review.org.slug}`}
                />
              )}
              <div className="ml-auto">
                <ReportButton targetType="REVIEW" targetId={review.id} />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          {/* Rating Radar */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="font-bold text-gray-900 mb-3">評価レーダー</h3>
            <RatingRadar
              ratingDanger={review.ratingDanger}
              ratingCost={review.ratingCost}
              ratingPressure={review.ratingPressure}
              ratingTransparency={review.ratingTransparency}
              ratingExit={review.ratingExit}
            />
            <div className="mt-3 text-sm max-w-[260px] mx-auto">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">危険度</span>
                  <span className="font-medium">{review.ratingDanger.toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">金銭的リスク</span>
                  <span className="font-medium">{review.ratingCost.toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">勧誘の強さ</span>
                  <span className="font-medium">{review.ratingPressure.toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">情報の不透明さ</span>
                  <span className="font-medium">{review.ratingTransparency.toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">解約・脱退の難しさ</span>
                  <span className="font-medium">{review.ratingExit.toFixed(1)}</span>
                </div>
              </div>
              <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between items-center">
                <span className="font-bold text-gray-700">総合スコア</span>
                <span className={`text-lg font-bold ${getRatingTextColor(review.ratingOverall)}`}>{review.ratingOverall.toFixed(1)}</span>
              </div>
            </div>
          </div>

          {/* Org Info */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="font-bold text-gray-900 mb-2">{review.org.name}</h3>
            <p className="text-xs text-gray-500 mb-3">{review.org.category.name}</p>
            {review.org.reviewCount > 0 && (
              <div className="mb-3">
                <RatingBadge rating={review.org.avgRating} />
                <span className="text-xs text-gray-500 ml-2">{review.org.reviewCount}件の口コミ</span>
              </div>
            )}
            <Link
              href={`/org/${review.org.slug}`}
              className="text-sm text-blue-600 hover:underline"
            >
              組織ページを見る →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
