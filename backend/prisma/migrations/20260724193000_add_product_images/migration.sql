-- CreateTable
CREATE TABLE IF NOT EXISTS "product_images" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "product_images_productId_idx" ON "product_images"("productId");

-- AddForeignKey
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'product_images_productId_fkey'
    ) THEN
        ALTER TABLE "product_images" ADD CONSTRAINT "product_images_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- Data Migration: Populate product_images from existing product.image fields
INSERT INTO "product_images" ("id", "productId", "url", "createdAt", "updatedAt")
SELECT gen_random_uuid()::text, "id", "image", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM "products"
WHERE "image" IS NOT NULL AND "image" <> ''
AND NOT EXISTS (
    SELECT 1 FROM "product_images" pi WHERE pi."productId" = "products"."id" AND pi."url" = "products"."image"
);
