const { addressModel, userModel } = require("@models");
const { sequelize } = require("@config/sequelize");
const { v4: uuidv4 } = require("uuid");

const AddressService = {
  // Get all addresses for user
  getAddressesByUserId: async (userId) => {
    try {
      const addresses = await addressModel.findAll({
        where: { userId: userId },
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
          userId: userId,
          isDefault: true,
        },
      });
      return address;
    } catch (error) {
      throw error;
    }
  },

  // Create new address
  createAddress: async (userId, data) => {
    const t = await sequelize.transaction();
    try {
      // 1. Lock user row for full isolation (FOR UPDATE)
      await userModel.findByPk(userId, { 
        lock: t.LOCK.UPDATE, 
        transaction: t 
      });

      // 2. Normalization & Validation
      const normalize = (val) => (val || "").toString().trim().replace(/\s+/g, ' ');

      const street = normalize(data.street);
      const ward = normalize(data.ward);
      const city = normalize(data.city);
      const label = data.label || 'Home';
      let isDefaultRequested = Boolean(data.isDefault || data.is_default);

      // Early rejection
      if (!street || !ward || !city) {
        throw new Error("Address fields (street, ward, city) are required and cannot be empty");
      }

      if (street.length > 255) throw new Error("Street address must be ≤ 255 characters");
      if (ward.length > 100) throw new Error("Ward must be ≤ 100 characters");
      if (city.length > 100) throw new Error("City must be ≤ 100 characters");

      // 3. Concurrency-safe Default Logic
      const addressCount = await addressModel.count({ 
        where: { userId }, 
        transaction: t 
      });

      // Force default if it's the first address
      const finalIsDefault = addressCount === 0 ? true : isDefaultRequested;

      // 4. Reset existing defaults if this one is default
      if (finalIsDefault) {
        await addressModel.update(
          { isDefault: false },
          { 
            where: { userId, isDefault: true }, 
            transaction: t 
          }
        );
      }

      // 5. Generate UUID and Insert
      const addressId = uuidv4();
      await addressModel.create(
        {
          addressId,
          userId,
          street,
          ward,
          city,
          label,
          isDefault: finalIsDefault,
        },
        { transaction: t }
      );

      // 6. Consistent Re-fetch inside transaction
      const newAddress = await addressModel.findByPk(addressId, { transaction: t });

      await t.commit();
      return newAddress;
    } catch (error) {
      if (t) await t.rollback();
      console.error("CREATE ADDRESS TRANSACTION FAILED:", error);
      throw error;
    }
  },

  // Update address
  updateAddress: async (addressId, userId, updateData) => {
    try {
      // Verify address belongs to user
      const address = await addressModel.findOne({
        where: { addressId, userId },
      });
      if (!address) {
        throw new Error("Address not found");
      }

      // Handle default change
      if (updateData.isDefault || updateData.is_default) {
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
        where: { addressId, userId },
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
        { isDefault: false },
        { where: { userId: userId } }
      );

      // Set new default if specified
      if (addressId) {
        await addressModel.update(
          { isDefault: true },
          { where: { addressId: addressId, userId: userId } }
        );
      }
      return true;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = AddressService;
