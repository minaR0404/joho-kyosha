import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import ReviewForm from "@/components/ReviewForm";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const org = await prisma.organization.findUnique({ where: { slug } });
  if (!org) return {};
  return { title: `${org.name}の口コミを書く` };
}

export default async function ReviewPage({ params }: Props) {
  const { slug } = await params;
  const session = await auth();

  if (!session?.user) {
    redirect(`/auth/login?callbackUrl=/org/${slug}/review`);
  }

  const org = await prisma.organization.findUnique({
    where: { slug },
    select: { id: true, slug: true, name: true, category: { select: { name: true, slug: true } } },
  });

  if (!org) notFound();

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600">トップ</Link>
        {" > "}
        <Link href={`/org/${org.slug}`} className="hover:text-blue-600">{org.name}</Link>
        {" > "}
        <span className="text-gray-900">口コミを書く</span>
      </nav>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        {org.name} の口コミを書く
      </h1>
      <p className="text-gray-600 mb-6">
        あなたの体験を共有して、他の人が騙されないよう助けましょう。
      </p>

      <ReviewForm orgId={org.id} orgSlug={org.slug} />
    </div>
  );
}
