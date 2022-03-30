'use strict';

const express = require('express');
const router = express.Router();
const Advert = require('../../models/Adverts');
const asyncHandler = require('express-async-handler');
const { body } = require('express-validator');

// Return the list of available tags
router.get('/tags', asyncHandler(async function (req, res) {
  const distinctTags = await Advert.distinct('tags');
  res.json({ result: distinctTags });
}));

// Crear nuevos anuncios
router.post('/',[
  body('tags').custom(tags => {
    const allowed = Advert.allowedTags();
    return tags.every(tag => allowed.includes(tag)) 
  }).withMessage(`allowed tags ${Advert.allowedTags()}`)
], async (req, res, next) => {
  try {
    const advertData = req.body;
    console.log('advertData', advertData);
    const advert = new Advert(advertData); // Crear anuncio en memoria
    console.log('advert', advert);
    const advertCreated = await advert.save();
    console.log('advertCreated', advertCreated);
    res.status(201).json({ result: advertCreated });
  } catch (err) {
    next(err);
  }
});

// Exportar
module.exports = router;
