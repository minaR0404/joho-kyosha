export function calculateOverallRating(ratings: {
  ratingDanger: number;
  ratingCost: number;
  ratingPressure: number;
  ratingTransparency: number;
  ratingExit: number;
}): number {
  const sum =
    ratings.ratingDanger +
    ratings.ratingCost +
    ratings.ratingPressure +
    ratings.ratingTransparency +
    ratings.ratingExit;
  return Math.round((sum / 5) * 10) / 10;
}

export function getRatingColor(rating: number): string {
  if (rating < 2) return "text-green-600";
  if (rating < 3) return "text-yellow-600";
  if (rating < 4) return "text-orange-500";
  return "text-red-600";
}

export function getRatingBgColor(rating: number): string {
  if (rating < 2) return "bg-green-100 text-green-800";
  if (rating < 3) return "bg-yellow-100 text-yellow-800";
  if (rating < 4) return "bg-orange-100 text-orange-800";
  return "bg-red-100 text-red-800";
}

export function getRatingLabel(rating: number): string {
  if (rating < 2) return "低リスク";
  if (rating < 3) return "要注意";
  if (rating < 4) return "危険";
  return "非常に危険";
}

export function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export const RELATIONSHIPS = [
  "元会員",
  "勧誘された",
  "知人が被害",
  "調査した",
  "その他",
] as const;

export const RATING_AXES = [
  { key: "ratingDanger", label: "危険度", description: "総合的なリスク" },
  { key: "ratingCost", label: "金銭的リスク", description: "失う可能性のある金額" },
  { key: "ratingPressure", label: "勧誘の強さ", description: "勧誘のしつこさ" },
  { key: "ratingTransparency", label: "情報の不透明さ", description: "情報の隠蔽度" },
  { key: "ratingExit", label: "脱退の難しさ", description: "やめにくさ" },
] as const;
