/**
 * forgetPassword.js
 * Module to login into Wallaclone
 */
"use strict";

const express = require("express");
//const jwt = require("jsonwebtoken");
const router = express.Router();
const { Users } = require("../../models/Users");

// GET /forgetPassword
router.get("/forgetPassword", (req, res, next) => {
  res.render("forget.ejs");
});

// POST /forgetPassword
router.post("/forgetPassword", (req, res, next) => {
  Users.findOne({ email: req.body.email }, (err, data) => {
    if (!data) {
      res.send({ Success: "This Email Is not regestered!" });
    } else {
      if (req.body.password == req.body.passwordConf) {
        data.password = req.body.password;
        data.passwordConf = req.body.passwordConf;

        data.save((err, Person) => {
          if (err) console.log(err);
          else console.log("Success");
          res.send({ Success: "Password changed!" });
        });
      } else {
        res.send({
          Success: "Password does not matched! Both Password should be same.",
        });
      }
    }
  });
});

module.exports = router;
