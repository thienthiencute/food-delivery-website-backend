const voucherController = require("@controllers/voucherController");
const express = require("express");
const router = express.Router();

/**
 * @swagger
 * /api/voucher/check-voucher:
 *   post:
 *     summary: Check voucher validity
 *     tags:
 *       - Voucher
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               voucher_code:
 *                 type: string
 *               total_amount:
 *                 type: number
 *                 description: Total order amount
 *     responses:
 *       200:
 *         description: Voucher validated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 discount:
 *                   type: number
 *                 voucher:
 *                   $ref: '#/components/schemas/Voucher'
 *       400:
 *         description: Invalid or expired voucher
 *       401:
 *         description: Unauthorized
 */
router.post("/check-voucher", voucherController.checkVoucher);

module.exports = router;
