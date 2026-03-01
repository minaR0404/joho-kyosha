"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export default function SearchBar({
  defaultValue = "",
  size = "md",
}: {
  defaultValue?: string;
  size?: "sm" | "md" | "lg";
}) {
  const [query, setQuery] = useState(defaultValue);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const sizeClasses =
    size === "lg"
      ? "text-lg px-6 py-4"
      : size === "sm"
      ? "text-sm px-3 py-2"
      : "text-base px-4 py-3";

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="組織名・商材名で検索..."
          className={`w-full ${sizeClasses} border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder:text-gray-400 caret-gray-900`}
        />
        <button
          type="submit"
          className="absolute right-6 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-800 transition-colors"
        >
          <Search className="w-6.5 h-6.5" />
        </button>
      </div>
    </form>
  );
}
