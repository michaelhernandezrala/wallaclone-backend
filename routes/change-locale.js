/**
 * change-locale.js
 * Module that manages the change of language
 */
const express = require("express");
const router = express.Router();

/** GET /change-locale */
router.get("/:locale", (req, res, next) => {
  // pick which language we want to change to
  const locale = req.params.locale;

  // put a cookie in the response that indicates the language that they ask me
  res.cookie("wallaclone-locale", locale, {
    maxAge: 1000 * 60 * 60 * 24 * 30, // tiempo de vida en milisegundos: 1 mes
  });

  // make a redirection to the same page where the user was
  res.redirect(req.get("referer"));
});

module.exports = router;
