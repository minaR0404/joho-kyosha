import type { Metadata } from "next";
import { Inter, Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.joho-kyosha.com";
const siteName = "情報強者";
const siteDescription =
  "情報商材・マルチ商法・宗教などの口コミ・評判サイト。みんなで情報を共有して騙されないように情報強者になろう。";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  verification: {
    google: "qrr2S2oeeLnr4GLUEXDcy8nTEz6nZjXdbh_Dwx6kDq4",
  },
  title: {
    default: "情報強者 - 騙される前に、まずチェック。",
    template: "%s | 情報強者",
  },
  description: siteDescription,
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: siteUrl,
    siteName,
    title: "情報強者 - 騙される前に、まずチェック。",
    description: siteDescription,
  },
  twitter: {
    card: "summary",
    title: "情報強者 - 騙される前に、まずチェック。",
    description: siteDescription,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${inter.variable} ${notoSansJP.variable} antialiased min-h-screen flex flex-col`}>
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
