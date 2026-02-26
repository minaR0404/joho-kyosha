"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-blue-800">情報強者</span>
            <span className="text-xs text-gray-500 hidden sm:block">
              騙される前に、まずチェック。
            </span>
          </Link>

          <nav className="flex items-center gap-1 sm:gap-4">
            <Link
              href="/search"
              className={cn(
                "text-sm px-3 py-2 rounded-md transition-colors",
                pathname === "/search"
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              )}
            >
              検索
            </Link>
            <Link
              href="/about"
              className={cn(
                "text-sm px-3 py-2 rounded-md transition-colors",
                pathname === "/about"
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              )}
            >
              このサイトについて
            </Link>
            <Link
              href="/auth/login"
              className="text-sm px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition-colors"
            >
              ログイン
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
