import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getRatingBgColor } from "@/lib/utils";
import { MessageSquare, ThumbsUp, Calendar } from "lucide-react";
import EditProfileForm from "@/components/EditProfileForm";
import ChangePasswordForm from "@/components/ChangePasswordForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "マイページ",
};

export default async function MyPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login?callbackUrl=/mypage");
  }

  const user = await prisma.user.findUnique({
    where: { id: Number(session.user.id) },
    include: {
      reviews: {
        orderBy: { createdAt: "desc" },
        include: {
          org: { select: { slug: true, name: true, category: { select: { name: true } } } },
        },
      },
    },
  });

  if (!user) redirect("/auth/login");

  const totalHelpful = user.reviews.reduce((sum, r) => sum + r.helpfulCount, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Profile Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-2xl font-bold shrink-0">
            {user.displayName.charAt(0)}
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{user.displayName}</h1>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
              <MessageSquare className="w-4 h-4" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{user.reviews.length}</p>
            <p className="text-xs text-gray-500">口コミ</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
              <ThumbsUp className="w-4 h-4" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{totalHelpful}</p>
            <p className="text-xs text-gray-500">参考になった</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
              <Calendar className="w-4 h-4" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {user.createdAt.toLocaleDateString("ja-JP", { year: "numeric", month: "short" })}
            </p>
            <p className="text-xs text-gray-500">登録</p>
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <EditProfileForm currentName={user.displayName} />
        <ChangePasswordForm />
      </div>

      {/* Reviews */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          投稿した口コミ（{user.reviews.length}件）
        </h2>

        {user.reviews.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500 mb-3">まだ口コミを投稿していません</p>
            <Link href="/" className="text-blue-600 hover:underline text-sm">
              組織を探して口コミを書く
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {user.reviews.map((review) => (
              <Link
                key={review.id}
                href={`/org/${review.org.slug}`}
                className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-500 mb-1">
                      {review.org.category.name} &gt; {review.org.name}
                    </p>
                    <h3 className="font-medium text-gray-900 truncate">{review.title}</h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{review.body}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      {review.createdAt.toLocaleDateString("ja-JP")}
                    </p>
                  </div>
                  <span className={`shrink-0 text-sm font-bold px-2 py-1 rounded ${getRatingBgColor(review.ratingOverall)}`}>
                    {review.ratingOverall.toFixed(1)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
