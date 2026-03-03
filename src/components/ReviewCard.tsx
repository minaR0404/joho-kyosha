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
  userVoted = false,
}: ReviewCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          {orgName && orgSlug && (
            <a
              href={`/org/${orgSlug}`}
              className="block text-sm text-blue-600 hover:underline mb-0.5"
            >
              {orgName}
            </a>
          )}
          {reviewId != null && orgSlug ? (
            <a href={`/org/${orgSlug}/review/${reviewId}`} className="block font-bold text-gray-900 hover:text-blue-600 transition-colors">
              {title}
            </a>
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

      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap mb-3">
        {body}
      </p>

      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 border-t border-gray-100 pt-3">
        <span className="px-2 py-0.5 bg-gray-100 rounded">{relationship}</span>
        {period && <span>時期: {period}</span>}
        <span>{isAnonymous ? "匿名" : displayName}</span>
        <span>{new Date(createdAt).toLocaleDateString("ja-JP")}</span>
        {reviewId != null && (
          <HelpfulButton reviewId={reviewId} initialCount={helpfulCount} initialVoted={userVoted} />
        )}
      </div>
    </div>
  );
}
