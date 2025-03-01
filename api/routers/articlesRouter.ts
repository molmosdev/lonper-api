import { Hono } from "hono";
import ArticlesController from "@controllers/articlesController.ts";
import jwtValidator from "@middlewares/jwtValidator.ts";
import { getArticlesByIdsDescription } from "@openapi/descriptions/articlesDescriptions.ts";

const router = new Hono();

router.post(
  "/getArticlesByIds",
  jwtValidator,
  getArticlesByIdsDescription,
  ArticlesController.getArticlesByIds,
);

export default router;
