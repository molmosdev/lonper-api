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

// Get awnings route
awningsRouter.get(
  "/getAwnings",
  jwtValidation,
  getAwningsDescription,
  AwningsController.getAwnings,
);

// Get awning route by ID
awningsRouter.get(
  "/getAwning/:id",
  jwtValidation,
  getAwningDescription,
  AwningsController.getAwning,
);

// Post awning route
awningsRouter.post(
  "/postAwning",
  jwtValidation,
  postAwningDescription,
  AwningsController.postAwning,
);

// Put awning route
awningsRouter.put(
  "/putAwning",
  jwtValidation,
  putAwningDescription,
  AwningsController.putAwning,
);

// Delete awning route
awningsRouter.delete(
  "/deleteAwning/:id",
  jwtValidation,
  deleteAwningDescription,
  AwningsController.deleteAwning,
);

// Duplicate awning fields route
awningsRouter.post(
  "/duplicateAwningFields",
  jwtValidation,
  duplicateAwningFieldsDescription,
  AwningsController.duplicateAwningFields,
);

// Get awnings by field ID route
awningsRouter.get(
  "/getAwningsByFieldId/:fieldId",
  jwtValidation,
  getAwningsByFieldIdDescription,
  AwningsController.getAwningsByFieldId,
);

// Get awning price route
awningsRouter.get(
  "/getAwningPrice/:model/:line/:exit/:tarp/:ral/:familyCode",
  jwtValidation,
  getAwningPriceDescription,
  AwningsController.getAwningPrice,
);

export default awningsRouter;
