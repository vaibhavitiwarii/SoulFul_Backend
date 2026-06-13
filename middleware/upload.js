const multer = require('multer');

// Store files in memory (buffer) instead of disk
const storage = multer.memoryStorage();

const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

const fileFilter = (req, file, cb) => {
  const isMimeValid = allowedTypes.includes(file.mimetype);
  const isExtValid = /\.(jpg|jpeg|png|webp)$/i.test(file.originalname);

  if (isMimeValid && isExtValid) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

module.exports = upload;