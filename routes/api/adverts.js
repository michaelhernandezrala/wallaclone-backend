/**
 * adverts.js
 * Module to show all the adverts
 */
'use strict';
const express = require('express');
const router = express.Router();
const Advert = require('../../models/Adverts');

// GET api/adverts
router.get('/', async (req, res, next) => {
  try {
    const name = req.query.name;
    const price = req.query.price;
    const skip = parseInt(req.query.skip);
    const limit = parseInt(req.query.limit);
    const select = req.query.select;
    const sort = req.query.sort;
    const filters = {};

    const adverts = await Advert.list(filters, skip, limit, select, sort);
    console.log(adverts);
    res.json({ results: adverts });
  } catch (err) {
    next(err);
  }
});

// Detail
// GET /api/adverts:id
router.get('/:id', async (req, res, next) => {
  try {
    const _id = req.params.id;
    console.log('id', _id);
    const advert = await Advert.find({ _id: _id });
    console.log('backend', advert);
    res.json({ result: advert });
  } catch (err) {
    next(err);
  }
});

// Delete adverts
// DELETE /api/adverts: id
router.delete('/:id', async (req, res, next) => {
  try {
    const _id = req.params.id;

    await Advert.deleteOne({ _id: _id });
    res.json();
  } catch (err) {
    next(err);
  }
});

// Update adverts
// PUT /api/adverts:id
router.put('/:id', async (req, res, next) => {
  try {
    const _id = req.params.id;
    const advertData = req.body;

    const advertUpdate = await Advert.findOneAndUpdate(
      { _id: _id },
      advertData,
      {
        new: true, // Devuelve estado final
      }
    );

    if (!advertUpdate) {
      res.status(404).json({ error: 'not found' });
      return;
    }

    res.json({ result: advertUpdate });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
