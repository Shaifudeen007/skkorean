require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const MAIN_CATEGORIES = [
    'Machineries',
    'PMU Products',
    'Aesthetic Products',
    'Korean Products'
];

async function main() {
    console.log('--- Seeding Fixed Main Categories ---');

    for (const catName of MAIN_CATEGORIES) {
        let mainCat = await prisma.mainCategory.findUnique({
            where: { name: catName }
        });

        if (!mainCat) {
            mainCat = await prisma.mainCategory.create({
                data: { name: catName }
            });
            console.log(`Created Main Category: "${catName}" (${mainCat.id})`);
        } else {
            console.log(`Main Category already exists: "${catName}" (${mainCat.id})`);
        }
    }

    console.log('--- Seeding Completed Successfully ---');
}

main()
    .catch((e) => {
        console.error('Seeding error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
