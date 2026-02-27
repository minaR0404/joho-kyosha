import Link from "next/link";
import RatingBadge from "./RatingBadge";

interface OrgCardProps {
  slug: string;
  name: string;
  categoryName: string;
  categorySlug: string;
  description: string | null;
  avgRating: number;
  reviewCount: number;
  status: string;
}

export default function OrgCard({
  slug,
  name,
  categoryName,
  description,
  avgRating,
  reviewCount,
  status,
}: OrgCardProps) {
  return (
    <Link
      href={`/org/${slug}`}
      className="block bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg text-gray-900 truncate">{name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
              {categoryName}
            </span>
            {status === "CLOSED" && (
              <span className="text-xs px-2 py-0.5 bg-gray-200 text-gray-500 rounded">
                閉鎖
              </span>
            )}
          </div>
          {description && (
            <p className="text-sm text-gray-600 mt-2 line-clamp-2">{description}</p>
          )}
          <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
            <span>口コミ {reviewCount}件</span>
          </div>
        </div>
        <div className="flex-shrink-0">
          {reviewCount > 0 ? (
            <RatingBadge rating={avgRating} />
          ) : (
            <span className="text-xs text-gray-400">評価なし</span>
          )}
        </div>
      </div>
    </Link>
  );
}
