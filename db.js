const mongoose = require("mongoose");

module.exports = function connectDB() {
  const dbURI =
    process.env.NODE_ENV != "development"
      ? `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@managetasksdevdb.stsiv.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
      : "mongodb://localhost:27017/digimenu";

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
