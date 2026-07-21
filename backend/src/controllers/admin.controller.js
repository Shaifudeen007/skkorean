const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');

// @desc    Register a new admin
// @route   POST /api/admin/register
const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            res.status(400);
            throw new Error('Please provide all fields');
        }

        const adminExists = await prisma.admin.findUnique({
            where: { email }
        });

        if (adminExists) {
            res.status(400);
            throw new Error('Admin with this email already exists');
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const admin = await prisma.admin.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        });

        res.status(201).json({
            success: true,
            admin: {
                id: admin.id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Admin Login
// @route   POST /api/admin/login
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400);
            throw new Error('Please provide email and password');
        }

        const admin = await prisma.admin.findUnique({
            where: { email }
        });

        let isMatch = false;
        if (admin) {
            isMatch = await bcrypt.compare(password, admin.password);
        }



        if (!admin || !isMatch) {
            res.status(401);
            throw new Error('Invalid credentials');
        }

        const token = generateToken(admin.id, admin.role);

        res.status(200).json({
            success: true,
            token,
            admin: {
                id: admin.id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get admin profile
// @route   GET /api/admin/profile
const getProfile = async (req, res, next) => {
    try {
        const admin = await prisma.admin.findUnique({
            where: { id: req.admin.id },
            select: { id: true, name: true, email: true, role: true }
        });

        if (!admin) {
            res.status(404);
            throw new Error('Admin not found');
        }

        res.status(200).json(admin);
    } catch (error) {
        next(error);
    }
};

// @desc    Change admin password
// @route   PUT /api/admin/change-password
const changePassword = async (req, res, next) => {
    try {
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            res.status(400);
            throw new Error('Please provide old and new passwords');
        }

        const admin = await prisma.admin.findUnique({
            where: { id: req.admin.id }
        });

        if (!admin) {
            res.status(404);
            throw new Error('Admin not found');
        }

        const isMatch = await bcrypt.compare(oldPassword, admin.password);

        if (!isMatch) {
            res.status(401).json({
                success: false,
                message: 'Old password is incorrect'
            });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedNewPassword = await bcrypt.hash(newPassword, salt);

        await prisma.admin.update({
            where: { id: req.admin.id },
            data: { password: hashedNewPassword }
        });

        res.status(200).json({ success: true, message: 'Password changed successfully' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login,
    getProfile,
    changePassword
};
