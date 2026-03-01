"use client";

import { getRatingColor } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";

export function RatingStarsDisplay({
  rating,
  size = "sm",
}: {
  rating: number;
  size?: "sm" | "md" | "lg";
}) {
  const px = size === "lg" ? 24 : size === "md" ? 20 : 16;
  const colorClass = getRatingColor(rating);
  const full = Math.floor(rating);
  const fraction = rating - full;

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((level) => {
        if (level <= full) {
          return (
            <AlertTriangle
              key={level}
              width={px}
              height={px}
              className={colorClass}
              fill="currentColor"
              fillOpacity={0.25}
              strokeWidth={1.5}
            />
          );
        }

        if (level === full + 1 && fraction > 0) {
          return (
            <div key={level} style={{ position: "relative", width: px, height: px }}>
              <AlertTriangle
                width={px}
                height={px}
                className="text-gray-300"
                fill="none"
                strokeWidth={1.5}
              />
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: fraction * px,
                  height: px,
                  overflow: "hidden",
                }}
              >
                <AlertTriangle
                  width={px}
                  height={px}
                  className={colorClass}
                  fill="currentColor"
                  fillOpacity={0.25}
                  strokeWidth={1.5}
                />
              </div>
            </div>
          );
        }

        return (
          <AlertTriangle
            key={level}
            width={px}
            height={px}
            className="text-gray-300"
            fill="none"
            strokeWidth={1.5}
          />
        );
      })}
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
        {[1, 2, 3, 4, 5].map((level) => (
          <button
            key={level}
            type="button"
            onClick={() => onChange(level)}
            className="transition-colors hover:text-orange-400"
          >
            <AlertTriangle
              className={`w-6 h-6 ${level <= value ? "text-orange-500" : "text-gray-300"}`}
              fill={level <= value ? "currentColor" : "none"}
              fillOpacity={level <= value ? 0.25 : 0}
              strokeWidth={1.5}
            />
          </button>
        ))}
      </div>
      <span className="text-sm text-gray-500">{value > 0 ? value : "-"}</span>
    </div>
  );
}
