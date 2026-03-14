import Link from "next/link";
import { getCategoryIcon } from "@/lib/category-config";

interface CategoryNavProps {
  categories: { slug: string; name: string; icon: string | null; sortOrder: number }[];
}

export default function CategoryNav({ categories }: CategoryNavProps) {
  const sorted = [...categories].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3">
      {sorted.map((cat) => {
        const Icon = getCategoryIcon(cat.slug);
        return (
          <Link
            key={cat.slug}
            href={`/category/${cat.slug}`}
            className="flex flex-col items-center gap-2 sm:gap-4 px-2 py-4 sm:px-4 sm:py-6 bg-white rounded-lg border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all group"
          >
            <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 group-hover:text-blue-700 transition-colors" strokeWidth={1.5} />
            <span className="text-xs sm:text-sm font-medium text-gray-700 text-center">{cat.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
