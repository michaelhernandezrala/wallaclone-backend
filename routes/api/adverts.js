/**
 * adverts.js
 * Module to show all the adverts
 */
'use strict';
const express = require("express");
const router = express.Router();
const Adverts = require('../../models/Adverts');

// GET /adverts
router.get("/", async (req, res, next) => {

  try {
    const name = req.query.name;
    const price = req.query.price;
    const skip = parseInt(req.query.skip);
    const limit = parseInt(req.query.limit);
    const select = req.query.select;
    const sort = req.query.sort;
    const filters = {};

    const adverts = await Adverts.list(filters, skip, limit, select, sort);
    console.log(adverts)
    res.json({ results: adverts })
  } catch (err) {
    next(err);
  }
});

module.exports = router;