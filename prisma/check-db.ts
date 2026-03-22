import { PrismaClient } from "@prisma/client";

const p = new PrismaClient();

async function main() {
  const cats = await p.category.findMany({ orderBy: { sortOrder: "asc" } });
  console.log("=== Categories ===");
  cats.forEach((c) => console.log(c.id, c.slug, c.name));

  const orgs = await p.organization.findMany({
    select: { id: true, name: true, slug: true, categoryId: true },
  });
  console.log("=== Organizations ===");
  orgs.forEach((o) => console.log(o.id, o.slug, o.name, "cat:", o.categoryId));

  const tags = await p.tag.findMany();
  console.log("=== Tags ===");
  tags.forEach((t) => console.log(t.id, t.name));

  const users = await p.user.findMany({
    select: { id: true, displayName: true },
    orderBy: { id: "asc" },
  });
  console.log("=== Users ===");
  console.log(
    "Total:",
    users.length,
    "Range:",
    users[0].id,
    "-",
    users[users.length - 1].id
  );
}

main()
  .catch(console.error)
  .finally(() => p.$disconnect());
