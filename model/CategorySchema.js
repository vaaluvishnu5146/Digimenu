// {
//   _id: ObjectId,
//   name: "Main Course",
//   isActive: true,
//   createdAt: ISODate,
//   updatedAt: ISODate
// }
// Create Category schema and model
const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", CategorySchema);
