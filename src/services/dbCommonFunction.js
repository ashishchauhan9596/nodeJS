const ErrorHandler = require("../utilities/ErrorHandler");

const databaseUniqueIdExistFn = async (Model, uniqueId, next) => {
  try {
    const uniqueIdExist = await Model.findOne({
      where: { uniqueId },
    });
    return uniqueIdExist === null ? true : false; // Return true if it exists, false otherwise
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Error checking unique ID existence:", 500));
  }
};
const databaseUserDataFn = async (Model, uniqueId, next) => {
  try {
    const userData = await Model.findOne({
      where: { uniqueId },
    });
    return userData;
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Error in getting database details.", 500));
  }
};
const databaseExistFn = async (Model, data, next) => {
  try {
    const dataExist = await Model.findOne(data);
    // console.log(dataExist);
    return dataExist !== null ? dataExist : false; // Return true if it exists, false otherwise
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Error checking data existence:", 500));
  }
};
const databaseCreateFn = async (Model, data, next) => {
  try {
    return await Model.create(data);
  } catch (error) {
    console.log("error", error);
    return next(
      new ErrorHandler(`Error while creating new entry on ${Model}:`, 500)
    );
  }
};
const handleSession = async (userId, jwtRefreshToken, Session) => {
  try {
    // Check if a session already exists for the user
    const existingSession = await Session.findOne({ where: { userId } });

    if (existingSession) {
      // Update the token for the existing session
      await existingSession.update({ jwtRefreshToken });
      return {
        message: "Session updated successfully.",
        session: existingSession,
      };
    } else {
      // Create a new session if none exists
      const newSession = await Session.create({ userId, jwtRefreshToken });
      return { message: "Session created successfully.", session: newSession };
    }
  } catch (error) {
    console.error("Error handling session:", error);
    throw new ErrorHandler(500, "Failed to handle session.");
  }
};

module.exports = {
  databaseUniqueIdExistFn,
  databaseCreateFn,
  databaseExistFn,
  databaseUserDataFn,
  handleSession,
};
