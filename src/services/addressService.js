const { addressModel, userModel } = require("@models");

const AddressService = {
  // Get all addresses for user
  getAddressesByUserId: async (userId) => {
    try {
      const addresses = await addressModel.findAll({
        where: { user_id: userId },
        order: [
          ["is_default", "DESC"],
          ["created_at", "DESC"],
        ],
      });
      return addresses;
    } catch (error) {
      throw error;
    }
  },

  // Get default address
  getDefaultAddress: async (userId) => {
    try {
      const address = await addressModel.findOne({
        where: {
          user_id: userId,
          is_default: true,
        },
      });
      return address;
    } catch (error) {
      throw error;
    }
  },

  // Create new address
  createAddress: async (userId, addressData) => {
    try {
      // Ensure no other default if this is default
      if (addressData.is_default) {
        await AddressService.setDefaultAddress(userId, null); // Reset others
      }

      const newAddress = await addressModel.create({
        ...addressData,
        user_id: userId,
      });
      return newAddress;
    } catch (error) {
      throw error;
    }
  },

  // Update address
  updateAddress: async (addressId, userId, updateData) => {
    try {
      // Verify address belongs to user
      const address = await addressModel.findOne({
        where: { address_id: addressId, user_id: userId },
      });
      if (!address) {
        throw new Error("Address not found");
      }

      // Handle default change
      if (updateData.is_default) {
        await AddressService.setDefaultAddress(userId, addressId);
      }

      await address.update(updateData);
      return address;
    } catch (error) {
      throw error;
    }
  },

  // Delete address
  deleteAddress: async (addressId, userId) => {
    try {
      const result = await addressModel.destroy({
        where: { address_id: addressId, user_id: userId },
      });
      if (result === 0) {
        throw new Error("Address not found");
      }
      return result;
    } catch (error) {
      throw error;
    }
  },

  // Set default address (resets others for user)
  setDefaultAddress: async (userId, addressId) => {
    try {
      // Reset all defaults for user
      await addressModel.update(
        { is_default: false },
        { where: { user_id: userId } },
      );

      // Set new default if specified
      if (addressId) {
        await addressModel.update(
          { is_default: true },
          { where: { address_id: addressId, user_id: userId } },
        );
      }
      return true;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = AddressService;
