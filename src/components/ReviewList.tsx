"use client";

import { useState } from "react";
import Link from "next/link";
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
  org: { slug: string; name: string; category: { name: string } };
  userVoted?: boolean;
}

export default function ReviewList({ reviews }: { reviews: Review[] }) {
  const [visibleCount, setVisibleCount] = useState(PER_PAGE);
  const visible = reviews.slice(0, visibleCount);
  const hasMore = visibleCount < reviews.length;

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
                  {review.org.category.name} &gt;{" "}
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
              <span className={`shrink-0 text-sm font-bold px-2 py-1 rounded ${getRatingBgColor(review.ratingOverall)}`}>
                {review.ratingOverall.toFixed(1)}
              </span>
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
