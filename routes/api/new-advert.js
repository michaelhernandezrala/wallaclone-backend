'use strict';

const express = require('express');
const router = express.Router();
const Advert = require('../../models/Adverts');

// Crear nuevos anuncios
router.post('/', async (req, res, next) => {
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
