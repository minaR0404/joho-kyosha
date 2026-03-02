import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { MessageSquare, ThumbsUp, Calendar } from "lucide-react";
import AccountSettings from "@/components/AccountSettings";
import ReviewList from "@/components/ReviewList";
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
      {/* Profile */}
      <div className="bg-white border border-gray-200 rounded-lg p-8 mb-4 flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-3xl font-bold mb-3">
          {user.displayName.charAt(0)}
        </div>
        <h1 className="text-xl font-bold text-gray-900">{user.displayName}</h1>
        <p className="text-sm text-gray-500 mt-1">{user.email}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-5 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
            <MessageSquare className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{user.reviews.length}</p>
            <p className="text-xs text-gray-500">口コミ</p>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-5 flex items-center gap-3">
          <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center shrink-0">
            <ThumbsUp className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{totalHelpful}</p>
            <p className="text-xs text-gray-500">参考になった</p>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-5 flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900">
              {user.createdAt.toLocaleDateString("ja-JP", { year: "numeric", month: "short" })}
            </p>
            <p className="text-xs text-gray-500">登録日</p>
          </div>
        </div>
      </div>

      {/* Settings */}
      <section className="mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4">アカウント設定</h2>
        <AccountSettings currentName={user.displayName} email={user.email || ""} />
      </section>

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
          <ReviewList reviews={JSON.parse(JSON.stringify(user.reviews))} />
        )}
      </section>
    </div>
  );
}
