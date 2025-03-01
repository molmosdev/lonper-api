import { Hono } from "hono";
import AuthController from "@controllers/authController.ts";
import jwtValidation from "@middlewares/jwtValidation.ts";
import {
  getCurrentUserDescription,
  loginDescription,
  logoutDescription,
  sendPasswordResetEmailDescription,
} from "@openapi/authDescriptions.ts";

const router = new Hono();

router.post("/login", loginDescription, AuthController.login);

router.post("/logout", logoutDescription, AuthController.logout);

router.post(
  "/sendPasswordResetEmail",
  jwtValidation,
  sendPasswordResetEmailDescription,
  AuthController.sendPasswordResetEmail,
);

router.get(
  "/getCurrentUser",
  jwtValidation,
  getCurrentUserDescription,
  AuthController.getCurrentUser,
);

export default router;
