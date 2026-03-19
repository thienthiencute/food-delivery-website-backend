const userModel = require("@models/userModel");

const getUserByPhoneNumber = async (countryCode, phoneNumber) => {
    try {
        const user = await userModel.findOne({ where: { country_code: countryCode, phone_number: phoneNumber } });
        if (user) {
            console.log("User found:", user?.dataValues);
            return user;
        } else {
            console.log("No user found with that phone number");
            return;
        }
    } catch (error) {
        console.log(error);
    }
};

const getUserByEmail = async (email) => {
    try {
        const user = await userModel.findOne({ where: { email: email } });
        if (user) {
            console.log("User found:", user?.dataValues);
            return user;
        } else {
            console.log("No user found with that email");
            return;
        }
    } catch (error) {
        console.log(error);
    }
};

const getUserById = async (userId) => {
    try {
        const user = await userModel.findOne({ where: { user_id: userId } });
        if (user) {
            console.log("User found:", user?.dataValues);
            return user?.dataValues;
        } else {
            console.log("No user found with that id");
            return;
        }
    } catch (error) {
        console.log(error);
    }
};

const createUser = async (username, type_login, country_code, phone_number, password) => {
    try {
        const newUser = await userModel.create({
            username,
            type_login,
            phone_number,
            country_code,
            password,
        });
        console.log("User created:", newUser);
        return newUser;
    } catch (error) {
        console.log(error);
    }
};

const changePassword = async (userId, newPasswordHashed) => {
    try {
        const result = await userModel.update(
            {
                password: newPasswordHashed,
            },
            {
                where: {
                    user_id: userId,
                },
            },
        );

        console.log("Update password:", result);
    } catch (error) {
        console.log("Change password failed:", error);
    }
};

module.exports = {
    getUserByPhoneNumber,
    getUserById,
    createUser,
    getUserByEmail,
    changePassword,
};
