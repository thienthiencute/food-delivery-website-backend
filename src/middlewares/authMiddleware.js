const jwt = require("jsonwebtoken");
const { jwtDecode } = require("jwt-decode");

const authMiddleware = (req, res, next) => {
    const jwtSecretKey = process.env.JWT_SECRET_KEY;

    // const token = req.cookies.token;
    const token = req.header("Authorization") && req.header("Authorization").split(" ")[1];

    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorize failed: No token provided" });
    }

    jwt.verify(token, jwtSecretKey, (err, decoded) => {
        if (err) {
            return res.status(403).json({ success: false, message: "Invalid or expired token" });
        }

        req.user = decoded;
        next();
    });
};

const authAdminMiddleware = (req, res, next) => {
    const jwtSecretKey = process.env.JWT_SECRET_KEY;
    const token = req.cookies.token;
    // const token = req.header("Authorization") && req.header("Authorization").split(" ")[1];

    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorize failed: No token provided" });
    }

    jwt.verify(token, jwtSecretKey, (err, decoded) => {
        if (err) {
            return res.status(403).json({ success: false, message: "Invalid or expired token" });
        }

        const { role } = jwtDecode(token);
        if (role !== "Admin") {
            return res
                .status(401)
                .json({ success: false, message: "Unauthorize failed: Only admin has the right of access" });
        }

        req.user = decoded;
        next();
    });
};
module.exports = { authMiddleware, authAdminMiddleware };
