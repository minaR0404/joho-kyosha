import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import Link from "next/link";
import TagBadge from "@/components/TagBadge";
import HelpfulButton from "@/components/HelpfulButton";
import { User, Calendar, AlertTriangle, Banknote } from "lucide-react";
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
            <div key={t.id} className="relative bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow">
              <div className="mb-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs px-2 py-0.5 bg-orange-50 text-orange-700 border border-orange-200 rounded">
                    体験談
                  </span>
                  <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                    {t.category.name}
                  </span>
                </div>
                <h2 className="font-bold text-gray-900">
                  <Link href={`/testimony/${t.id}`} className="after:absolute after:inset-0">
                    {t.title}
                  </Link>
                </h2>
              </div>

              {/* Info row */}
              <div className="relative z-10 flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-3">
                {t.scamType && (
                  <span className="inline-flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-orange-500" />
                    {t.scamType}
                  </span>
                )}
                {t.damageAmount && (
                  <span className="inline-flex items-center gap-1">
                    <Banknote className="w-3.5 h-3.5 text-red-500" />
                    {t.damageAmount}
                  </span>
                )}
              </div>

              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap max-h-[5em] overflow-hidden mb-3">
                {t.body}
              </p>

              {/* Tags */}
              {t.tags.length > 0 && (
                <div className="relative z-10 flex flex-wrap gap-1 mb-3">
                  {t.tags.map((tt) => (
                    <TagBadge key={tt.tag.id} name={tt.tag.name} />
                  ))}
                </div>
              )}

              {/* Footer */}
              <div className="relative z-10 flex flex-wrap items-center gap-3 text-xs text-gray-500 border-t border-gray-100 pt-3 pointer-events-none">
                <span className="inline-flex items-center gap-0.5">
                  <User className="w-3.5 h-3.5" />
                  {!t.isAnonymous ? (
                    <a href={`/user/${t.user.id}`} className="pointer-events-auto hover:text-blue-600 hover:underline">
                      {t.user.displayName}
                    </a>
                  ) : (
                    <span>匿名</span>
                  )}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {t.createdAt.toLocaleDateString("ja-JP")}
                </span>
                {t.period && <span>被害時期: {t.period}</span>}
                <span className="pointer-events-auto">
                  <HelpfulButton
                    testimonyId={t.id}
                    initialCount={t.helpfulCount}
                    initialVoted={votedIds.has(t.id)}
                  />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
