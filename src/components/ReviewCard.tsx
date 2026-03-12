"use client";

import { useRef, useState, useEffect } from "react";
import { User, Calendar } from "lucide-react";
import { RatingIconsDisplay } from "./RatingIcons";
import HelpfulButton from "./HelpfulButton";

interface ReviewCardProps {
  title: string;
  body: string;
  ratingOverall: number;
  ratingDanger: number;
  ratingCost: number;
  ratingPressure: number;
  ratingTransparency: number;
  ratingExit: number;
  relationship: string;
  period: string | null;
  isAnonymous: boolean;
  displayName: string;
  helpfulCount: number;
  createdAt: string;
  orgName?: string;
  orgSlug?: string;
  reviewId?: number;
  userId?: number;
  userVoted?: boolean;
}

export default function ReviewCard({
  title,
  body,
  ratingOverall,
  relationship,
  period,
  isAnonymous,
  displayName,
  helpfulCount,
  createdAt,
  orgName,
  orgSlug,
  reviewId,
  userId,
  userVoted = false,
}: ReviewCardProps) {
  const href = reviewId != null && orgSlug ? `/org/${orgSlug}/review/${reviewId}` : undefined;
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const [isClamped, setIsClamped] = useState(false);

  useEffect(() => {
    const el = bodyRef.current;
    if (el) {
      setIsClamped(el.scrollHeight > el.clientHeight);
    }
  }, [body]);

  return (
    <div className="relative bg-white rounded-lg border border-gray-200 p-5 pb-3 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          {orgName && orgSlug && (
            <a
              href={`/org/${orgSlug}`}
              className="relative z-10 block text-sm text-blue-600 mb-0.5 hover:underline"
            >
              {orgName}
            </a>
          )}
          {href ? (
            <h4 className="font-bold text-gray-900">
              <a href={href} className="after:absolute after:inset-0">
                {title}
              </a>
            </h4>
          ) : (
            <h4 className="font-bold text-gray-900">{title}</h4>
          )}
        </div>
        <div className="flex-shrink-0 flex items-center gap-2">
          <RatingIconsDisplay rating={ratingOverall} />
          <span className="text-sm font-bold text-gray-700">
            {ratingOverall.toFixed(1)}
          </span>
        </div>
      </div>

      <div className="relative z-10 flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-gray-500 mb-3 pointer-events-none">
        <span className="inline-flex items-center gap-0.5">
          <User className="w-3.5 h-3.5" />
          {!isAnonymous && userId ? (
            <a href={`/user/${userId}`} className="pointer-events-auto hover:text-blue-600 hover:underline">{displayName}</a>
          ) : (
            <span>{isAnonymous ? "匿名" : displayName}</span>
          )}
        </span>
        <span className="inline-flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" />
          {new Date(createdAt).toLocaleDateString("ja-JP")}
        </span>
        <span className="px-2 py-0.5 bg-gray-100 rounded">{relationship}</span>
        {period && <span className="hidden sm:inline">関わった時期: {period}</span>}
      </div>

      <div className="relative mb-3 pointer-events-none">
        <p ref={bodyRef} className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap max-h-[5em] overflow-hidden">
          {body}
        </p>
        {isClamped && (
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent" />
        )}
      </div>

      {reviewId != null && (
        <div className="relative z-10 border-t border-gray-100 pt-3 pointer-events-none">
          <span className="pointer-events-auto">
            <HelpfulButton reviewId={reviewId} initialCount={helpfulCount} initialVoted={userVoted} />
          </span>
        </div>
      )}
    </div>
  );
}
