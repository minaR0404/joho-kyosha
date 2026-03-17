import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.joho-kyosya.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/auth/", "/mypage/", "/org/new/", "/post/new/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
