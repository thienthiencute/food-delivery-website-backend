const {
  getProfile,
  updateProfile,
  changePassword,
} = require("@services/userService");
const {
  getAddressesByUserId,
  createAddress,
  updateAddress: updateAddressService,
  deleteAddress: deleteAddressService,
  setDefaultAddress,
} = require("@services/addressService");

class UserController {
  // GET /profile - Get user profile with addresses
  getProfile = async (req, res) => {
    try {
      const userId = req.user.user_id; // From authMiddleware
      const profile = await getProfile(userId);
      res.json({
        success: true,
        data: profile,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message || "Failed to get profile",
      });
    }
  };

  // PUT /profile - Update profile (name, phone, avatar)
  updateProfile = async (req, res) => {
    try {
      const userId = req.user.user_id;
      const avatarFile = req.file; // From multer
      const profile = await updateProfile(userId, req.body, avatarFile);

      res.json({
        success: true,
        message: "Profile updated successfully",
        data: profile,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message || "Failed to update profile",
      });
    }
  };

  // PUT /password - Change password
  changePassword = async (req, res) => {
    try {
      const userId = req.user.user_id;
      const { oldPassword, newPassword } = req.body;

      if (!oldPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: "Old and new password required",
        });
      }

      await changePassword(userId, oldPassword, newPassword);

      res.json({
        success: true,
        message: "Password changed successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to change password",
      });
    }
  };

  // GET /addresses - Get all addresses
  getAddresses = async (req, res) => {
    try {
      const userId = req.user.user_id;
      const addresses = await getAddressesByUserId(userId);
      res.json({
        success: true,
        data: addresses,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message || "Failed to get addresses",
      });
    }
  };

  // POST /addresses - Add new address
  addAddress = async (req, res) => {
    try {
      const userId = req.user.user_id;
      const address = await createAddress(userId, req.body);
      res.status(201).json({
        success: true,
        message: "Address added successfully",
        data: address,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message || "Failed to add address",
      });
    }
  };

  // PUT /addresses/:id - Update address
  updateAddress = async (req, res) => {
    try {
      const userId = req.user.user_id;
      const { id } = req.params;
      const address = await updateAddress(id, userId, req.body);
      res.json({
        success: true,
        message: "Address updated successfully",
        data: address,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message || "Failed to update address",
      });
    }
  };

  // DELETE /addresses/:id - Delete address
  deleteAddress = async (req, res) => {
    try {
      const userId = req.user.user_id;
      const { id } = req.params;
      await deleteAddress(id, userId);
      res.json({
        success: true,
        message: "Address deleted successfully",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message || "Failed to delete address",
      });
    }
  };

  // PUT /addresses/:id/default - Set default address
  setDefaultAddress = async (req, res) => {
    try {
      const userId = req.user.user_id;
      const { id } = req.params;
      await setDefaultAddress(userId, id);
      res.json({
        success: true,
        message: "Default address updated successfully",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message || "Failed to set default address",
      });
    }
  };
}

module.exports = new UserController();
