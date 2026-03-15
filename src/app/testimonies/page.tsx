import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import Link from "next/link";
import TestimonyCard from "@/components/TestimonyCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "体験談一覧",
  description: "組織名がわからない被害体験や、個人による詐欺被害の体験談を読めます。",
};

export default async function TestimoniesPage() {
  const testimonies = await prisma.testimony.findMany({
    where: { deletedAt: null, status: "PUBLISHED" },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      user: { select: { id: true, displayName: true } },
      category: { select: { slug: true, name: true } },
      tags: { include: { tag: true } },
      org: { select: { name: true, slug: true } },
    },
  });

  const session = await auth();
  const userId = session?.user?.id ? Number(session.user.id) : null;

  const votedIds = new Set<number>();
  if (userId) {
    const votes = await prisma.testimonyVote.findMany({
      where: { userId, testimonyId: { in: testimonies.map((t) => t.id) }, value: 1 },
      select: { testimonyId: true },
    });
    votes.forEach((v) => votedIds.add(v.testimonyId));
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">体験談</h1>
          <p className="text-gray-600 mt-1">
            組織名がわからない被害体験や、個人による詐欺被害の体験談
          </p>
        </div>
        <Link
          href="/testimony/new"
          className="px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition-colors text-sm font-medium shrink-0"
        >
          体験談を投稿
        </Link>
      </div>

      {testimonies.length === 0 ? (
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
      )}
    </div>
  );
}
