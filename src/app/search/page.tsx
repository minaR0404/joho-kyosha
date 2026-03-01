import { prisma } from "@/lib/prisma";
import SearchBar from "@/components/SearchBar";
import OrgCard from "@/components/OrgCard";
import type { Metadata } from "next";

type Props = { searchParams: Promise<{ q?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  return { title: q ? `「${q}」の検索結果` : "検索" };
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = q?.trim() || "";

  const orgs = query
    ? await prisma.organization.findMany({
        where: {
          status: { not: "DELETED" },
          OR: [
            { name: { contains: query } },
            { nameKana: { contains: query } },
            { description: { contains: query } },
            { aliases: { contains: query } },
          ],
        },
        orderBy: { reviewCount: "desc" },
        take: 50,
        include: { category: { select: { name: true, slug: true } } },
      })
    : [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">検索</h1>

      <div className="mb-8">
        <SearchBar defaultValue={query} size="md" />
      </div>

      {query ? (
        <>
          <p className="text-gray-600 mb-4">
            「{query}」の検索結果: {orgs.length}件
          </p>
          {orgs.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <p className="text-lg mb-2">該当する組織が見つかりませんでした</p>
              <p className="text-sm">別のキーワードで検索するか、</p>
              <a href="/org/new" className="text-blue-600 hover:underline text-sm">
                新しい組織を登録
              </a>
              <span className="text-sm">してください。</span>
            </div>
          ) : (
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
          )}
        </>
      ) : (
        <div className="text-center py-16 text-gray-500">
          <p>組織名・商材名を入力して検索してください</p>
        </div>
      )}
    </div>
  );
}
