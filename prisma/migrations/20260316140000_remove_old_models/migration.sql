-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT IF EXISTS "Review_orgId_fkey";
ALTER TABLE "Review" DROP CONSTRAINT IF EXISTS "Review_userId_fkey";
ALTER TABLE "ReviewTag" DROP CONSTRAINT IF EXISTS "ReviewTag_reviewId_fkey";
ALTER TABLE "ReviewTag" DROP CONSTRAINT IF EXISTS "ReviewTag_tagId_fkey";
ALTER TABLE "ReviewVote" DROP CONSTRAINT IF EXISTS "ReviewVote_reviewId_fkey";
ALTER TABLE "ReviewVote" DROP CONSTRAINT IF EXISTS "ReviewVote_userId_fkey";
ALTER TABLE "Testimony" DROP CONSTRAINT IF EXISTS "Testimony_categoryId_fkey";
ALTER TABLE "Testimony" DROP CONSTRAINT IF EXISTS "Testimony_orgId_fkey";
ALTER TABLE "Testimony" DROP CONSTRAINT IF EXISTS "Testimony_userId_fkey";
ALTER TABLE "TestimonyTag" DROP CONSTRAINT IF EXISTS "TestimonyTag_testimonyId_fkey";
ALTER TABLE "TestimonyTag" DROP CONSTRAINT IF EXISTS "TestimonyTag_tagId_fkey";
ALTER TABLE "TestimonyVote" DROP CONSTRAINT IF EXISTS "TestimonyVote_testimonyId_fkey";
ALTER TABLE "TestimonyVote" DROP CONSTRAINT IF EXISTS "TestimonyVote_userId_fkey";

-- DropTable
DROP TABLE IF EXISTS "ReviewVote";
DROP TABLE IF EXISTS "ReviewTag";
DROP TABLE IF EXISTS "Review";
DROP TABLE IF EXISTS "TestimonyVote";
DROP TABLE IF EXISTS "TestimonyTag";
DROP TABLE IF EXISTS "Testimony";

-- AlterTable: Remove old columns from Organization
ALTER TABLE "Organization" DROP COLUMN IF EXISTS "avgRating";
ALTER TABLE "Organization" DROP COLUMN IF EXISTS "reviewCount";
