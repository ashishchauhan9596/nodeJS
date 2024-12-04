const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const { hashPassword } = require("../utilities/commonFunctions");
const {
  databaseUniqueIdExistFn,
  databaseCreateFn,
  databaseExistFn,
} = require("./dbCommonFunction");
const { db } = require("../config/db");
const ErrorHandler = require("../utilities/ErrorHandler");

const User = db.User;

// Service to create a user
const createUser = async (userData, next) => {
  try {
    const { password, email } = userData;

    // Hash the password before saving
    const hashedPassword = await hashPassword(password);

    const existData = {
      where: { email },
    };

    // Check if email already exists
    const emailExits = await databaseExistFn(User, existData, next);
    if (emailExits) {
      return next(new ErrorHandler("Email already exists.", 409));
    }

    // Generate the unique ID using uuidv4
    let uniqueId;
    let isUnique = false;

    while (!isUnique) {
      uniqueId = uuidv4();
      isUnique = await databaseUniqueIdExistFn(User, uniqueId, next);
      // console.log("isUnique", isUnique);
    }

    const data = {
      ...userData,
      password: hashedPassword,
      uniqueId, // Add the generated unique ID
    };

    // Create the user
    const user = await databaseCreateFn(User, data, next);
    return user;
  } catch (error) {
    console.error("Error in createUser:", error);
    return next(new ErrorHandler("Internal server error.", 500));
  }
};

// Service to login a user (validate email and password)
const loginUser = async (email, password, next) => {
  try {
    const existData = {
      where: { email },
    };

    // Check if email already exists
    const user = await databaseExistFn(User, existData, next);
    if (!user) {
      return next(new ErrorHandler("User not found.", 404));
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      // throw new Error("Invalid credentials.");
      return next(new ErrorHandler("Invalid credentials.", 401));
    }
    return user;
  } catch (error) {
    console.error("Error in createUser:", error);
    return next(new ErrorHandler("Internal server error.", 500));
  }
};

// Service to get user profile
const getUserProfile = async (userId) => {
  const user = await User.findOne({ where: { id: userId } });
  if (!user) {
    throw new Error("User not found.");
  }

  return user;
};

// Service to update a user profile
const updateUserProfile = async (userId, updateData) => {
  const user = await User.findOne({ where: { id: userId } });

  if (!user) {
    throw new Error("User not found.");
  }

  // Only update the fields that are provided
  user.firstName = updateData.firstName || user.firstName;
  user.lastName = updateData.lastName || user.lastName;
  user.email = updateData.email || user.email;

  // If password is provided, hash it
  if (updateData.password) {
    const hashedPassword = await bcrypt.hash(updateData.password, 10);
    user.password = hashedPassword;
  }

  await user.save();
  return user;
};

// Service to delete a user
const deleteUser = async (userId) => {
  const user = await User.findOne({ where: { id: userId } });

  if (!user) {
    throw new Error("User not found.");
  }

  await user.destroy();
  return user;
};

module.exports = {
  createUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  deleteUser,
};
