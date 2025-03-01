import { Hono } from "hono";
import AwningsController from "@controllers/awningsController.ts";
import jwtValidator from "@middlewares/jwtValidator.ts";
import {
  deleteAwningDesc,
  duplicateAwningFieldsDesc,
  getAwningDesc,
  getAwningPriceDesc,
  getAwningsByFieldIdDesc,
  getAwningsDesc,
  postAwningDesc,
  putAwningDesc,
} from "@openapi/descriptions/awningsDescriptions.ts";

const awningsRouter = new Hono();

awningsRouter.get(
  "/getAwnings",
  jwtValidator,
  getAwningsDesc,
  AwningsController.getAwnings,
);

awningsRouter.get(
  "/getAwning/:id",
  jwtValidator,
  getAwningDesc,
  AwningsController.getAwning,
);

awningsRouter.post(
  "/postAwning",
  jwtValidator,
  postAwningDesc,
  AwningsController.postAwning,
);

awningsRouter.put(
  "/putAwning",
  jwtValidator,
  putAwningDesc,
  AwningsController.putAwning,
);

awningsRouter.delete(
  "/deleteAwning/:id",
  jwtValidator,
  deleteAwningDesc,
  AwningsController.deleteAwning,
);

awningsRouter.post(
  "/duplicateAwningFields",
  jwtValidator,
  duplicateAwningFieldsDesc,
  AwningsController.duplicateAwningFields,
);

awningsRouter.get(
  "/getAwningsByFieldId/:fieldId",
  jwtValidator,
  getAwningsByFieldIdDesc,
  AwningsController.getAwningsByFieldId,
);

awningsRouter.get(
  "/getAwningPrice/:model/:line/:exit/:tarp/:ral/:familyCode",
  jwtValidator,
  getAwningPriceDesc,
  AwningsController.getAwningPrice,
);

export default awningsRouter;
