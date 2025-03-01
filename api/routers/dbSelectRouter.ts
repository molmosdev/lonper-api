import { Hono } from "hono";
import DbSelectController from "@controllers/dbSelectController.ts";
import jwtValidator from "@middlewares/jwtValidator.ts";
import { getDbSelectResultsDescription } from "@openapi/dbSelectDescriptions.ts";

const router = new Hono();

router.get(
  "/getDbSelectResults",
  jwtValidator,
  getDbSelectResultsDescription,
  DbSelectController.getDbSelectResults,
);

export default router;
