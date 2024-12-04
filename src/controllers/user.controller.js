const userService = require("../services/CRUD.services");
const dotenv = require("dotenv");
const { generateToken } = require("../utilities/commonFunctions");
const ErrorHandler = require("../utilities/ErrorHandler");
const { encryptToken } = require("../utilities/cryptographySecurity");
const { handleSession } = require("../services/dbCommonFunction");
const { db } = require("../config/db");

dotenv.config();
const Session = db.Session;

// Controller for User Registration
const createUser = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Validate required fields
    if (!email || !password || !firstName) {
      throw new ErrorHandler("Required fields are missing.", 400);
    }

    // Pass data to the service layer
    const userData = { email, password, firstName, lastName };
    const user = await userService.createUser(userData, next);
    if (!user) {
      // If no user is returned, it means an error was passed to `next`
      return; // Stop execution
    }

    res.status(201).json({
      success: true,
      message: "User created successfully.",
      token,
    });
  } catch (error) {
    next(error); // Pass errors to the central error-handling middleware
  }
};

// Controller for User Login
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ErrorHandler("Email and password are required.", 400);
    }

    const user = await userService.loginUser(email, password, next);
    // If user creation is successful, generate JWT token
    const tokenObj = await generateToken(user);
    const accessToken = encryptToken(tokenObj.accessToken);
    const refreshToken = encryptToken(tokenObj.refreshToken);
    await handleSession(user.id, refreshToken, Session);
    res.status(200).json({
      message: "Login successful.",
      token: accessToken,
      refreshToken: refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

// Controller for Getting User Profile
const getUserProfile = async (req, res, next) => {
  try {
    const userId = req.user.id; // Assuming you're using middleware to set req.user after authentication

    const user = await userService.getUserProfile(userId);

    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

// Controller for Updating User Profile
const updateUserProfile = async (req, res, next) => {
  try {
    const userId = req.user.id; // Assuming you're using middleware to set req.user after authentication
    const { firstName, lastName, email, password } = req.body;

    const updateData = { firstName, lastName, email, password };
    const updatedUser = await userService.updateUserProfile(userId, updateData);

    res
      .status(200)
      .json({ message: "Profile updated successfully.", updatedUser });
  } catch (error) {
    next(error);
  }
};

// Controller for Deleting a User
const deleteUser = async (req, res, next) => {
  try {
    const userId = req.user.id; // Assuming you're using middleware to set req.user after authentication

    const deletedUser = await userService.deleteUser(userId);

    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  deleteUser,
};
