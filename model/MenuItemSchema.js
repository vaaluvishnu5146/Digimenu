// {
//   _id: ObjectId,
//   name: "Paneer Butter Masala",
//   description: "Creamy paneer curry",
//   price: 220,
//   categoryId: ObjectId,
//   isVeg: true,              // ⭐ key filter
//   isAvailable: true,        // out of stock handling
//   preparationTime: 15,      // optional
//   createdAt: ISODate,
//   updatedAt: ISODate
// }
// Create MenuItem schema and model
const mongoose = require("mongoose");

const MenuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    isVeg: {
      type: Boolean,
      default: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    preparationTime: {
      type: Number, // in minutes
      default: 15,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MenuItem", MenuItemSchema);
