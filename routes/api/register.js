/**
 * register.js
 * Module to sign up into Wallaclone
 */
'use strict';

const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { User } = require('../../models');

// POST /api/register
router.post('/', async (req, res, next) => {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    console.log(name, email, password);
    const hashedPassword = User.hashPassword(password);

    console.log('estoy en el backend', name, email, password);

    // Check for user
    const user = await User.insertMany({
      name: name,
      email: email,
      password: hashedPassword,
    });
    res.json({
      _id: user[0]._id,
      name: user[0].name,
      email: user[0].email,
      ok: true,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
