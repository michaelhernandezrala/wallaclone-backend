/**
 * jwtAuth.js
 * Module that returns a middleware that responds with an error if there is no user
 */
"use strict";

const jwt = require("jsonwebtoken");

module.exports = function () {
  // returns a middleware that responds with an error if there is no user
  return function (req, res, next) {
    const token =
      req.body.token || req.query.token || req.get("x-access-token");

    if (!token) {
      const err = new Error("No token provided");
      err.status = 401;
      return next(err);
    }

    // I has the token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return next(err);
      }

      req.userId = decoded._id;
      next();
    });
  };
};
