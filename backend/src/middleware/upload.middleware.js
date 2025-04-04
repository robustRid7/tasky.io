const multer = require("multer");
const fs = require("fs");
const path = require("path");

// ✅ Ensure Upload Directory Exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname) || "";
    cb(null, `${timestamp}-${file.originalname}${ext}`);
  },
});

// ✅ File Filter - Allow Images, Audio & CSV
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/png",
    "image/jpg",
    "image/jpeg",
    "image/webp",
    "image/svg+xml",
    "text/csv",
    "audio/mpeg",
    "audio/wav",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only images, audio, and CSV are allowed."), false);
  }
};

// ✅ Multer Upload Middleware (5MB Limit)
const upload = multer({ 
  storage, 
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

module.exports = upload;
