const mongoose = require("mongoose");

module.exports = function connectDB() {
  const dbURI = process.env.MONGO_URI || "mongodb://localhost:27017/digimenu";

  mongoose.connect(dbURI);

  mongoose.connection.on("connected", () => {
    console.log("Mongoose connected to " + dbURI);
  });

  mongoose.connection.on("error", (err) => {
    console.log("Mongoose connection error: " + err);
  });

  mongoose.connection.on("disconnected", () => {
    console.log("Mongoose disconnected");
  });
};
