import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";
import Link from "next/link";
import OrgCard from "@/components/OrgCard";
import TestimonyCard from "@/components/TestimonyCard";
import { getCategoryIcon } from "@/lib/category-config";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ tab?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) return {};
  return {
    title: `${category.name}の体験談・口コミ・評判一覧`,
    description: `${category.name}に関する体験談・口コミ・評判をチェック。騙される前にまず確認しよう。`,
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug: rawSlug } = await params;
  const { tab } = await searchParams;
  const slug = decodeURIComponent(rawSlug);
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) notFound();

  const activeTab = tab === "orgs" ? "orgs" : "testimonies";

  const [orgs, testimonies] = await Promise.all([
    prisma.organization.findMany({
      where: { categoryId: category.id, status: { not: "DELETED" }, approvalStatus: "APPROVED" },
      orderBy: { reviewCount: "desc" },
      include: { category: true },
    }),
    prisma.testimony.findMany({
      where: { categoryId: category.id, deletedAt: null, status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, displayName: true } },
        category: { select: { slug: true, name: true } },
        tags: { include: { tag: true } },
        org: { select: { name: true, slug: true } },
      },
    }),
  ]);

  const session = await auth();
  const userId = session?.user?.id ? Number(session.user.id) : null;

  const votedIds = new Set<number>();
  if (userId && testimonies.length > 0) {
    const votes = await prisma.testimonyVote.findMany({
      where: { userId, testimonyId: { in: testimonies.map((t) => t.id) }, value: 1 },
      select: { testimonyId: true },
    });
    votes.forEach((v) => votedIds.add(v.testimonyId));
  }

  const tabClass = (isActive: boolean) =>
    `px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
      isActive
        ? "border-blue-600 text-blue-600"
        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
    }`;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          {(() => { const Icon = getCategoryIcon(slug); return <Icon className="w-8 h-8 text-blue-600" strokeWidth={1.5} />; })()}
          <h1 className="text-2xl font-bold text-gray-900">{category.name}</h1>
        </div>
        <p className="text-gray-600">
          {category.name}に関する体験談・口コミ・評判
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200 mb-6">
        <Link href={`/category/${slug}?tab=testimonies`} className={tabClass(activeTab === "testimonies")}>
          体験談（{testimonies.length}）
        </Link>
        <Link href={`/category/${slug}?tab=orgs`} className={tabClass(activeTab === "orgs")}>
          組織（{orgs.length}）
        </Link>
      </div>

      {activeTab === "testimonies" ? (
        testimonies.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <p className="text-lg mb-2">まだ体験談がありません</p>
            <Link href="/testimony/new" className="text-blue-600 hover:underline">
              最初の体験談を投稿する
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {testimonies.map((t) => (
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
                userVoted={votedIds.has(t.id)}
                tags={t.tags.map((tt) => ({ id: tt.tag.id, name: tt.tag.name }))}
              />
            ))}
          </div>
        )
      ) : (
        orgs.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <p className="text-lg mb-2">まだ登録がありません</p>
            <a href="/org/new" className="text-blue-600 hover:underline">
              最初の組織を登録する
            </a>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {orgs.map((org) => (
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
            <div className="text-center mt-8">
              <a href="/org/new" className="text-blue-600 hover:underline text-sm">
                新しい組織・商材を登録する
              </a>
            </div>
          </>
        )
      )}
    </div>
  );
}
