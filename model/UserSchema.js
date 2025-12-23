// Design user schema with Mongoose
const mongoose = require("mongoose");

// {
//   "username": "john_doe",
//   "email": "john.doe@example.com",
//   "phone": "1234567890",
//   "dob": "1990-01-01",
//   "password": "securePassword123",
//   "role": "patient"
// }

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["biller", "manager"],
      default: "biller",
    },
  },
  { timestamps: true }
);

// Hash password before saving
// UserSchema.pre("save", async function (next) {
//   try {
//     if (!this.isModified("password")) return next();
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
//   } catch (error) {
//     console.error("Error in password hashing:", error);
//     next(error); // Pass the error to the next middleware
//   }
// });

// Method to compare password
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return candidatePassword === this.password;
};

module.exports = mongoose.model("User", UserSchema);
