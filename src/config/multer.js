const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Thư mục lưu trữ tệp tin
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + ext); // Đổi tên tệp tin để tránh trùng lặp
    },
});

const upload = multer({ storage: storage });

module.exports = upload;
