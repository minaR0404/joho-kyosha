import { prisma } from "@/lib/prisma";
import { auth, isAdmin } from "@/lib/auth";
import { notFound } from "next/navigation";
import Link from "next/link";
import PostCard from "@/components/PostCard";
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
    title: `${org.name}の投稿・評判`,
    description: `${org.name}の投稿・評判をチェック。${org.description || ""}`,
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
      posts: {
        where: { deletedAt: null, status: "PUBLISHED" },
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { id: true, displayName: true } },
          category: { select: { name: true } },
          tags: { include: { tag: true } },
        },
      },
    },
  });

  const session = await auth();
  const admin = isAdmin(session?.user?.role);

  if (!org || (org.status === "DELETED" && !admin)) notFound();

  // Fetch user's existing votes
  const userId = session?.user?.id ? Number(session.user.id) : null;
  const userVotes = userId
    ? await prisma.postVote.findMany({
        where: { userId, postId: { in: org.posts.map((p) => p.id) }, value: 1 },
        select: { postId: true },
      })
    : [];
  const votedPostIds = new Set(userVotes.map((v) => v.postId));

  // Aggregate post tags
  const postTagCounts: Record<string, { name: string; count: number }> = {};
  for (const post of org.posts) {
    for (const pt of post.tags) {
      const key = String(pt.tagId);
      if (!postTagCounts[key]) {
        postTagCounts[key] = { name: pt.tag.name, count: 0 };
      }
      postTagCounts[key].count++;
    }
  }
  const aggregatedTags = Object.values(postTagCounts).sort((a, b) => b.count - a.count);

  // Stats: damage amounts
  const damageAmounts = org.posts
    .map((p) => p.damageAmount)
    .filter((d): d is string => d !== null);

  // Stats: scam types
  const scamTypeCounts: Record<string, number> = {};
  for (const post of org.posts) {
    if (post.scamType) {
      scamTypeCounts[post.scamType] = (scamTypeCounts[post.scamType] || 0) + 1;
    }
  }
  const topScamTypes = Object.entries(scamTypeCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

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
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{org.name}</h1>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                {org.category.name}
              </span>
              {org.status === "CLOSED" && (
                <span className="text-xs px-2 py-0.5 bg-gray-200 text-gray-500 rounded">閉鎖</span>
              )}
              <span className="text-xs text-gray-500">投稿 {org.posts.length}件</span>
            </div>
            {org.description && (
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3">{org.description}</p>
            )}
            {(aggregatedTags.length > 0 || org.tags.length > 0) && (
              <div className="flex flex-wrap gap-1">
                {aggregatedTags.slice(0, 5).map((t) => (
                  <TagBadge key={`post-${t.name}`} name={t.name} />
                ))}
                {org.tags
                  .filter(({ tag }) => !postTagCounts[String(tag.id)])
                  .map(({ tag }) => (
                    <TagBadge key={`org-${tag.id}`} name={tag.name} />
                  ))}
              </div>
            )}

            {/* Org Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mt-4 pt-4 border-t border-gray-100 text-sm">
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

          <p className="text-xs text-gray-400 mb-4 px-1">
            ※ 掲載情報はユーザーの投稿に基づいています。当サイトは特定の組織を誹謗中傷する目的で運営しているものではありません。
          </p>

          {/* Posts */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">
              投稿 ({org.posts.length}件)
            </h2>
            <Link
              href={`/org/${org.slug}/post`}
              className="px-4 py-2 bg-blue-700 text-white text-sm rounded-md hover:bg-blue-800 transition-colors"
            >
              投稿する
            </Link>
          </div>

          {org.posts.length === 0 ? (
            <div className="text-center py-12 text-gray-500 bg-white rounded-lg border border-gray-200">
              <p className="mb-2">まだ投稿がありません</p>
              <Link href={`/org/${org.slug}/post`} className="text-blue-600 hover:underline">
                最初の投稿をする
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {org.posts.map((post) => (
                <PostCard
                  key={post.id}
                  postId={post.id}
                  title={post.title}
                  body={post.body}
                  categoryName={post.category.name}
                  scamType={post.scamType}
                  damageAmount={post.damageAmount}
                  period={post.period}
                  relationship={post.relationship}
                  isAnonymous={post.isAnonymous}
                  displayName={post.user.displayName}
                  userId={post.user.id}
                  helpfulCount={post.helpfulCount}
                  createdAt={post.createdAt.toISOString()}
                  userVoted={votedPostIds.has(post.id)}
                  tags={post.tags.map((pt) => ({ id: pt.tag.id, name: pt.tag.name }))}
                />
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-4 sticky top-20">
            <h3 className="font-bold text-gray-900 mb-3">投稿統計</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">投稿数</span>
                <span className="font-bold text-gray-900">{org.posts.length}件</span>
              </div>
              {damageAmounts.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">被害報告数</span>
                  <span className="font-bold text-red-600">{damageAmounts.length}件</span>
                </div>
              )}
              {topScamTypes.length > 0 && (
                <div className="border-t border-gray-100 pt-3">
                  <p className="text-gray-600 mb-2">よく報告される被害</p>
                  <div className="space-y-1">
                    {topScamTypes.map(([type, count]) => (
                      <div key={type} className="flex justify-between text-xs">
                        <span className="text-gray-700 truncate mr-2">{type}</span>
                        <span className="text-gray-500 shrink-0">{count}件</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {damageAmounts.length > 0 && (
                <div className="border-t border-gray-100 pt-3">
                  <p className="text-gray-600 mb-2">報告された被害額</p>
                  <div className="space-y-1">
                    {damageAmounts.slice(0, 5).map((amount, i) => (
                      <span key={i} className="inline-block text-xs px-2 py-0.5 bg-red-50 text-red-700 rounded mr-1 mb-1">
                        {amount}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
