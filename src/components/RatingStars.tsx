"use client";

import { getRatingColor } from "@/lib/utils";

export function RatingStarsDisplay({
  rating,
  size = "sm",
}: {
  rating: number;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClass = size === "lg" ? "text-2xl" : size === "md" ? "text-lg" : "text-sm";

  return (
    <div className={`flex items-center gap-0.5 ${sizeClass}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={star <= rating ? getRatingColor(rating) : "text-gray-300"}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export function RatingStarsInput({
  value,
  onChange,
  label,
}: {
  value: number;
  onChange: (v: number) => void;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-700 w-28">{label}</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className={`text-2xl transition-colors ${
              star <= value ? "text-yellow-500" : "text-gray-300"
            } hover:text-yellow-400`}
          >
            ★
          </button>
        ))}
      </div>
      <span className="text-sm text-gray-500">{value > 0 ? value : "-"}</span>
    </div>
  );
}
