const voucherController = require("@controllers/voucherController");
const express = require("express");
const router = express.Router();

// POST
router.post("/check-voucher", voucherController.checkVoucher);

module.exports = router;
