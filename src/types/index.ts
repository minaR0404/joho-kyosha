import type { Organization, Post, User, Category, Tag } from "@prisma/client";

export type PostWithUser = Post & {
  user: Pick<User, "id" | "displayName">;
  category: Pick<Category, "slug" | "name">;
  org?: Pick<Organization, "slug" | "name"> | null;
  tags: { tag: Pick<Tag, "id" | "name"> }[];
};

export type OrganizationCard = Pick<
  Organization,
  "id" | "slug" | "name" | "postCount" | "status" | "description"
> & {
  category: Pick<Category, "name" | "slug">;
};
