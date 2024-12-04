const express = require("express");
const { createUser, loginUser } = require("../controllers/user.controller");
const {
  createUserSchema,
  loginUserSchema,
} = require("../validations/userValidation");
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
  .post("/register", validationMiddleware(createUserSchema), createUser)
  .post("/login", validationMiddleware(loginUserSchema), loginUser);

module.exports = userRouter;
