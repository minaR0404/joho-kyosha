import Link from "next/link";
import {
  ShieldAlert,
  Network,
  TrendingUp,
  Monitor,
  Landmark,
  LayoutGrid,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const CATEGORY_CONFIG: Record<string, { order: number; icon: LucideIcon }> = {
  "info-products": { order: 0, icon: ShieldAlert },
  mlm:             { order: 1, icon: Network },
  investment:      { order: 2, icon: TrendingUp },
  "online-salon":  { order: 3, icon: Monitor },
  religion:        { order: 4, icon: Landmark },
  other:           { order: 5, icon: LayoutGrid },
};

interface CategoryNavProps {
  categories: { slug: string; name: string; icon: string | null }[];
}

export default function CategoryNav({ categories }: CategoryNavProps) {
  const sorted = [...categories].sort(
    (a, b) =>
      (CATEGORY_CONFIG[a.slug]?.order ?? 99) -
      (CATEGORY_CONFIG[b.slug]?.order ?? 99)
  );

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
      {sorted.map((cat) => {
        const Icon = CATEGORY_CONFIG[cat.slug]?.icon || LayoutGrid;
        return (
          <Link
            key={cat.slug}
            href={`/category/${cat.slug}`}
            className="flex flex-col items-center gap-4 px-4 py-6 bg-white rounded-lg border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all group"
          >
            <Icon className="w-8 h-8 text-blue-600 group-hover:text-blue-700 transition-colors" strokeWidth={1.5} />
            <span className="text-sm font-medium text-gray-700">{cat.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
