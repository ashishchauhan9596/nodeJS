const fs = require("fs");
const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const moment = require("moment");
const { testDatabaseConnection, syncDatabase } = require("./src/config/db");
const errorMiddleware = require("./src/middlewares/errorMiddleware");

dotenv.config();

const app = express();

const logDir = path.join(__dirname, "logs");
const formattedDate = moment().format("YYYY-MM-DD");
const logFileName = `access-${formattedDate}.log`;
const logFile = path.join(logDir, logFileName);

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const accessLogStream = fs.createWriteStream(logFile, { flags: "a" });

app.use(cors());
app.use(helmet());

const customFormat =
  ":method :url :status - :response-time ms :remote-addr - :user-agent";
app.use(morgan(customFormat, { stream: accessLogStream }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allRouter = require("./src/routes/index.routes");
app.use("/api/v1", allRouter);

app.get("/", async (req, res) => {
  const data = await new Promise((resolve) => {
    setTimeout(() => {
      resolve("Welcome to your Node.js server!");
    }, 500);
  });
  res.send(data);
});

const PORT = process.env.PORT;

const startServer = async () => {
  try {
    await testDatabaseConnection(); // Test database connection
    await syncDatabase(); // Sync database models
    const server = app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });

    // Handle unexpected errors to close the server gracefully
    process.on("unhandledRejection", (reason) => {
      console.error("Unhandled Rejection:", reason);
      server.close(() => process.exit(1));
    });
  } catch (error) {
    console.error("Failed to start the server:", error.message);
    // Pass error to the global error handler
    app.use((req, res, next) => {
      next(error);
    });
    process.exit(1);
  }
};

startServer();

app.use(errorMiddleware);
