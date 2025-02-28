import { Hono } from "hono";
import AuthController from "@controllers/authController.ts";
import jwtValidation from "@middlewares/jwtValidation.ts";

const router = new Hono();

router.post("/login", AuthController.login);
router.post("/logout", AuthController.logout);
router.post(
  "/sendPasswordResetEmail",
  jwtValidation,
  AuthController.sendPasswordResetEmail
);
router.get("/getCurrentUser", jwtValidation, AuthController.getCurrentUser);

export default router;
