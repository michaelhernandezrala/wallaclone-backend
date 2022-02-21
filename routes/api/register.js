/**
 * register.js
 * Module to sign up into Wallaclone
 */
"use strict";

const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { User } = require("../../models");

// POST /auth/register
router.post("/", async (req, res, next) => {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    const hashedPassword = User.hashPassword(password);

    // Check for user
    const user = await User.findOne({
      name: name,
      email: email,
      password: hashedPassword,
    });

    // Validate name, email & password
    if (!user.name) {
      res.json({
        ok: false,
        error: "This username exist into the DB. You must choose another name.",
      });
      return;
    }

    if (!user.email) {
      res.json({
        ok: false,
        error: "This email exist into the DB. You must choose another email.",
      });
      return;
    }

    // Create the token
    jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRE,
      },
      (err, token) => {
        if (err) {
          return next(err);
        }
        // respondemos con un JWT
        res.json({ ok: true, token: token });
      }
    );
  } catch (err) {
    next(err);
  }
});

module.exports = router;
