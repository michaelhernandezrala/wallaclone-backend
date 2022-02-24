// TODO: Revisar
/**
 * emailRestRouter.js
 */
import express from "express";
import * as EmailController from "../controllers/EmailController";
export const router = express.Router();

// POST /user/:email
router.route("/user/:email").post(EmailController.sendPasswordResetEmail);
router
  .route("/receive_new_password/:userId/:token")
  .post(EmailController.receiveNewPassword);
