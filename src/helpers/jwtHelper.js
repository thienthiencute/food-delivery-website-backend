const { jwtDecode } = require("jwt-decode");
const jwt = require("jsonwebtoken");
const generateJWT = (user, expiresIn) => {
    const {
        user_id,
        username,
        fullname,
        email,
        country_code,
        phone_number,
        address,
        avatar_path,
        date_of_birth,
        role,
    } = user;

    const jwtSecretKey = process.env.JWT_SECRET_KEY;

    const token = jwt.sign(
        { user_id, username, fullname, email, country_code, phone_number, address, avatar_path, date_of_birth, role },
        jwtSecretKey,
        {
            expiresIn,
        },
    );

    return token;
};

const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);

    if (parts.length === 2) {
        return parts.pop().split(";").shift();
    }
    return null;
};

module.exports = {
    generateJWT,
};
