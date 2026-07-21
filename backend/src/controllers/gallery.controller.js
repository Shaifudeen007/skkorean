const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
const path = require('path');

// @desc    Get all gallery items
// @route   GET /api/gallery
const getGallery = async (req, res, next) => {
    try {
        const items = await prisma.gallery.findMany({
            where: { deletedAt: null },
            orderBy: { createdAt: 'desc' }
        });
        
        const formattedItems = items.map(item => ({
            id: item.id,
            _id: item.id, // For frontend compatibility
            url: item.url,
            title: item.title,
            description: item.description
        }));

        res.status(200).json(formattedItems);
    } catch (error) {
        next(error);
    }
};

// @desc    Add a gallery item
// @route   POST /api/gallery
const addGalleryItem = async (req, res, next) => {
    try {
        const { title, description } = req.body;
        
        if (!req.file) {
            res.status(400);
            throw new Error('Please upload an image');
        }

        const url = `/uploads/gallery/${req.file.filename}`;

        const item = await prisma.gallery.create({
            data: {
                url,
                title,
                description
            }
        });

        res.status(201).json({
            success: true,
            message: 'Image uploaded successfully',
            data: item
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a gallery item
// @route   DELETE /api/gallery/:id
const deleteGalleryItem = async (req, res, next) => {
    try {
        const item = await prisma.gallery.findUnique({
            where: { id: req.params.id }
        });

        if (!item) {
            res.status(404);
            throw new Error('Gallery item not found');
        }

        // Remove image from disk
        const imagePath = path.join(__dirname, '../../', item.url);
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        await prisma.gallery.delete({
            where: { id: req.params.id }
        });

        res.status(200).json({ success: true, message: 'Gallery item deleted' });
    } catch (error) {
        next(error);
    }
};

// @desc    Update a gallery item
// @route   PUT /api/gallery/:id
const updateGalleryItem = async (req, res, next) => {
    try {
        const { title, description } = req.body;
        
        const dataToUpdate = {
            ...(title && { title }),
            ...(description && { description })
        };

        if (req.file) {
            dataToUpdate.url = `/uploads/gallery/${req.file.filename}`;
        }

        const item = await prisma.gallery.update({
            where: { id: req.params.id },
            data: dataToUpdate
        });

        res.status(200).json({ success: true, message: 'Gallery item updated', data: item });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getGallery,
    addGalleryItem,
    deleteGalleryItem,
    updateGalleryItem
};
