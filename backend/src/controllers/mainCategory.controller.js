const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get All Main Categories with subcategories
exports.getMainCategories = async (req, res, next) => {
    try {
        const mainCategories = await prisma.mainCategory.findMany({
            where: {
                deletedAt: null
            },
            include: {
                categories: {
                    where: {
                        deletedAt: null
                    },
                    orderBy: {
                        name: 'asc'
                    }
                }
            },
            orderBy: {
                createdAt: 'asc'
            }
        });

        res.status(200).json({
            success: true,
            data: mainCategories
        });
    } catch (error) {
        next(error);
    }
};
