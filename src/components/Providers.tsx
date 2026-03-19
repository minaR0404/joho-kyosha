"use client";

import { SessionProvider } from "next-auth/react";
import BanGuard from "./BanGuard";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <BanGuard>{children}</BanGuard>
    </SessionProvider>
  );
}
