"use client";

import { useRef, useState, useEffect } from "react";
import { User, Calendar } from "lucide-react";
import HelpfulButton from "./HelpfulButton";

interface PostCardProps {
  postId: number;
  title: string;
  body: string;
  categoryName: string;
  period: string | null;
  relationship: string | null;
  isAnonymous: boolean;
  displayName: string;
  userId: number;
  helpfulCount: number;
  createdAt: string;
  orgName?: string | null;
  orgSlug?: string | null;
  userVoted?: boolean;
}

export default function PostCard({
  postId,
  title,
  body,
  categoryName,
  period,
  relationship,
  isAnonymous,
  displayName,
  userId,
  helpfulCount,
  createdAt,
  orgName,
  orgSlug,
  userVoted = false,
}: PostCardProps) {
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
      <div className="mb-3">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
            {categoryName}
          </span>
          {relationship && (
            <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 border border-blue-200 rounded">
              {relationship}
            </span>
          )}
          {orgName && orgSlug && (
            <a
              href={`/org/${orgSlug}`}
              className="relative z-10 text-xs px-2 py-0.5 bg-orange-50 text-orange-600 border border-orange-200 rounded hover:bg-orange-100 transition-colors"
            >
              {orgName}
            </a>
          )}
        </div>
        <h4 className="font-bold text-gray-900">
          <a href={`/post/${postId}`} className="after:absolute after:inset-0">
            {title}
          </a>
        </h4>
      </div>

      <div className="relative mb-3 pointer-events-none">
        <p ref={bodyRef} className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap max-h-[5em] overflow-hidden">
          {body.replace(/\n{2,}/g, "\n")}
        </p>
        {isClamped && (
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent" />
        )}
      </div>

      {/* Footer */}
      <div className="relative z-10 flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-gray-500 border-t border-gray-100 pt-3 pointer-events-none">
        <span className="inline-flex items-center gap-0.5">
          <User className="w-3.5 h-3.5" />
          {!isAnonymous ? (
            <a href={`/user/${userId}`} className="pointer-events-auto hover:text-blue-600 hover:underline">
              {displayName}
            </a>
          ) : (
            <span>匿名</span>
          )}
        </span>
        <span className="inline-flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" />
          {new Date(createdAt).toLocaleDateString("ja-JP")}
        </span>
        {period && <span className="hidden sm:inline">被害時期: {period}</span>}
        <span className="pointer-events-auto">
          <HelpfulButton
            postId={postId}
            initialCount={helpfulCount}
            initialVoted={userVoted}
          />
        </span>
      </div>
    </div>
  );
}
