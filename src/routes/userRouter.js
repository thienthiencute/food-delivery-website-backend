const express = require("express");
const router = express.Router();

const userController = require("@controllers/userController");
const { profileUpload } = require("@config/multer");
const { authMiddleware } = require("../middlewares/authMiddleware");

/**
 * @swagger
 * /api/user/search:
 *   get:
 *     summary: Find user by query
 *     tags:
 *       - User
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         required: true
 *         description: Keyword to search (username, email, or phone)
 *     responses:
 *       200:
 *         description: User(s) found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.get("/search", authMiddleware, userController.findUser);

/**
 * @swagger
 * /api/user/profile:
 *   get:
 *     summary: Get user profile
 *     tags:
 *       - User
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 */
router.get("/profile", authMiddleware, userController.getProfile);

/**
 * @swagger
 * /api/user/profile:
 *   put:
 *     summary: Update user profile
 *     tags:
 *       - User
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input
 */
router.put("/profile", authMiddleware, profileUpload.single("avatar"), userController.updateProfile);

/**
 * @swagger
 * /api/user/password:
 *   put:
 *     summary: Change user password
 *     tags:
 *       - User
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               old_password:
 *                 type: string
 *               new_password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Invalid old password
 */
router.put("/password", authMiddleware, userController.changePassword);

/**
 * @swagger
 * /api/user/addresses:
 *   get:
 *     summary: Get user addresses
 *     tags:
 *       - User - Addresses
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Addresses retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Address'
 *       401:
 *         description: Unauthorized
 */
router.get("/addresses", authMiddleware, userController.getAddresses);

/**
 * @swagger
 * /api/user/addresses:
 *   post:
 *     summary: Add new address
 *     tags:
 *       - User - Addresses
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               street:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               zip_code:
 *                 type: string
 *               is_default:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Address added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Address'
 *       400:
 *         description: Invalid input
 */
router.post("/addresses", authMiddleware, userController.addAddress);

/**
 * @swagger
 * /api/user/addresses/{id}:
 *   put:
 *     summary: Update address
 *     tags:
 *       - User - Addresses
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               street:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               zip_code:
 *                 type: string
 *     responses:
 *       200:
 *         description: Address updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Address'
 *       404:
 *         description: Address not found
 */
router.put("/addresses/:id", authMiddleware, userController.updateAddress);

/**
 * @swagger
 * /api/user/addresses/{id}:
 *   delete:
 *     summary: Delete address
 *     tags:
 *       - User - Addresses
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Address deleted successfully
 *       404:
 *         description: Address not found
 */
router.delete("/addresses/:id", authMiddleware, userController.deleteAddress);

/**
 * @swagger
 * /api/user/addresses/{id}/default:
 *   put:
 *     summary: Set address as default
 *     tags:
 *       - User - Addresses
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Default address set successfully
 *       404:
 *         description: Address not found
 */
router.put("/addresses/:id/default", authMiddleware, userController.setDefaultAddress);

module.exports = router;
