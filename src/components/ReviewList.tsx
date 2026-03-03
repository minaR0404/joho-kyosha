"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MoreVertical, Trash2 } from "lucide-react";
import { getRatingBgColor } from "@/lib/utils";
import HelpfulButton from "./HelpfulButton";

const PER_PAGE = 5;

interface Review {
  id: number;
  title: string;
  body: string;
  ratingOverall: number;
  helpfulCount: number;
  createdAt: string;
  org: { slug: string; name: string; category: { slug: string; name: string } };
  userVoted?: boolean;
}

export default function ReviewList({ reviews: initialReviews }: { reviews: Review[] }) {
  const router = useRouter();
  const [reviews, setReviews] = useState(initialReviews);
  const [visibleCount, setVisibleCount] = useState(PER_PAGE);
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);
  const [confirmingId, setConfirmingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const visible = reviews.slice(0, visibleCount);
  const hasMore = visibleCount < reviews.length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpenId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDelete = async (reviewId: number) => {
    setDeletingId(reviewId);
    try {
      const res = await fetch(`/api/reviews/${reviewId}`, { method: "DELETE" });
      if (res.ok) {
        setReviews((prev) => prev.filter((r) => r.id !== reviewId));
        setConfirmingId(null);
        setMenuOpenId(null);
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "削除に失敗しました");
      }
    } catch {
      alert("通信エラーが発生しました");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <div className="space-y-4">
        {visible.map((review) => (
          <div
            key={review.id}
            className="relative bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500 mb-1">
                  <Link
                    href={`/category/${review.org.category.slug}`}
                    className="relative z-10 hover:text-blue-600 hover:underline"
                  >
                    {review.org.category.name}
                  </Link>
                  {" "}&gt;{" "}
                  <Link
                    href={`/org/${review.org.slug}`}
                    className="relative z-10 text-blue-600 hover:underline"
                  >
                    {review.org.name}
                  </Link>
                </p>
                <h3 className="font-medium text-gray-900 truncate">
                  <Link
                    href={`/org/${review.org.slug}/review/${review.id}`}
                    className="after:absolute after:inset-0"
                  >
                    {review.title}
                  </Link>
                </h3>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{review.body}</p>
                <div className="relative z-10 flex items-center gap-3 mt-2">
                  <p className="text-xs text-gray-400">
                    {new Date(review.createdAt).toLocaleDateString("ja-JP")}
                  </p>
                  <HelpfulButton
                    reviewId={review.id}
                    initialCount={review.helpfulCount}
                    initialVoted={review.userVoted ?? false}
                  />
                </div>
              </div>
              <div className="flex items-start gap-2 shrink-0">
                <span className={`text-sm font-bold px-2 py-1 rounded ${getRatingBgColor(review.ratingOverall)}`}>
                  {review.ratingOverall.toFixed(1)}
                </span>
                <div className="relative z-10" ref={menuOpenId === review.id ? menuRef : null}>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setMenuOpenId(menuOpenId === review.id ? null : review.id);
                      setConfirmingId(null);
                    }}
                    className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors cursor-pointer"
                    aria-label="メニュー"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                  {menuOpenId === review.id && (
                    <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[120px]">
                      {confirmingId === review.id ? (
                        <div className="px-3 py-2">
                          <p className="text-xs text-red-600 mb-2">本当に削除しますか？</p>
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDelete(review.id); }}
                              disabled={deletingId === review.id}
                              className="text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 cursor-pointer"
                            >
                              {deletingId === review.id ? "削除中..." : "削除"}
                            </button>
                            <button
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setConfirmingId(null); }}
                              className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 cursor-pointer"
                            >
                              戻る
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setConfirmingId(review.id); }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          削除
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {hasMore && (
        <div className="text-center mt-6">
          <button
            onClick={() => setVisibleCount((c) => c + PER_PAGE)}
            className="px-6 py-2 text-sm text-blue-700 border border-blue-300 rounded-md hover:bg-blue-50 transition-colors cursor-pointer"
          >
            もっと見る（残り{reviews.length - visibleCount}件）
          </button>
        </div>
      )}
    </>
  );
}
