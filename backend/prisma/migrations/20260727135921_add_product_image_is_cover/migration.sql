-- AlterTable
ALTER TABLE "product_images" ADD COLUMN     "isCover" BOOLEAN NOT NULL DEFAULT false;

-- Set the earliest created image for each product as the cover image
WITH RankedImages AS (
  SELECT id, ROW_NUMBER() OVER(PARTITION BY "productId" ORDER BY "createdAt" ASC) as rn
  FROM "product_images"
)
UPDATE "product_images" SET "isCover" = true WHERE id IN (SELECT id FROM RankedImages WHERE rn = 1);
