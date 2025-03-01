import { Hono } from "hono";
import RequestsController from "@controllers/requestsController.ts";
import jwtValidator from "@middlewares/jwtValidator.ts";
import {
  getRequestsDesc,
  postRequestDesc,
} from "@openapi/descriptions/requestsDescriptions.ts";

const router = new Hono();

router.post(
  "/postRequest",
  jwtValidator,
  postRequestDesc,
  RequestsController.postRequest,
);

router.get(
  "/getRequests",
  jwtValidator,
  getRequestsDesc,
  RequestsController.getRequests,
);

export default router;
