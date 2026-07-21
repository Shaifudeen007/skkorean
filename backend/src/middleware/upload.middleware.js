const multer = require("multer");
const path = require("path");

const createStorage = (folder) => multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `uploads/${folder}`);
    },
    filename: function (req, file, cb) {
        const uniqueName = Date.now() + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

const fileFilter = (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];

    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only JPG, PNG and WEBP images are allowed"), false);
    }
};

const uploadProduct = multer({ storage: createStorage("products"), fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });
const uploadGallery = multer({ storage: createStorage("gallery"), fileFilter, limits: { fileSize: 8 * 1024 * 1024 } });

// Keep default export for backwards compatibility
const upload = uploadProduct;
upload.uploadProduct = uploadProduct;
upload.uploadGallery = uploadGallery;

module.exports = upload;
