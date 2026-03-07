import Link from "next/link";
import { getCategoryIcon } from "@/lib/category-config";

interface CategoryNavProps {
  categories: { slug: string; name: string; icon: string | null; sortOrder: number }[];
}

export default function CategoryNav({ categories }: CategoryNavProps) {
  const sorted = [...categories].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
      {sorted.map((cat) => {
        const Icon = getCategoryIcon(cat.slug);
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
