const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Schema = mongoose.Schema;
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: "admin",
  },
  created: {
    type: Date,
    default: new Date(),
  },
  updated: {
    type: Date,
    default: new Date(),
  },
  reset_password_token: {
    type: String,
    default: null,
  },
  reset_password_expires: {
    type: Date,
    default: null,
  },
});
// hash user password before saving into database
userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return next();
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});
const user = mongoose.model("admin", userSchema);
module.exports = user;
