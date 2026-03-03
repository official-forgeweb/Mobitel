const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Use multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/', upload.single('image'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No image provided' });

    const stream = cloudinary.uploader.upload_stream(
        { folder: 'mobitel_cms' },
        (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: 'Upload to Cloudinary failed' });
            }
            res.json({ secure_url: result.secure_url });
        }
    );

    streamifier.createReadStream(req.file.buffer).pipe(stream);
});

module.exports = router;
