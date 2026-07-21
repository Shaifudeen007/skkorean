const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create Category
exports.createCategory = async (req, res, next) => {
    try {
        const { name, image } = req.body;
        
        if (!name) {
            return res.status(400).json({ success: false, message: "Category name is required" });
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
                image
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

// Get All Categories
exports.getCategories = async (req, res, next) => {
    try {
        const categories = await prisma.category.findMany({
            where:{
                deletedAt:null
            }
        });
        res.json({
            success:true,
            data: categories
        });
    } catch(error){
        next(error);
    }
};

// Get Single Category
exports.getCategoryById = async(req,res,next)=>{
    try{
        const category = await prisma.category.findUnique({
            where:{
                id:req.params.id
            }
        });
        res.json({
            success:true,
            category
        });
    }catch(error){
        next(error);
    }
};

// Update Category
exports.updateCategory = async(req,res,next)=>{
    try{
        const { name, image } = req.body;
        
        let dataToUpdate = { ...req.body };
        
        if (name) {
            const slug = name
                .toLowerCase()
                .trim()
                .replace(/[\s_]+/g, '-')
                .replace(/[^\w-]+/g, '');
            dataToUpdate.slug = slug;
        }

        const category = await prisma.category.update({
            where:{
                id:req.params.id
            },
            data: dataToUpdate
        });
        res.json({
            success:true,
            category
        });
    }catch(error){
        next(error);
    }
};

// Delete Category
exports.deleteCategory = async(req,res,next)=>{
    try{
        await prisma.category.update({
            where:{
                id:req.params.id
            },
            data:{
                deletedAt:new Date()
            }
        });
        res.json({
            success:true,
            message:"Category deleted"
        });
    }catch(error){
        next(error);
    }
};
