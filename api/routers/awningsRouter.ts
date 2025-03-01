import { Hono } from "hono";
import AwningsController from "@controllers/awningsController.ts";
import jwtValidation from "@middlewares/jwtValidation.ts";
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
  jwtValidation,
  getAwningsDescription,
  AwningsController.getAwnings,
);

awningsRouter.get(
  "/getAwning/:id",
  jwtValidation,
  getAwningDescription,
  AwningsController.getAwning,
);

awningsRouter.post(
  "/postAwning",
  jwtValidation,
  postAwningDescription,
  AwningsController.postAwning,
);

awningsRouter.put(
  "/putAwning",
  jwtValidation,
  putAwningDescription,
  AwningsController.putAwning,
);

awningsRouter.delete(
  "/deleteAwning/:id",
  jwtValidation,
  deleteAwningDescription,
  AwningsController.deleteAwning,
);

awningsRouter.post(
  "/duplicateAwningFields",
  jwtValidation,
  duplicateAwningFieldsDescription,
  AwningsController.duplicateAwningFields,
);

awningsRouter.get(
  "/getAwningsByFieldId/:fieldId",
  jwtValidation,
  getAwningsByFieldIdDescription,
  AwningsController.getAwningsByFieldId,
);

awningsRouter.get(
  "/getAwningPrice/:model/:line/:exit/:tarp/:ral/:familyCode",
  jwtValidation,
  getAwningPriceDescription,
  AwningsController.getAwningPrice,
);

export default awningsRouter;
