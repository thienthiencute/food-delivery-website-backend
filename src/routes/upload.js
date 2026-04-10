const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");

router.post("/api/", upload.single("image"), (req, res) => {
  res.json({
    url: req.file.path, 
  });
});

module.exports = router;