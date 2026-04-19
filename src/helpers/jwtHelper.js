const { jwtDecode } = require("jwt-decode");
const jwt = require("jsonwebtoken");
const generateJWT = (user, expiresIn) => {
    const jwtSecretKey = process.env.JWT_SECRET || process.env.JWT_SECRET_KEY;

    const token = jwt.sign(
        { 
            user_id: user.userId || user.user_id, 
            username: user.username, 
            role: user.role 
        },
        jwtSecretKey,
        {
            expiresIn: expiresIn || "1h",
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
