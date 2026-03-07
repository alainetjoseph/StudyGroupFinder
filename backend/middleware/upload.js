const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const fs = require("fs");

// ensure folders exist
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}
if (!fs.existsSync("uploads/temp")) {
  fs.mkdirSync("uploads/temp");
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/temp");
  },
  filename: function (req, file, cb) {
    const uniqueName =
      crypto.randomBytes(16).toString("hex") +
      path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf",
    "image/png",
    "image/jpeg",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation"
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 20MB
  fileFilter,
});

module.exports = upload;
