const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
const path = require('path');

// Helper to format product object for API responses
const formatProductResponse = (p, extraFields = {}) => {
    const formattedImages = (p.images && p.images.length > 0)
        ? p.images.map(img => ({ id: img.id, url: img.url }))
        : (p.image ? [{ id: 'legacy', url: p.image }] : []);

    const primaryImage = formattedImages.length > 0 ? formattedImages[0].url : p.image;

    return {
        id: p.id,
        _id: p.id, // For frontend compatibility
        name: p.name,
        description: p.description,
        keyFeatures: p.keyFeatures !== undefined && p.keyFeatures !== null
            ? p.keyFeatures
            : (extraFields.keyFeatures !== undefined && extraFields.keyFeatures !== null ? extraFields.keyFeatures : null),
        whyChooseUs: p.whyChooseUs !== undefined && p.whyChooseUs !== null
            ? p.whyChooseUs
            : (extraFields.whyChooseUs !== undefined && extraFields.whyChooseUs !== null ? extraFields.whyChooseUs : null),
        procedure: p.procedure !== undefined && p.procedure !== null
            ? p.procedure
            : (extraFields.procedure !== undefined && extraFields.procedure !== null ? extraFields.procedure : null),
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
        image: primaryImage,
        images: formattedImages,
        status: p.status,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt
    };
};

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
                },
                images: {
                    orderBy: { createdAt: 'asc' }
                }
            }
        });
        
        const formattedProducts = products.map(p => formatProductResponse(p));
        res.status(200).json(formattedProducts);
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
                },
                images: {
                    orderBy: { createdAt: 'asc' }
                }
            }
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        const formattedProduct = formatProductResponse(product);

        res.json({
            success: true,
            product: {
                ...formattedProduct,
                keyFeatures: product.keyFeatures !== undefined ? product.keyFeatures : formattedProduct.keyFeatures,
                whyChooseUs: product.whyChooseUs !== undefined ? product.whyChooseUs : formattedProduct.whyChooseUs,
                procedure: product.procedure !== undefined ? product.procedure : formattedProduct.procedure
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Create a product
// @route   POST /api/products
const createProduct = async (req, res, next) => {
    try {
        const { name, categoryId, mrp, discountPrice, description, keyFeatures, whyChooseUs, procedure } = req.body;
        
        let uploadedUrls = [];
        if (req.files && req.files.length > 0) {
            uploadedUrls = req.files.map(file => `/uploads/products/${file.filename}`);
        } else if (req.file) {
            uploadedUrls = [`/uploads/products/${req.file.filename}`];
        }

        const primaryImage = uploadedUrls.length > 0 ? uploadedUrls[0] : null;

        const productData = {
            name,
            categoryId,
            description,
            mrp: mrp ? parseFloat(mrp) : null,
            discountPrice: discountPrice ? parseFloat(discountPrice) : null,
            image: primaryImage
        };

        if (uploadedUrls.length > 0) {
            productData.images = {
                create: uploadedUrls.map(url => ({ url }))
            };
        }

        const product = await prisma.product.create({
            data: productData,
            include: {
                category: {
                    include: {
                        mainCategory: true
                    }
                },
                images: {
                    orderBy: { createdAt: 'asc' }
                }
            }
        });

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: formatProductResponse(product, { keyFeatures, whyChooseUs, procedure })
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
const updateProduct = async (req, res, next) => {
    try {
        const { name, categoryId, mrp, discountPrice, description, keyFeatures, whyChooseUs, procedure, deletedImageIds } = req.body;
        const productId = req.params.id;

        const existingProduct = await prisma.product.findUnique({
            where: { id: productId },
            include: { images: true }
        });

        if (!existingProduct) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        // Delete specified existing images from DB and disk
        let imagesToDelete = [];
        if (deletedImageIds) {
            try {
                imagesToDelete = typeof deletedImageIds === 'string' ? JSON.parse(deletedImageIds) : deletedImageIds;
            } catch (e) {
                imagesToDelete = Array.isArray(deletedImageIds) ? deletedImageIds : [deletedImageIds];
            }
        }

        if (Array.isArray(imagesToDelete) && imagesToDelete.length > 0) {
            const recordsToDelete = await prisma.productImage.findMany({
                where: {
                    id: { in: imagesToDelete },
                    productId: productId
                }
            });

            for (const imgRecord of recordsToDelete) {
                const imgPath = path.join(__dirname, '../../', imgRecord.url);
                if (fs.existsSync(imgPath)) {
                    try { fs.unlinkSync(imgPath); } catch (err) {}
                }
            }

            await prisma.productImage.deleteMany({
                where: {
                    id: { in: imagesToDelete },
                    productId: productId
                }
            });
        }

        // Save newly uploaded images
        let uploadedUrls = [];
        if (req.files && req.files.length > 0) {
            uploadedUrls = req.files.map(file => `/uploads/products/${file.filename}`);
        } else if (req.file) {
            uploadedUrls = [`/uploads/products/${req.file.filename}`];
        }

        if (uploadedUrls.length > 0) {
            await prisma.productImage.createMany({
                data: uploadedUrls.map(url => ({
                    productId: productId,
                    url: url
                }))
            });
        }

        // Retrieve current images to determine primary image
        const currentImages = await prisma.productImage.findMany({
            where: { productId: productId },
            orderBy: { createdAt: 'asc' }
        });

        const primaryImage = currentImages.length > 0 ? currentImages[0].url : (uploadedUrls.length === 0 && imagesToDelete.length > 0 ? null : existingProduct.image);

        const dataToUpdate = {
            ...(name && { name }),
            ...(categoryId && { categoryId }),
            ...(description !== undefined && { description }),
            ...(mrp !== undefined && { mrp: mrp ? parseFloat(mrp) : null }),
            ...(discountPrice !== undefined && { discountPrice: discountPrice ? parseFloat(discountPrice) : null }),
            image: primaryImage
        };

        const product = await prisma.product.update({
            where: { id: productId },
            data: dataToUpdate,
            include: {
                category: {
                    include: {
                        mainCategory: true
                    }
                },
                images: {
                    orderBy: { createdAt: 'asc' }
                }
            }
        });

        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            data: formatProductResponse(product, { keyFeatures, whyChooseUs, procedure })
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
            where: { id: req.params.id },
            include: { images: true }
        });

        if (!product) {
            res.status(404);
            throw new Error('Product not found');
        }

        // Delete images from disk
        if (product.images && product.images.length > 0) {
            for (const img of product.images) {
                const imgPath = path.join(__dirname, '../../', img.url);
                if (fs.existsSync(imgPath)) {
                    try { fs.unlinkSync(imgPath); } catch (e) {}
                }
            }
        }
        if (product.image) {
            const imagePath = path.join(__dirname, '../../', product.image);
            if (fs.existsSync(imagePath)) {
                try { fs.unlinkSync(imagePath); } catch (e) {}
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

module.exports = {
    getProducts,
    createProduct,
    deleteProduct,
    getProductById,
    updateProduct
};
