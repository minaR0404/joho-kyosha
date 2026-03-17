import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.joho-kyosya.com";

  // 静的ページ
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/posts`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/terms`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${baseUrl}/privacy`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${baseUrl}/guidelines`, changeFrequency: "monthly", priority: 0.3 },
  ];

  // カテゴリページ
  const categories = await prisma.category.findMany({ select: { slug: true } });
  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${baseUrl}/category/${cat.slug}`,
    changeFrequency: "daily",
    priority: 0.8,
  }));

  // 組織ページ
  const orgs = await prisma.organization.findMany({
    where: { approvalStatus: "APPROVED" },
    select: { slug: true, updatedAt: true },
  });
  const orgPages: MetadataRoute.Sitemap = orgs.map((org) => ({
    url: `${baseUrl}/org/${org.slug}`,
    lastModified: org.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // 投稿ページ
  const posts = await prisma.post.findMany({
    where: { deletedAt: null },
    select: { id: true, updatedAt: true },
    orderBy: { createdAt: "desc" },
    take: 1000,
  });
  const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/post/${post.id}`,
    lastModified: post.updatedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticPages, ...categoryPages, ...orgPages, ...postPages];
}
