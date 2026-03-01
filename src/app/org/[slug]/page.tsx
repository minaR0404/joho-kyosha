import { prisma } from "@/lib/prisma";
import { auth, isAdmin } from "@/lib/auth";
import { notFound } from "next/navigation";
import Link from "next/link";
import RatingBadge from "@/components/RatingBadge";
import RatingRadar from "@/components/RatingRadar";
import ReviewCard from "@/components/ReviewCard";
import TagBadge from "@/components/TagBadge";
import AdminDeleteButton from "@/components/AdminDeleteButton";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  const org = await prisma.organization.findUnique({ where: { slug } });
  if (!org) return {};
  return {
    title: `${org.name}の口コミ・評判`,
    description: `${org.name}の口コミ・評判をチェック。${org.description || ""}`,
  };
}

export default async function OrgDetailPage({ params }: Props) {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  const org = await prisma.organization.findUnique({
    where: { slug },
    include: {
      category: true,
      tags: { include: { tag: true } },
      reviews: {
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { id: true, displayName: true, image: true } },
        },
      },
    },
  });

  if (!org) notFound();

  const session = await auth();
  const admin = isAdmin(session?.user?.email);

  // Calculate average ratings per axis
  const avgRatings = org.reviews.length > 0
    ? {
        ratingDanger: org.reviews.reduce((s, r) => s + r.ratingDanger, 0) / org.reviews.length,
        ratingCost: org.reviews.reduce((s, r) => s + r.ratingCost, 0) / org.reviews.length,
        ratingPressure: org.reviews.reduce((s, r) => s + r.ratingPressure, 0) / org.reviews.length,
        ratingTransparency: org.reviews.reduce((s, r) => s + r.ratingTransparency, 0) / org.reviews.length,
        ratingExit: org.reviews.reduce((s, r) => s + r.ratingExit, 0) / org.reviews.length,
      }
    : null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600">トップ</Link>
        {" > "}
        <Link href={`/category/${org.category.slug}`} className="hover:text-blue-600">
          {org.category.name}
        </Link>
        {" > "}
        <span className="text-gray-900">{org.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Organization Header */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{org.name}</h1>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                    {org.category.name}
                  </span>
                  {org.status === "CLOSED" && (
                    <span className="text-xs px-2 py-0.5 bg-gray-200 text-gray-500 rounded">閉鎖</span>
                  )}
                </div>
                {org.description && (
                  <p className="text-gray-700 leading-relaxed mb-3">{org.description}</p>
                )}
                {org.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {org.tags.map(({ tag }) => (
                      <TagBadge key={tag.id} name={tag.name} />
                    ))}
                  </div>
                )}
              </div>
              {org.reviewCount > 0 && (
                <div className="flex-shrink-0">
                  <RatingBadge rating={org.avgRating} />
                </div>
              )}
            </div>

            {/* Org Details */}
            <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-100 text-sm">
              {org.representative && (
                <div><span className="text-gray-500">代表者:</span> {org.representative}</div>
              )}
              {org.founded && (
                <div><span className="text-gray-500">設立:</span> {org.founded}</div>
              )}
              {org.website && (
                <div>
                  <span className="text-gray-500">公式サイト:</span>{" "}
                  <a href={org.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    リンク
                  </a>
                </div>
              )}
              {org.address && (
                <div><span className="text-gray-500">所在地:</span> {org.address}</div>
              )}
            </div>
            {admin && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <AdminDeleteButton orgId={org.id} />
              </div>
            )}
          </div>

          {/* Reviews */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">
              口コミ ({org.reviews.length}件)
            </h2>
            <Link
              href={`/org/${org.slug}/review`}
              className="px-4 py-2 bg-blue-700 text-white text-sm rounded-md hover:bg-blue-800 transition-colors"
            >
              口コミを書く
            </Link>
          </div>

          {org.reviews.length === 0 ? (
            <div className="text-center py-12 text-gray-500 bg-white rounded-lg border border-gray-200">
              <p className="mb-2">まだ口コミがありません</p>
              <Link href={`/org/${org.slug}/review`} className="text-blue-600 hover:underline">
                最初の口コミを書く
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {org.reviews.map((review) => (
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
                />
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {avgRatings && (
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4 sticky top-20">
              <h3 className="font-bold text-gray-900 mb-3">評価レーダー</h3>
              <RatingRadar {...avgRatings} />
              <div className="space-y-2 mt-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">危険度</span>
                  <span className="font-medium">{avgRatings.ratingDanger.toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">金銭的リスク</span>
                  <span className="font-medium">{avgRatings.ratingCost.toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">勧誘の強さ</span>
                  <span className="font-medium">{avgRatings.ratingPressure.toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">情報の不透明さ</span>
                  <span className="font-medium">{avgRatings.ratingTransparency.toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">脱退の難しさ</span>
                  <span className="font-medium">{avgRatings.ratingExit.toFixed(1)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
