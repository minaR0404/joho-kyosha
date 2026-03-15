import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";
import Link from "next/link";
import TagBadge from "@/components/TagBadge";
import { User, Calendar, AlertTriangle, Banknote } from "lucide-react";
import HelpfulButton from "@/components/HelpfulButton";
import DeleteButton from "@/components/DeleteButton";
import ReportButton from "@/components/ReportButton";
import type { Metadata } from "next";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const testimony = await prisma.testimony.findUnique({
    where: { id: Number(id) },
  });
  if (!testimony || testimony.deletedAt) return {};
  return {
    title: `${testimony.title} - 体験談`,
    description: testimony.body.slice(0, 160),
  };
}

export default async function TestimonyDetailPage({ params }: Props) {
  const { id } = await params;

  const testimony = await prisma.testimony.findUnique({
    where: { id: Number(id) },
    include: {
      user: { select: { id: true, displayName: true } },
      category: { select: { slug: true, name: true } },
      tags: { include: { tag: true } },
    },
  });

  if (!testimony || testimony.deletedAt || testimony.status !== "PUBLISHED") notFound();

  const session = await auth();
  const userId = session?.user?.id ? Number(session.user.id) : null;
  const isOwner = userId === testimony.user.id;
  const userVoted = userId
    ? !!(await prisma.testimonyVote.findUnique({
        where: { testimonyId_userId: { testimonyId: testimony.id, userId } },
      }))
    : false;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600">トップ</Link>
        {" > "}
        <Link href="/testimonies" className="hover:text-blue-600">体験談一覧</Link>
        {" > "}
        <span className="text-gray-900">体験談詳細</span>
      </nav>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {/* Header */}
        <div className="mb-4">
          <span className="inline-block text-xs px-2 py-0.5 bg-orange-50 text-orange-700 border border-orange-200 rounded mb-2">
            体験談
          </span>
          <h1 className="text-xl font-bold text-gray-900">{testimony.title}</h1>
        </div>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
          <span className="inline-flex items-center gap-1">
            <User className="w-4 h-4" />
            {testimony.isAnonymous ? (
              <span className="font-medium text-gray-700">匿名</span>
            ) : (
              <Link href={`/user/${testimony.user.id}`} className="font-medium text-gray-700 hover:text-blue-600 hover:underline">
                {testimony.user.displayName}
              </Link>
            )}
          </span>
          <span className="inline-flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {testimony.createdAt.toLocaleDateString("ja-JP")}
          </span>
          <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">{testimony.category.name}</span>
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          {testimony.scamType && (
            <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-gray-500">被害の種類</p>
                <p className="text-sm font-medium text-gray-900">{testimony.scamType}</p>
              </div>
            </div>
          )}
          {testimony.damageAmount && (
            <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
              <Banknote className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-gray-500">被害額</p>
                <p className="text-sm font-medium text-gray-900">{testimony.damageAmount}</p>
              </div>
            </div>
          )}
          {testimony.period && (
            <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
              <Calendar className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-gray-500">被害時期</p>
                <p className="text-sm font-medium text-gray-900">{testimony.period}</p>
              </div>
            </div>
          )}
        </div>

        {/* Body */}
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap mb-6">
          {testimony.body}
        </p>

        {/* Tags */}
        {testimony.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {testimony.tags.map((tt) => (
              <TagBadge key={tt.tag.id} name={tt.tag.name} />
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3 border-t border-gray-100 pt-4">
          <HelpfulButton
            testimonyId={testimony.id}
            initialCount={testimony.helpfulCount}
            initialVoted={userVoted}
            size="md"
          />
          {isOwner && (
            <DeleteButton
              apiEndpoint={`/api/testimonies/${testimony.id}`}
              redirectTo="/testimonies"
            />
          )}
          <div className="ml-auto">
            <ReportButton targetType="TESTIMONY" targetId={testimony.id} />
          </div>
        </div>

        <p className="text-xs text-gray-400 mt-4">
          ※ この体験談は投稿者個人の経験に基づくものです。
        </p>
      </div>
    </div>
  );
}
