require('dotenv').config();
const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');

const MAIN_CATEGORIES = [
    'Machineries',
    'PMU Products',
    'Aesthetic Products',
    'Korean Products'
];

async function main() {
    console.log('--- Starting Main Categories Seeding (Raw SQL) ---');

    const pool = new Pool({
        connectionString: process.env.DATABASE_URL
    });

    try {
        // 1. Create main_categories table if not exists
        await pool.query(`
            CREATE TABLE IF NOT EXISTS "main_categories" (
                "id" TEXT NOT NULL,
                "name" TEXT NOT NULL,
                "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "deletedAt" TIMESTAMP(3),
                CONSTRAINT "main_categories_pkey" PRIMARY KEY ("id")
            );
        `);

        await pool.query(`
            CREATE UNIQUE INDEX IF NOT EXISTS "main_categories_name_key" ON "main_categories"("name");
        `);

        // 2. Ensure mainCategoryId column exists in categories
        await pool.query(`
            ALTER TABLE "categories" ADD COLUMN IF NOT EXISTS "mainCategoryId" TEXT;
        `);

        // 3. Upsert Main Categories
        const createdMainCats = {};
        for (const name of MAIN_CATEGORIES) {
            const checkRes = await pool.query(`SELECT id FROM "main_categories" WHERE name = $1`, [name]);
            let id;
            if (checkRes.rows.length > 0) {
                id = checkRes.rows[0].id;
                console.log(`Main Category exists: "${name}" (${id})`);
            } else {
                id = uuidv4();
                await pool.query(
                    `INSERT INTO "main_categories" ("id", "name", "createdAt", "updatedAt") VALUES ($1, $2, NOW(), NOW())`,
                    [id, name]
                );
                console.log(`Created Main Category: "${name}" (${id})`);
            }
            createdMainCats[name] = id;
        }

        // 4. Map existing null mainCategoryId in categories table to "Machineries"
        const machineriesId = createdMainCats['Machineries'];
        const updateRes = await pool.query(`
            UPDATE "categories" SET "mainCategoryId" = $1 WHERE "mainCategoryId" IS NULL OR "mainCategoryId" = ''
        `, [machineriesId]);

        console.log(`Updated ${updateRes.rowCount} categories with NULL mainCategoryId to Machineries (${machineriesId}).`);

        console.log('--- Main Categories Seeding Completed Successfully ---');
    } catch (err) {
        console.error('Seeding error:', err);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

main();
