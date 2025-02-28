import { Hono } from "hono";
import ArticlesController from "@controllers/articlesController.ts";
import jwtValidation from "@middlewares/jwtValidation.ts";

const router = new Hono();

router.post(
  "/getArticlesByIds",
  jwtValidation,
  ArticlesController.getArticlesByIds
);

export default router;
