import { Hono } from "hono";
import RequestsController from "@controllers/requestsController.ts";
import jwtValidator from "@middlewares/jwtValidator.ts";
import {
  getRequestsDescription,
  postRequestDescription,
} from "../openapi/descriptions/requestsDescriptions.ts";

const router = new Hono();

router.post(
  "/postRequest",
  jwtValidator,
  postRequestDescription,
  RequestsController.postRequest,
);

router.get(
  "/getRequests",
  jwtValidator,
  getRequestsDescription,
  RequestsController.getRequests,
);

export default router;
