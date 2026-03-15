-- AlterTable
ALTER TABLE "Testimony" ADD COLUMN     "orgId" INTEGER;

-- AddForeignKey
ALTER TABLE "Testimony" ADD CONSTRAINT "Testimony_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
