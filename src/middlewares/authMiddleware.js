const jwt = require("jsonwebtoken");
const { decryptToken } = require("../utilities/cryptographySecurity");

const JWT_SECRET = process.env.JWT_SECRET_KEY;
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res
        .status(401)
        .json({ success: false, message: "Authorization header missing." });
    }

    // console.log(authHeader);
    const token = authHeader.split(" ")[1];
    // console.log(token);
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Token missing." });
    }

    const decryptedToken = await decryptToken(token);
    const payload = jwt.verify(decryptedToken, JWT_SECRET);
    console.log(payload);
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: error.message });
  }
};
module.exports = authMiddleware;
