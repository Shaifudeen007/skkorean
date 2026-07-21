const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.admin = await prisma.admin.findUnique({
                where: { id: decoded.id },
                select: { id: true, name: true, email: true, role: true }
            });

            if (!req.admin) {
                res.status(401);
                throw new Error('Not authorized, admin not found');
            }

            next();
        } catch (error) {
            res.status(401);
            next(new Error('Not authorized, token failed'));
        }
    } else {
        res.status(401);
        next(new Error('Not authorized, no token'));
    }
};

module.exports = { protect };
