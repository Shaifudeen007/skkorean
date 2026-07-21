const app = require('./app');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await prisma.$connect();
        console.log('✅ PostgreSQL Database connected successfully');

        app.listen(PORT, () => {
            console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
        });
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        process.exit(1);
    }
};

startServer();

// Handle Unhandled Rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    // server.close(() => process.exit(1));
});
