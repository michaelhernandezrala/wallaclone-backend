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
    const skip = parseInt(req.query._skip);
    const limit = parseInt(req.query._limit);
    const select = req.query.select;
    const sort = req.query._sort;
    const order = req.query._order;
    const adverts = await Advert.list(skip, limit, select, sort, order);
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
    const advert = await Advert.find({ _id: _id });
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
