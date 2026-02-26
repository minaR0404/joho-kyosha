"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
          className={`w-full ${sizeClasses} border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white`}
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition-colors text-sm"
        >
          検索
        </button>
      </div>
    </form>
  );
}
