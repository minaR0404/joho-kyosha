import { getRatingBgColor, getRatingLabel } from "@/lib/utils";

export default function RatingBadge({ rating }: { rating: number }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-sm font-bold ${getRatingBgColor(rating)}`}
    >
      {rating.toFixed(1)}
      <span className="text-xs font-normal">{getRatingLabel(rating)}</span>
    </span>
  );
}
