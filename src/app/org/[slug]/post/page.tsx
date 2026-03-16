import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import PostForm from "@/components/PostForm";
import EmailVerificationBanner from "@/components/EmailVerificationBanner";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  const org = await prisma.organization.findUnique({ where: { slug } });
  if (!org) return {};
  return { title: `${org.name}について投稿する` };
}

export default async function OrgPostPage({ params }: Props) {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  const session = await auth();

  if (!session?.user) {
    redirect(`/auth/login?callbackUrl=/org/${slug}/post`);
  }

  const currentUser = await prisma.user.findUnique({
    where: { id: Number(session.user.id) },
    select: { emailVerifiedAt: true },
  });
  const isEmailVerified = !!currentUser?.emailVerifiedAt;

  const [org, tags] = await Promise.all([
    prisma.organization.findUnique({
      where: { slug },
      select: { id: true, slug: true, name: true, categoryId: true, category: { select: { name: true, slug: true } } },
    }),
    prisma.tag.findMany({ orderBy: { id: "asc" } }),
  ]);

  if (!org) notFound();

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600">トップ</Link>
        {" > "}
        <Link href={`/org/${org.slug}`} className="hover:text-blue-600">{org.name}</Link>
        {" > "}
        <span className="text-gray-900">投稿する</span>
      </nav>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        {org.name} について投稿する
      </h1>
      <p className="text-gray-600 mb-6">
        あなたの体験を共有して、他の人が騙されないよう助けましょう。
      </p>

      {!isEmailVerified && <EmailVerificationBanner />}
      <PostForm tags={tags} orgId={org.id} orgName={org.name} categoryId={org.categoryId} />
    </div>
  );
}
