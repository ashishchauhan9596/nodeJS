const express = require("express");
const { createUser } = require("../controllers/user.controller");
const { createUserSchema } = require("../validations/userValidation");
const validationMiddleware = require("../middlewares/validationMiddleware");
const authMiddleware = require("../middlewares/authMiddleware");

const userRouter = express.Router();

userRouter
  .get("/allUsers", authMiddleware, async (req, res) => {
    res.status(200).json({
      success: true,
      message: "This is all user",
    });
  })
  .post("/register", validationMiddleware(createUserSchema), createUser);

module.exports = userRouter;
