const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const SECRET_KEY = process.env.JWT_SECRET_KEY;

const getSaltRoundsForRole = (role) => {
  switch (role) {
    case "admin":
      return 14; // More secure for admins
    case "regular":
    default:
      return 12; // Default rounds
  }
};

const hashPassword = async (password, role = "regular") => {
  const saltRounds = getSaltRoundsForRole(role);
  const salt = await bcrypt.genSalt(saltRounds);
  return bcrypt.hash(password, salt);
};

// Helper function to generate JWT token
const generateToken = async (user) => {
  return jwt.sign({ userID: user.uniqueId, email: user.email }, SECRET_KEY, {
    expiresIn: "1h",
  });
};

module.exports = { generateToken, hashPassword };
