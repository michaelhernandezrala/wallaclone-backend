'use strict';

const express = require('express');
const router = express.Router();
const Advert = require('../../models/Adverts');

// Crear nuevos anuncios
router.post('/', async (req, res, next) => {
  try {
    const advertData = req.body;
    const advert = new Advert(advertData); // Crear anuncio en memoria
    const advertCreated = await advert.save();
    res.status(201).json({ result: advertCreated });
  } catch (err) {
    next(err);
  }
});

// Exportar
module.exports = router;
