-- CreateTable
CREATE TABLE IF NOT EXISTS "main_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "main_categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "main_categories_name_key" ON "main_categories"("name");

INSERT INTO "main_categories"
("id","name","createdAt","updatedAt")
VALUES
('e151c2f5-6aef-4fa0-bc13-d2b407292d9a','Machineries',NOW(),NOW()),
('2a8f4a44-1111-4444-8888-111111111111','PMU Products',NOW(),NOW()),
('3b9f5b55-2222-5555-9999-222222222222','Aesthetic Products',NOW(),NOW()),
('4c0f6c66-3333-6666-aaaa-333333333333','Korean Products',NOW(),NOW())
ON CONFLICT ("name") DO NOTHING;

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
