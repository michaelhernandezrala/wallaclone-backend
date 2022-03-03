/**
 * app.js
 * Start of the application
 */
"use strict";

var createError = require("http-errors");
const express = require("express");
const path = require("path");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const loginController = require("./controllers/LoginController");
const registerController = require("./controllers/RegisterControler");
const jwtAuth = require("./lib/jwtAuth");

require("dotenv").config(); // The environment variables are initialized from the file .env

const i18n = require("./lib/i18nSetup");

// Connect DB & register models
require("./models");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "/views/"));
app.set("view engine", "ejs");

// log
if (process.env.LOG_FORMAT !== "nolog") {
  app.use(logger(process.env.LOG_FORMAT || "dev"));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(i18n.init);

// Global Template variables
app.locals.title = "Wallaclone";
app.locals.typeUser = "anonymous"; // Luego se cambiará a userWallaclone cuando se trate de un usuario de la plataforma

// API
app.post("/api/register", require("./routes/api/register"));

// app.post("/api/login", loginController.index);
// app.get("/api/logout", loginController.logout);
// app.get("/api/login", loginController.postJWT);

//app.use("/api/adverts", jwtAuth(), require("./routes/api/adverts"));

// Web
app.use("/", require("./routes/index"));
app.post("/register", require("./routes/api/register"));

//app.use("/adverts", require("./routes/adverts"));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error(__("Not_found"));
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  if (err.array) {
    // validation error
    err.status = 422;
    const errInfo = err.array({ onlyFirstError: true })[0];
    err.message = isAPI(req)
      ? { message: __("not_valid"), errors: err.mapped() }
      : `${__("not_valid")} - ${errInfo.param} ${errInfo.msg}`;
  }

  // Request status
  err.status = err.status || 500;
  res.status(err.status);

  // if status is 500 write the erroe in the log
  if (err.status && err.status >= 500) console.error(err);

  // si es una petición al API respondo JSON...
  if (isAPI(req)) {
    res.json({ success: false, error: err.message });
    return;
  }

  // ...and else replay with HTML...

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.render("error");
});

// Function isAPI
function isAPI(req) {
  return req.originalUrl.indexOf("/api") === 0;
}

module.exports = app;
