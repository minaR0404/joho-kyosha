"use client";

import { useSession, signOut } from "next-auth/react";

export default function BanGuard({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  if (session?.user?.isBanned) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <h1 className="text-2xl font-bold text-gray-700">
          アカウントが停止されています
        </h1>
        <p className="mt-3 text-gray-500 text-center max-w-md">
          利用規約違反により、このアカウントは停止されました。
          心当たりがない場合はお問い合わせください。
        </p>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="mt-6 px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm font-medium"
        >
          ログアウト
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
