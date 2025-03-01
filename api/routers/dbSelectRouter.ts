import { Hono } from "hono";
import DbSelectController from "@controllers/dbSelectController.ts";
import jwtValidator from "@middlewares/jwtValidator.ts";
import { getDbSelectResultsDesc } from "@openapi/descriptions/dbSelectDescriptions.ts";

const router = new Hono();

router.get(
  "/getDbSelectResults",
  jwtValidator,
  getDbSelectResultsDesc,
  DbSelectController.getDbSelectResults,
);

export default router;
