'use strict';

const mongoose = require('mongoose');
const fs = require('fs-extra');
const path = require('path');
const cote = require('cote');
const fsPromises = require('fs').promises;

const { IMAGE_URL_BASE_PATH } = process.env;

const thumbnailRequester = new cote.Requester(
  {
    name: 'thumbnail creator client',
  },
  { log: false, statusLogsEnabled: false }
);

const advertSchema = mongoose.Schema(
  {
    name: { type: String, index: true },
    sale: { type: Boolean, index: true },
    price: { type: Number, index: true },
    photo: String,
    tags: { type: [String], index: true },
  },
  {}
);

// Lista de tags permitidos
advertSchema.statics.allowedTags = function () {
  return ['work', 'lifestyle', 'motor', 'mobile'];
};

//Carga un json de anuncios
advertSchema.statics.loadJSON = async function (file) {
  const data = await fsPromises.readFile(file, { encoding: 'utf8' });

  if (!data) {
    throw new Error(fichero + ' is empty!');
  }

  const adverts = JSON.parse(data).adverts;

  for (var i = 0; i < ads.length; i++) {
    await new Adverts(adverts[i]).save();
  }

  return adverts.length;
};

advertSchema.statics.createRecord = function (n, cb) {
  new Adverts(n).save(cb);
};

advertSchema.statics.list = function (skip, limit, select, sort, order) {
  const finalSort = {};
  if (order == 'desc' && sort == 'name') {
    finalSort.name = -1;
  } else if (order == 'asc' && sort == 'name') {
    finalSort.name = 1;
  } else if (order == 'desc' && sort == 'price') {
    finalSort.price = -1;
  } else {
    finalSort.price = 1;
  }

  const query = Adverts.find();
  query.skip(skip);
  query.limit(limit);
  query.select(select);
  query.sort(finalSort);
  return query.exec();
};

advertSchema.methods.setFoto = async function ({
  path: imagePath,
  originalname: imageOriginalName,
}) {
  if (!imageOriginalName) return;

  const imagePublicPath = path.join(
    __dirname,
    '../public/images/adverts',
    imageOriginalName
  );
  await fs.copy(imagePath, imagePublicPath);

  this.foto = imageOriginalName;

  //TODO: Ver si quitamos o no la miniatura
  // Create thumbnail
  thumbnailRequester.send({ type: 'createThumbnail', image: imagePublicPath });
};

const Adverts = mongoose.model('Adverts', advertSchema);

module.exports = Adverts;
