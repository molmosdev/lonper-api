import { Hono } from "hono";
import AuthController from "@controllers/authController.ts";
import jwtValidator from "@middlewares/jwtValidator.ts";
import {
  getCurrentUserDescription,
  loginDescription,
  logoutDescription,
  sendPasswordResetEmailDescription,
} from "@openapi/authDescriptions.ts";

const router = new Hono();

router.post("/login", loginDescription, AuthController.login);

router.post("/logout", logoutDescription, jwtValidator, AuthController.logout);

router.post(
  "/sendPasswordResetEmail",
  jwtValidator,
  sendPasswordResetEmailDescription,
  AuthController.sendPasswordResetEmail,
);

router.get(
  "/getCurrentUser",
  jwtValidator,
  getCurrentUserDescription,
  AuthController.getCurrentUser,
);

export default router;
