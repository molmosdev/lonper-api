import { Hono } from "hono";
import ArticlesController from "@controllers/articlesController.ts";
import jwtValidation from "@middlewares/jwtValidation.ts";
import { getArticlesByIdsDescription } from "@openapi/articlesDescriptions.ts";

const router = new Hono();

// Get articles by IDs route
router.post(
  "/getArticlesByIds",
  jwtValidation,
  getArticlesByIdsDescription,
  ArticlesController.getArticlesByIds,
);

export default router;
