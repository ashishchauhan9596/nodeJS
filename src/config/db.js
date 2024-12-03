const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");

dotenv.config();

const {
  DB_HOST,
  DB_USERNAME,
  DB_PASSWORD,
  DB_NAME,
  POOL_MAX,
  POOL_MIN,
  POOL_ACQUIRE,
  POOL_IDLE,
} = process.env;

const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
  host: DB_HOST,
  dialect: "mysql",
  logging: false,
  pool: {
    max: parseInt(POOL_MAX, 10),
    min: parseInt(POOL_MIN, 10),
    acquire: parseInt(POOL_ACQUIRE, 10),
    idle: parseInt(POOL_IDLE, 10),
  },
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require("../models/user.model")(sequelize, Sequelize);

// Test database connection
const testDatabaseConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error.message);
    throw new Error("Database connection failed. " + error.message);
  }
};

// Sync models
const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log("Database & tables synced successfully.");
  } catch (error) {
    console.error("Error syncing database:", error.message);
    throw new Error("Database synchronization failed. " + error.message);
  }
};

module.exports = { sequelize, testDatabaseConnection, syncDatabase, db };
