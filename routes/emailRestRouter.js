// TODO: Revisar
import express from "express";
import * as emailController from "../controllers/emailController";
export const emailRouter = express.Router();
emailRouter.route("/user/:email").post(emailController.sendPasswordResetEmail);
emailRouter
  .route("/receive_new_password/:userId/:token")
  .post(emailController.receiveNewPassword);
