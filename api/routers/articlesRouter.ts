import { Hono } from "hono";
import ArticlesController from "@controllers/articlesController.ts";
import jwtValidator from "@middlewares/jwtValidator.ts";
import { getArticlesByIdsDesc } from "@openapi/descriptions/articlesDescriptions.ts";

const router = new Hono();

router.post(
  "/getArticlesByIds",
  jwtValidator,
  getArticlesByIdsDesc,
  ArticlesController.getArticlesByIds,
);

export default router;
