/**
 * Users.js
 * Collection Users
 */
"use strict";

const mongoose = require("mongoose");
var hash = require("hash.js");

const userSchema = mongoose.Schema({
  name: { type: String, unique: true },
  email: String,
  typeUser: String, // anonymous or userWallaclone
  password: String,
});

userSchema.statics.hashPassword = function (plain) {
  return hash.sha256().update(plain).digest("hex");
};

var Users = mongoose.model("Users", userSchema);

module.exports = Users;
