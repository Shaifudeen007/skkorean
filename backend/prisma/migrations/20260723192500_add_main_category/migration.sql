-- CreateTable
CREATE TABLE IF NOT EXISTS "main_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "main_categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "main_categories_name_key" ON "main_categories"("name");

-- AlterTable
ALTER TABLE "categories" ADD COLUMN IF NOT EXISTS "mainCategoryId" TEXT;

-- Ensure legacy rows have valid mainCategoryId before setting NOT NULL
UPDATE "categories" 
SET "mainCategoryId" = 'e151c2f5-6aef-4fa0-bc13-d2b407292d9a' 
WHERE "mainCategoryId" IS NULL OR "mainCategoryId" = '';

-- Set NOT NULL
ALTER TABLE "categories" ALTER COLUMN "mainCategoryId" SET NOT NULL;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "categories_mainCategoryId_idx" ON "categories"("mainCategoryId");

-- AddForeignKey
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'categories_mainCategoryId_fkey'
    ) THEN
        ALTER TABLE "categories" ADD CONSTRAINT "categories_mainCategoryId_fkey" FOREIGN KEY ("mainCategoryId") REFERENCES "main_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END $$;
