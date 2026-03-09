"use client";

import { useEffect } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";

function AutoLoginContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      router.push("/auth/login");
      return;
    }

    signIn("credentials", {
      email: "__auto_login__",
      password: token,
      redirect: false,
    }).then((res) => {
      if (res?.error) {
        router.push("/auth/login?verified=true");
      } else {
        router.push("/");
        router.refresh();
      }
    });
  }, [token, router]);

  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center">
      <p className="text-gray-600">ログイン中...</p>
    </div>
  );
}

export default function AutoLoginPage() {
  return (
    <Suspense fallback={<div className="text-center py-16 text-gray-500">読み込み中...</div>}>
      <AutoLoginContent />
    </Suspense>
  );
}
