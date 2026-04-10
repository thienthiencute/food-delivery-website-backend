const voucherController = require("@controllers/voucherController");
const express = require("express");
const router = express.Router();

// POST
router.post("/api/check-voucher", voucherController.checkVoucher);

module.exports = router;
