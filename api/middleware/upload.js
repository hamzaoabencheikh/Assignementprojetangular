const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
require('dotenv').config();

const storage = new GridFsStorage({
    url: process.env.DATABASE_URL,
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => {
        const match = [];

        if (match.indexOf(file.mimetype) != -1) {
            const filename = `${Date.now()}-assignementdevoir-${file.originalname}`;
            return filename;
        }

        return {
            bucketName: "photos",
            filename: `${Date.now()}-assignementdevoir-${file.originalname}`,
        };
    },
});


module.exports = multer({ storage });