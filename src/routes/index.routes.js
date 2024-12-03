const express = require("express");
const userRouter = require("./user.routes");

const allRouter = express.Router();

const defaultRoutes = [
  {
    path: "/users",
    route: userRouter,
  },
];

defaultRoutes.forEach((route) => {
  allRouter.use(route.path, route.route);
});

module.exports = allRouter;
