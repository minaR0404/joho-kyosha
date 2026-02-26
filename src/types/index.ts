import type { Organization, Review, User, Category, Tag } from "@prisma/client";

export type OrganizationWithRelations = Organization & {
  category: Category;
  tags: { tag: Tag }[];
  reviews: ReviewWithUser[];
};

export type ReviewWithUser = Review & {
  user: Pick<User, "id" | "displayName" | "image">;
};

export type OrganizationCard = Pick<
  Organization,
  "id" | "slug" | "name" | "avgRating" | "reviewCount" | "status" | "description"
> & {
  category: Pick<Category, "name" | "slug">;
};
