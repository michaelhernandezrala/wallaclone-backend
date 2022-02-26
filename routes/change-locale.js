const express = require("express");
const router = express.Router();

/** GET /change-locale */
router.get("/:locale", (req, res, next) => {
  // recoger a que idioma queremos cambiar
  const locale = req.params.locale;

  // poner una cookie en la respuesta que indique el idioma que me piden
  res.cookie("wallaclone-locale", locale, {
    maxAge: 1000 * 60 * 60 * 24 * 30, // tiempo de vida en milisegundos: 1 mes
  });

  // hacer una redirección a la misma página donde estaba el usuario
  res.redirect(req.get("referer"));
});

module.exports = router;
