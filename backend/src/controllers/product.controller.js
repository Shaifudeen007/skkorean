const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
const path = require('path');

// @desc    Get all products
// @route   GET /api/products
const getProducts = async (req, res, next) => {
    try {
        const products = await prisma.product.findMany({
            where: { deletedAt: null },
            include: {
                category: {
                    include: {
                        mainCategory: true
                    }
                }
            }
        });
        
        // Map to match frontend expectations
        const formattedProducts = products.map(p => ({
            id: p.id,
            _id: p.id, // For frontend compatibility
            name: p.name,
            category: p.category ? {
                id: p.category.id,
                name: p.category.name,
                mainCategoryId: p.category.mainCategoryId,
                mainCategory: p.category.mainCategory ? {
                    id: p.category.mainCategory.id,
                    name: p.category.mainCategory.name
                } : null
            } : null,
            mrp: p.mrp,
            discountPrice: p.discountPrice,
            description: p.description,
            image: p.image
        }));

        res.status(200).json(formattedProducts);
    } catch (error) {
        next(error);
    }
};

// @desc    Create a product
// @route   POST /api/products
const createProduct = async (req, res, next) => {
    try {
        const { name, categoryId, mrp, discountPrice, description } = req.body;
        
        let image = null;
        if (req.file) {
            image = `/uploads/products/${req.file.filename}`;
        }

        const product = await prisma.product.create({
            data: {
                name,
                categoryId,
                description,
                mrp: mrp ? parseFloat(mrp) : null,
                discountPrice: discountPrice ? parseFloat(discountPrice) : null,
                image
            },
            include: {
                category: {
                    include: {
                        mainCategory: true
                    }
                }
            }
        });

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: product
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
const deleteProduct = async (req, res, next) => {
    try {
        const product = await prisma.product.findUnique({
            where: { id: req.params.id }
        });

        if (!product) {
            res.status(404);
            throw new Error('Product not found');
        }

        // Optional: Remove image from disk
        if (product.image) {
            const imagePath = path.join(__dirname, '../../', product.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await prisma.product.delete({
            where: { id: req.params.id }
        });

        res.status(200).json({ success: true, message: 'Product deleted' });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
const getProductById = async (req, res, next) => {
    try {
        const product = await prisma.product.findUnique({
            where: {
                id: req.params.id
            },
            include: {
                category: {
                    include: {
                        mainCategory: true
                    }
                }
            }
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.json({
            success: true,
            product
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
const updateProduct = async (req, res, next) => {
    try {
        const { name, categoryId, mrp, discountPrice, description } = req.body;
        
        const dataToUpdate = {
            ...(name && { name }),
            ...(categoryId && { categoryId }),
            ...(description && { description }),
            ...(mrp && { mrp: parseFloat(mrp) }),
            ...(discountPrice && { discountPrice: parseFloat(discountPrice) })
        };

        if (req.file) {
            dataToUpdate.image = `/uploads/products/${req.file.filename}`;
        }

        const product = await prisma.product.update({
            where: { id: req.params.id },
            data: dataToUpdate,
            include: {
                category: {
                    include: {
                        mainCategory: true
                    }
                }
            }
        });

        res.status(200).json({ success: true, message: 'Product updated successfully', data: product });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getProducts,
    createProduct,
    deleteProduct,
    getProductById,
    updateProduct
};
