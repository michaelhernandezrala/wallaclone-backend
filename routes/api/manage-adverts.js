'use strict';

const express = require('express');
const router = express.Router();
const Anuncio = require('../../models/Adverts');

// Crear nuevos anuncios
router.post('/', async (req, res, next) => {
  try {
      const advertData = req.body;
      const advert = new Anuncio (advertData); // Crear anuncio en memoria
      const advertCreated = await advert.save();
      res.status(201).json({ result: advertCreated});
  } catch(err) {
      next(err)
  }
});

// Eliminar anuncios
router.delete('/:id', async (req, res, next) => {
  try {
      const _id = req.params.id;

      await Advert.deleteOne({_id: _id });
      res.json();
  } catch (err) {
      next(err);
  }
});

// Actualizar anuncios
router.put('/:id', async (req, res, next) => {
  try {
      const _id = req.params.id;
      const advertData = req.body;

      const advertUpdate = await Advert.findOneAndUpdate({ _id: _id }, advertData, {
          new: true // Devuelve estado final
      });

      if(!advertUpdate){
          res.status(404).json({ error: 'not found'})
          return;
      }

      res.json({ result: advertUpdate });
  } catch (err) {
      next(err);
  }
});

// Exportar
module.exports = router