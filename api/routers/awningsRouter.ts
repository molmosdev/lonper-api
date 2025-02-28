import { Hono } from "hono";
import AwningsController from "@controllers/awningsController.ts";
import jwtValidation from "@middlewares/jwtValidation.ts";

const awningsRouter = new Hono();

awningsRouter.get("/getAwnings", jwtValidation, AwningsController.getAwnings);
awningsRouter.get("/getAwning/:id", jwtValidation, AwningsController.getAwning);
awningsRouter.post("/postAwning", jwtValidation, AwningsController.postAwning);
awningsRouter.put("/putAwning", jwtValidation, AwningsController.putAwning);
awningsRouter.delete(
  "/deleteAwning/:id",
  jwtValidation,
  AwningsController.deleteAwning
);
awningsRouter.post(
  "/duplicateAwningFields",
  jwtValidation,
  AwningsController.duplicateAwningFields
);
awningsRouter.get(
  "/getAwningsByFieldId/:fieldId",
  jwtValidation,
  AwningsController.getAwningsByFieldId
);
awningsRouter.get(
  "/getAwningPrice/:model/:line/:exit/:tarp/:ral/:familyCode",
  jwtValidation,
  AwningsController.getAwningPrice
);

export default awningsRouter;
