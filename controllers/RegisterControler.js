// TODO:
"use strict";

const jwt = require("jsonwebtoken");
const { User } = require("../models");
class RegisterController {
  index(req, res, next) {
    res.locals.error = "";
    res.render("register");
  }

  async post(req, res, next) {
    try {
      const { name, email, password } = req.body;

      // look forward the user into the DB
      const user = await User.findOne({ name });

      // si no lo encuentro o no coincide la contraseña --> error
      if (!user || !(await user.comparePassword(password))) {
        res.locals.error = res.__("Invalid credentials");
        res.render("register");
        return;
      }

      // si lo encuentro y la contraseña coincide:
      // --> apuntar en su sesión que está autenticado (que se quien es)
      // --> redirigir a su zona privada

      req.session.userLogado = {
        _id: user._id,
      };

      // enviar un email al user
      // const result = await user.enviarEmail(
      //   "Esto es el asunto",
      //   "Bienvenido a WAllaclone"
      // );
      // console.log("Mensaje enviado:", result.messageId);
      // console.log("Ver mensaje:", result.getTestMessageUrl);

      res.redirect("../views/index.ejs");
    } catch (err) {
      next(err);
    }
  }

  //   logout(req, res, next) {
  //     req.session.regenerate((err) => {
  //       if (err) {
  //         next(err);
  //         return;
  //       }
  //       res.redirect("/");
  //     });
  //   }

  // POST /api/register
  async postJWT(req, res, next) {
    try {
      const { name, email, password } = req.body;

      // look fordward the user into the DB
      const user = await User.findOne({ name });

      // si no lo encuentro o no coincide la contraseña --> error

      if (!user) {
        res.json({
          ok: false,
          error:
            "This username exist into the DB. You must choose another name.",
        });
        return;
      }

      if (!email) {
        res.json({
          ok: false,
          error: "This email exist into the DB. You must choose another email.",
        });
        return;
      }

      // si el user existe y valida la contraseña
      // crear un JWT con el _id del user dentro
      jwt.sign(
        { _id: user._id },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_EXPIRE,
        },
        (err, jwtToken) => {
          if (err) {
            next(err);
            return;
          }
          // devolver al cliente el token generado
          res.json({ token: jwtToken });
        }
      );
    } catch (err) {
      next();
    }
  }
}

module.exports = RegisterController;
