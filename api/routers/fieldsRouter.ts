import { Hono } from "hono";
import FieldsController from "@controllers/fieldsController.ts";
import jwtValidator from "@middlewares/jwtValidator.ts";
import {
  createConfigDesc,
  deleteConfigDesc,
  deleteFieldDesc,
  getFieldsConfigsIdsActiveForAnAwningDesc,
  linkFieldConfigForAllAwningsDesc,
  linkFieldConfigToAnAwningDesc,
  postFieldDesc,
  putFieldConfigsDesc,
  putFieldDesc,
  putFieldsOrderDesc,
  unlinkFieldConfigForAllAwningsDesc,
  unlinkFieldConfigToAnAwningDesc,
} from "@openapi/descriptions/fieldsDescriptions.ts";

const router = new Hono();

router.post(
  "/postField",
  jwtValidator,
  postFieldDesc,
  FieldsController.postField,
);

router.put("/putField", jwtValidator, putFieldDesc, FieldsController.putField);

router.put(
  "/putFieldsOrder",
  jwtValidator,
  putFieldsOrderDesc,
  FieldsController.putFieldsOrder,
);

router.delete(
  "/deleteField",
  jwtValidator,
  deleteFieldDesc,
  FieldsController.deleteField,
);

router.put(
  "/putFieldConfigs",
  jwtValidator,
  putFieldConfigsDesc,
  FieldsController.putFieldConfigs,
);

router.post(
  "/createConfig",
  jwtValidator,
  createConfigDesc,
  FieldsController.createConfig,
);

router.delete(
  "/deleteConfig",
  jwtValidator,
  deleteConfigDesc,
  FieldsController.deleteConfig,
);

router.get(
  "/getFieldsConfigsIdsActiveForAnAwning/:awningId",
  jwtValidator,
  getFieldsConfigsIdsActiveForAnAwningDesc,
  FieldsController.getFieldsConfigsIdsActiveForAnAwning,
);

router.post(
  "/linkFieldConfigToAnAwning",
  jwtValidator,
  linkFieldConfigToAnAwningDesc,
  FieldsController.linkFieldConfigToAnAwning,
);

router.post(
  "/unlinkFieldConfigToAnAwning",
  jwtValidator,
  unlinkFieldConfigToAnAwningDesc,
  FieldsController.unlinkFieldConfigToAnAwning,
);

router.post(
  "/linkFieldConfigForAllAwnings",
  jwtValidator,
  linkFieldConfigForAllAwningsDesc,
  FieldsController.linkFieldConfigForAllAwnings,
);

router.post(
  "/unlinkFieldConfigForAllAwnings",
  jwtValidator,
  unlinkFieldConfigForAllAwningsDesc,
  FieldsController.unlinkFieldConfigForAllAwnings,
);

export default router;
