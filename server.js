// Web server - Will server static files
// Api server - Will handle api calls

const express = require("express");
const path = require("path");

const server = express();
const PORT = process.env.PORT || 3000;

// Connect to the database
const connectDB = require("./db");
connectDB();

// Configure environment variables
require("dotenv").config();

// Middleware to serve static files from the 'public' directory
server.use(express.static(path.join(__dirname, "public")));

// Middleware to parse JSON bodies
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// Set EJS as the templating engine
server.set("view engine", "ejs");

// Importing routes
const WebRouter = require("./webroute");
const ApiRouter = require("./api");

// Using the imported routes
server.use("/", WebRouter);
server.use("/api", ApiRouter);

// Spin up the server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
