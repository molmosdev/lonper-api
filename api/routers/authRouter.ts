import { Hono } from "hono";
import AuthController from "@controllers/authController.ts";
import jwtValidator from "@middlewares/jwtValidator.ts";
import {
  getCurrentUserDesc,
  loginDesc,
  logoutDesc,
  sendPasswordResetEmailDesc,
} from "@openapi/descriptions/authDescriptions.ts";

const router = new Hono();

router.post("/login", loginDesc, AuthController.login);

router.post("/logout", logoutDesc, jwtValidator, AuthController.logout);

router.post(
  "/sendPasswordResetEmail",
  jwtValidator,
  sendPasswordResetEmailDesc,
  AuthController.sendPasswordResetEmail,
);

router.get(
  "/getCurrentUser",
  jwtValidator,
  getCurrentUserDesc,
  AuthController.getCurrentUser,
);

export default router;
