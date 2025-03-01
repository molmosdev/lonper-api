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

// Login route
router.post("/login", loginDescription, AuthController.login);

// Logout route
router.post("/logout", logoutDescription, AuthController.logout);

// Send password reset email route
router.post(
  "/sendPasswordResetEmail",
  jwtValidation,
  sendPasswordResetEmailDescription,
  AuthController.sendPasswordResetEmail,
);

// Get current user route
router.get(
  "/getCurrentUser",
  jwtValidation,
  getCurrentUserDescription,
  AuthController.getCurrentUser,
);

export default router;
