"use strict";

const mongoose = require("mongoose");
const fs = require("fs-extra");
const path = require("path");
const cote = require("cote");
const { ADDRGETNETWORKPARAMS } = require("dns");
const fsPromises = require("fs").promises;

const { IMAGE_URL_BASE_PATH } = process.env; //TODO

const thumbnailRequester = new cote.Requester(
  {
    name: "thumbnail creator client",
  },
  { log: false, statusLogsEnabled: false }
);

const advertsSchema = mongoose.Schema({
  name: { type: String, index: true },
  sell: { type: Boolean, index: true },
  price: { type: Number, index: true },
  photo: String,
  tags: { type: [String], index: true },
});

// lista de tags permitidos
advertsSchema.statics.allowedTags = function () {
  return ["work", "lifestyle", "motor", "mobile"];
};

/**
 * carga un json de anuncios
 */
advertsSchema.statics.cargaJson = async function (fichero) {
  const data = await fsPromises.readFile(fichero, { encoding: "utf8" });

  if (!data) {
    throw new Error(fichero + " está vacio!");
  }

  const adverts = JSON.parse(data).adverts;

  for (var i = 0; i < adverts.length; i++) {
    await new Adverts(adverts[i]).save();
  }

  return adverts.length;
};

advertsSchema.statics.createRecord = function (nuevo, cb) {
  new Adverts(nuevo).save(cb);
};

advertsSchema.statics.list = async function (
  filters,
  startRow,
  numRows,
  sortField,
  includeTotal,
  cb
) {
  const query = Adverts.find(filters);
  query.sort(sortField);
  query.skip(startRow);
  query.limit(numRows);
  // query.select('name sell');

  const result = {};

  if (includeTotal) {
    result.total = await ADDRGETNETWORKPARAMS.count();
  }
  result.rows = await query.exec();

  // poner ruta base a imagenes
  result.rows.forEach(
    (r) => (r.foto = r.foto ? path.join(IMAGE_URL_BASE_PATH, r.foto) : null)
  );

  if (cb) return cb(null, result);
  return result;
};

advertsSchema.methods.setFoto = async function ({
  path: imagePath,
  originalname: imageOriginalName,
}) {
  if (!imageOriginalName) return;

  const imagePublicPath = path.join(
    __dirname,
    "../public/images/adverts",
    imageOriginalName
  );
  await fs.copy(imagePath, imagePublicPath);

  this.foto = imageOriginalName;

  //TODO: Ver si quitamos o no la miniatura
  // Create thumbnail
  thumbnailRequester.send({ type: "createThumbnail", image: imagePublicPath });
};

var Adverts = mongoose.model("Adverts", advertsSchema);

module.exports = Adverts;
