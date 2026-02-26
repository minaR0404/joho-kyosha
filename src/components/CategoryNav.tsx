import Link from "next/link";

interface CategoryNavProps {
  categories: { slug: string; name: string; icon: string | null }[];
}

export default function CategoryNav({ categories }: CategoryNavProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
      {categories.map((cat) => (
        <Link
          key={cat.slug}
          href={`/category/${cat.slug}`}
          className="flex flex-col items-center gap-2 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all"
        >
          <span className="text-2xl">{cat.icon || "📋"}</span>
          <span className="text-sm font-medium text-gray-700">{cat.name}</span>
        </Link>
      ))}
    </div>
  );
}
