/**
 * login.js
 * Module to login into Wallaclone
 */
'use strict';

const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { User } = require('../../models');

// POST /auth/login
router.post('/', async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    console.log(req.body);
    console.log('backend', email, password);
    const hashedPassword = User.hashPassword(password);

    const user = await User.findOne({
      email: email,
      password: hashedPassword,
    });

    console.log(user);

    if (!user) {
      // Credentials ok
      res.json({ ok: false, error: 'Invalid credentials.' });
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
