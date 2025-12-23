const AuthenticationRouter = require("express").Router();

// Generate /register route
AuthenticationRouter.post(
  "/register",
  require("../service/AuthenticationService").register
);

module.exports = AuthenticationRouter;
