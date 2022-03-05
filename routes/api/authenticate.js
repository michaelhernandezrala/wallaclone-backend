/**
 * register.js
 * Module to sign up into Wallaclone
 */
'use strict';

const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { User } = require('../../models');

// POST /api/authenticate
router.post('/', async (req, res, next) => {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    console.log(name, email, password);
    const hashedPassword = User.hashPassword(password);

    // Check for user
    const user = await User.findOne({
      name: name,
      email: email,
      password: hashedPassword,
    });

    console.log(user);

    // Validate name, email & password
    if (user && !user.name) {
      res.json({
        ok: false,
        error: 'This username exist into the DB. You must choose another name.',
      });
      return;
    }

    if (user && !user.email) {
      res.json({
        ok: false,
        error: 'This email exist into the DB. You must choose another email.',
      });
      return;
    }

    // Create the token
    jwt.sign(
      { _id: 1 },
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
