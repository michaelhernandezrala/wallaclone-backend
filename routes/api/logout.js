/**
 * logout.js
 * Module to logout Wallaclone
 */
"use strict";

const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { Users } = require("../../models/Users");

// GET /logout
router.get("/logout", (req, res, next) => {
  if (req.session) {
    // delete session object
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      } else {
        return res.redirect("/");
      }
    });
  }
});
