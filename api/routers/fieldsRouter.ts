import { Hono } from "hono";
import FieldsController from "@controllers/fieldsController.ts";
import jwtValidation from "@middlewares/jwtValidation.ts";
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
} from "@openapi/fieldsDescriptions.ts";

const router = new Hono();

router.post(
  "/postField",
  jwtValidation,
  postFieldDescription,
  FieldsController.postField,
);

router.put(
  "/putField",
  jwtValidation,
  putFieldDescription,
  FieldsController.putField,
);

router.put(
  "/putFieldsOrder",
  jwtValidation,
  putFieldsOrderDescription,
  FieldsController.putFieldsOrder,
);

router.delete(
  "/deleteField",
  jwtValidation,
  deleteFieldDescription,
  FieldsController.deleteField,
);

router.put(
  "/putFieldConfigs",
  jwtValidation,
  putFieldConfigsDescription,
  FieldsController.putFieldConfigs,
);

router.post(
  "/createConfig",
  jwtValidation,
  createConfigDescription,
  FieldsController.createConfig,
);

router.delete(
  "/deleteConfig",
  jwtValidation,
  deleteConfigDescription,
  FieldsController.deleteConfig,
);

router.get(
  "/getFieldsConfigsIdsActiveForAnAwning/:awningId",
  jwtValidation,
  getFieldsConfigsIdsActiveForAnAwningDescription,
  FieldsController.getFieldsConfigsIdsActiveForAnAwning,
);

router.post(
  "/linkFieldConfigToAnAwning",
  jwtValidation,
  linkFieldConfigToAnAwningDescription,
  FieldsController.linkFieldConfigToAnAwning,
);

router.post(
  "/unlinkFieldConfigToAnAwning",
  jwtValidation,
  unlinkFieldConfigToAnAwningDescription,
  FieldsController.unlinkFieldConfigToAnAwning,
);

router.post(
  "/linkFieldConfigForAllAwnings",
  jwtValidation,
  linkFieldConfigForAllAwningsDescription,
  FieldsController.linkFieldConfigForAllAwnings,
);

router.post(
  "/unlinkFieldConfigForAllAwnings",
  jwtValidation,
  unlinkFieldConfigForAllAwningsDescription,
  FieldsController.unlinkFieldConfigForAllAwnings,
);

export default router;
