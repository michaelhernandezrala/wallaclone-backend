/**
 * Users.js
 * Collection Users
 */
"use strict";

const mongoose = require("mongoose");
var hash = require("hash.js");

const userSchema = mongoose.Schema({
  name: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  typeUser: String, // anonymous or userWallaclone
  password: String,
});

// Cifrado de la password
userSchema.statics.hashPassword = function (plain) {
  return hash.sha256().update(plain).digest("hex");
};

var Users = mongoose.model("Users", userSchema);

module.exports = Users;
