import { Hono } from "hono";
import FieldsController from "@controllers/fieldsController.ts";
import jwtValidator from "@middlewares/jwtValidator.ts";
import {
  createConfigDescription,
  deleteConfigDescription,
  deleteFieldDescription,
  getFieldsConfigsIdsActiveForAnAwningDescription,
  linkFieldConfigForAllAwningsDescription,
  linkFieldConfigToAnAwningDescription,
  postFieldDescription,
  putFieldConfigsDescription,
  putFieldDescription,
  putFieldsOrderDescription,
  unlinkFieldConfigForAllAwningsDescription,
  unlinkFieldConfigToAnAwningDescription,
} from "@openapi/descriptions/fieldsDescriptions.ts";

const router = new Hono();

router.post(
  "/postField",
  jwtValidator,
  postFieldDescription,
  FieldsController.postField,
);

router.put(
  "/putField",
  jwtValidator,
  putFieldDescription,
  FieldsController.putField,
);

router.put(
  "/putFieldsOrder",
  jwtValidator,
  putFieldsOrderDescription,
  FieldsController.putFieldsOrder,
);

router.delete(
  "/deleteField",
  jwtValidator,
  deleteFieldDescription,
  FieldsController.deleteField,
);

router.put(
  "/putFieldConfigs",
  jwtValidator,
  putFieldConfigsDescription,
  FieldsController.putFieldConfigs,
);

router.post(
  "/createConfig",
  jwtValidator,
  createConfigDescription,
  FieldsController.createConfig,
);

router.delete(
  "/deleteConfig",
  jwtValidator,
  deleteConfigDescription,
  FieldsController.deleteConfig,
);

router.get(
  "/getFieldsConfigsIdsActiveForAnAwning/:awningId",
  jwtValidator,
  getFieldsConfigsIdsActiveForAnAwningDescription,
  FieldsController.getFieldsConfigsIdsActiveForAnAwning,
);

router.post(
  "/linkFieldConfigToAnAwning",
  jwtValidator,
  linkFieldConfigToAnAwningDescription,
  FieldsController.linkFieldConfigToAnAwning,
);

router.post(
  "/unlinkFieldConfigToAnAwning",
  jwtValidator,
  unlinkFieldConfigToAnAwningDescription,
  FieldsController.unlinkFieldConfigToAnAwning,
);

router.post(
  "/linkFieldConfigForAllAwnings",
  jwtValidator,
  linkFieldConfigForAllAwningsDescription,
  FieldsController.linkFieldConfigForAllAwnings,
);

router.post(
  "/unlinkFieldConfigForAllAwnings",
  jwtValidator,
  unlinkFieldConfigForAllAwningsDescription,
  FieldsController.unlinkFieldConfigForAllAwnings,
);

export default router;
