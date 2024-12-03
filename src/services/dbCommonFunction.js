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
const databaseExistFn = async (Model, data, next) => {
  try {
    const dataExist = await Model.findOne(data);
    // console.log(dataExist);
    return dataExist !== null ? true : false; // Return true if it exists, false otherwise
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

module.exports = {
  databaseUniqueIdExistFn,
  databaseCreateFn,
  databaseExistFn,
};
