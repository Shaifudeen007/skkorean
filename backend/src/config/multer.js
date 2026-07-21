const multer = require('multer');
const path = require('path');
const fs = require('fs');

const createStorage = (folderName) => {
    return multer.diskStorage({
        destination: (req, file, cb) => {
            const dir = path.join(__dirname, `../../uploads/${folderName}`);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            cb(null, dir);
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
        }
    });
};

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload only images.'), false);
    }
};

const uploadProduct = multer({ 
    storage: createStorage('products'),
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

const uploadGallery = multer({ 
    storage: createStorage('gallery'),
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
});

module.exports = {
    uploadProduct,
    uploadGallery
};
