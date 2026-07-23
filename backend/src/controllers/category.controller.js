const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create Sub Category
exports.createCategory = async (req, res, next) => {
    try {
        const { name, mainCategoryId, image } = req.body;
        
        if (!name) {
            return res.status(400).json({ success: false, message: "Sub category name is required" });
        }
        if (!mainCategoryId) {
            return res.status(400).json({ success: false, message: "Main Category is required" });
        }

        const slug = name
            .toLowerCase()
            .trim()
            .replace(/[\s_]+/g, '-')
            .replace(/[^\w-]+/g, '');

        const category = await prisma.category.create({
            data: {
                name,
                slug,
                mainCategoryId,
                image
            },
            include: {
                mainCategory: true
            }
        });
        res.status(201).json({
            success: true,
            category
        });
    } catch (error) {
        next(error);
    }
};

// Get All Sub Categories
exports.getCategories = async (req, res, next) => {
    try {
        const { mainCategoryId } = req.query;
        const whereClause = {
            deletedAt: null
        };

        if (mainCategoryId) {
            whereClause.mainCategoryId = mainCategoryId;
        }

        const categories = await prisma.category.findMany({
            where: whereClause,
            include: {
                mainCategory: true
            },
            orderBy: {
                name: 'asc'
            }
        });
        res.json({
            success: true,
            data: categories
        });
    } catch (error) {
        next(error);
    }
};

// Get Single Sub Category
exports.getCategoryById = async (req, res, next) => {
    try {
        const category = await prisma.category.findUnique({
            where: {
                id: req.params.id
            },
            include: {
                mainCategory: true
            }
        });
        res.json({
            success: true,
            category
        });
    } catch (error) {
        next(error);
    }
};

// Update Sub Category
exports.updateCategory = async (req, res, next) => {
    try {
        const { name, mainCategoryId, image } = req.body;
        
        let dataToUpdate = {};
        if (name) {
            dataToUpdate.name = name;
            dataToUpdate.slug = name
                .toLowerCase()
                .trim()
                .replace(/[\s_]+/g, '-')
                .replace(/[^\w-]+/g, '');
        }
        if (mainCategoryId) {
            dataToUpdate.mainCategoryId = mainCategoryId;
        }
        if (image !== undefined) {
            dataToUpdate.image = image;
        }

        const category = await prisma.category.update({
            where: {
                id: req.params.id
            },
            data: dataToUpdate,
            include: {
                mainCategory: true
            }
        });
        res.json({
            success: true,
            category
        });
    } catch (error) {
        next(error);
    }
};

// Delete Sub Category
exports.deleteCategory = async (req, res, next) => {
    try {
        await prisma.category.update({
            where: {
                id: req.params.id
            },
            data: {
                deletedAt: new Date()
            }
        });
        res.json({
            success: true,
            message: "Category deleted"
        });
    } catch (error) {
        next(error);
    }
};
