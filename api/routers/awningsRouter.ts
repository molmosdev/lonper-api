import { Hono } from "hono";
import AwningsController from "@controllers/awningsController.ts";
import jwtValidator from "@middlewares/jwtValidator.ts";
import {
  deleteAwningDescription,
  duplicateAwningFieldsDescription,
  getAwningDescription,
  getAwningPriceDescription,
  getAwningsByFieldIdDescription,
  getAwningsDescription,
  postAwningDescription,
  putAwningDescription,
} from "@openapi/awningsDescriptions.ts";

const awningsRouter = new Hono();

awningsRouter.get(
  "/getAwnings",
  jwtValidator,
  getAwningsDescription,
  AwningsController.getAwnings,
);

awningsRouter.get(
  "/getAwning/:id",
  jwtValidator,
  getAwningDescription,
  AwningsController.getAwning,
);

awningsRouter.post(
  "/postAwning",
  jwtValidator,
  postAwningDescription,
  AwningsController.postAwning,
);

awningsRouter.put(
  "/putAwning",
  jwtValidator,
  putAwningDescription,
  AwningsController.putAwning,
);

awningsRouter.delete(
  "/deleteAwning/:id",
  jwtValidator,
  deleteAwningDescription,
  AwningsController.deleteAwning,
);

awningsRouter.post(
  "/duplicateAwningFields",
  jwtValidator,
  duplicateAwningFieldsDescription,
  AwningsController.duplicateAwningFields,
);

awningsRouter.get(
  "/getAwningsByFieldId/:fieldId",
  jwtValidator,
  getAwningsByFieldIdDescription,
  AwningsController.getAwningsByFieldId,
);

awningsRouter.get(
  "/getAwningPrice/:model/:line/:exit/:tarp/:ral/:familyCode",
  jwtValidator,
  getAwningPriceDescription,
  AwningsController.getAwningPrice,
);

export default awningsRouter;
