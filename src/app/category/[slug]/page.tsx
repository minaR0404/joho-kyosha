import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import OrgCard from "@/components/OrgCard";
import {
  ShieldAlert,
  Network,
  TrendingUp,
  Monitor,
  Landmark,
  LayoutGrid,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Metadata } from "next";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  "info-products": ShieldAlert,
  mlm: Network,
  investment: TrendingUp,
  "online-salon": Monitor,
  religion: Landmark,
  other: LayoutGrid,
};

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) return {};
  return {
    title: `${category.name}の口コミ・評判一覧`,
    description: `${category.name}に関する口コミ・評判をチェック。騙される前にまず確認しよう。`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) notFound();

  const orgs = await prisma.organization.findMany({
    where: { categoryId: category.id, status: { not: "DELETED" } },
    orderBy: { reviewCount: "desc" },
    include: { category: true },
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          {(() => { const Icon = CATEGORY_ICONS[slug] || LayoutGrid; return <Icon className="w-8 h-8 text-blue-600" strokeWidth={1.5} />; })()}
          <h1 className="text-2xl font-bold text-gray-900">{category.name}</h1>
        </div>
        <p className="text-gray-600">
          {category.name}に関する組織・商材の口コミ・評判一覧（{orgs.length}件）
        </p>
      </div>

      {orgs.length === 0 ? (
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
      )}
    </div>
  );
}
