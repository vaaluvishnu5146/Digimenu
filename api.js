const ApiRouter = require("express").Router();

// Example API endpoint
ApiRouter.get("/api/hello", (req, res) => {
  res.json({ message: "Hello, World!" });
});

ApiRouter.use("/auth", require("./controller/AuthenticationController"));

module.exports = ApiRouter;
