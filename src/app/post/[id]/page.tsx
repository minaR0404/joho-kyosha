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
  const post = await prisma.post.findUnique({
    where: { id: Number(id) },
  });
  if (!post || post.deletedAt) return {};
  return {
    title: `${post.title} - 投稿`,
    description: post.body.slice(0, 160),
  };
}

export default async function PostDetailPage({ params }: Props) {
  const { id } = await params;

  const post = await prisma.post.findUnique({
    where: { id: Number(id) },
    include: {
      user: { select: { id: true, displayName: true } },
      category: { select: { slug: true, name: true } },
      org: { select: { slug: true, name: true, postCount: true, category: { select: { name: true } } } },
      tags: { include: { tag: true } },
    },
  });

  if (!post || post.deletedAt || post.status !== "PUBLISHED") notFound();

  const session = await auth();
  const userId = session?.user?.id ? Number(session.user.id) : null;
  const isOwner = userId === post.user.id;
  const userVoted = userId
    ? !!(await prisma.postVote.findUnique({
        where: { postId_userId: { postId: post.id, userId } },
      }))
    : false;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600">トップ</Link>
        {" > "}
        <Link href={`/category/${post.category.slug}`} className="hover:text-blue-600">
          {post.category.name}
        </Link>
        {post.org && (
          <>
            {" > "}
            <Link href={`/org/${post.org.slug}`} className="hover:text-blue-600">
              {post.org.name}
            </Link>
          </>
        )}
        {" > "}
        <span className="text-gray-900">投稿詳細</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            {/* Header */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                  {post.category.name}
                </span>
                {post.relationship && (
                  <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 border border-blue-200 rounded">
                    {post.relationship}
                  </span>
                )}
              </div>
              <h1 className="text-xl font-bold text-gray-900">{post.title}</h1>
            </div>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
              <span className="inline-flex items-center gap-1">
                <User className="w-4 h-4" />
                {post.isAnonymous ? (
                  <span className="font-medium text-gray-700">匿名</span>
                ) : (
                  <Link href={`/user/${post.user.id}`} className="font-medium text-gray-700 hover:text-blue-600 hover:underline">
                    {post.user.displayName}
                  </Link>
                )}
              </span>
              <span className="inline-flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {post.createdAt.toLocaleDateString("ja-JP")}
              </span>
            </div>

            {/* Info cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              {post.scamType && (
                <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                  <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">被害の種類</p>
                    <p className="text-sm font-medium text-gray-900">{post.scamType}</p>
                  </div>
                </div>
              )}
              {post.damageAmount && (
                <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                  <Banknote className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">被害額</p>
                    <p className="text-sm font-medium text-gray-900">{post.damageAmount}</p>
                  </div>
                </div>
              )}
              {post.period && (
                <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">被害時期</p>
                    <p className="text-sm font-medium text-gray-900">{post.period}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Body */}
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap mb-6">
              {post.body}
            </p>

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-4">
                {post.tags.map((pt) => (
                  <TagBadge key={pt.tag.id} name={pt.tag.name} />
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3 border-t border-gray-100 pt-4">
              <HelpfulButton
                postId={post.id}
                initialCount={post.helpfulCount}
                initialVoted={userVoted}
                size="md"
              />
              {isOwner && (
                <DeleteButton
                  apiEndpoint={`/api/posts/${post.id}`}
                  redirectTo="/posts"
                />
              )}
              <div className="ml-auto">
                <ReportButton targetType="POST" targetId={post.id} />
              </div>
            </div>

            <p className="text-xs text-gray-400 mt-4">
              ※ この投稿は投稿者個人の経験に基づくものです。
            </p>
          </div>
        </div>

        {/* Sidebar */}
        {post.org && (
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-4 sticky top-20">
              <h3 className="font-bold text-gray-900 mb-2">{post.org.name}</h3>
              <p className="text-xs text-gray-500 mb-3">{post.org.category.name}</p>
              {post.org.postCount > 0 && (
                <p className="text-sm text-gray-600 mb-3">投稿 {post.org.postCount}件</p>
              )}
              <Link
                href={`/org/${post.org.slug}`}
                className="text-sm text-blue-600 hover:underline"
              >
                組織ページを見る →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
