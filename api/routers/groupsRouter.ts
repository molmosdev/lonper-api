import { Hono } from "hono";
import GroupsController from "@controllers/groupsController.ts";
import jwtValidator from "@middlewares/jwtValidator.ts";
import {
  deleteGroupDesc,
  getGroupsDesc,
  getGroupsForAnAwningDesc,
  postGroupDesc,
  putGroupDesc,
  putGroupsOrderDesc,
} from "@openapi/descriptions/groupsDescriptions.ts";

const router = new Hono();

router.get(
  "/getGroups",
  jwtValidator,
  getGroupsDesc,
  GroupsController.getGroups,
);

router.get(
  "/getGroupsForAnAwning/:awningId",
  jwtValidator,
  getGroupsForAnAwningDesc,
  GroupsController.getGroupsForAnAwning,
);

router.post(
  "/postGroup",
  jwtValidator,
  postGroupDesc,
  GroupsController.postGroup,
);

router.put("/putGroup", jwtValidator, putGroupDesc, GroupsController.putGroup);

router.delete(
  "/deleteGroup",
  jwtValidator,
  deleteGroupDesc,
  GroupsController.deleteGroup,
);

router.put(
  "/putGroupsOrder",
  jwtValidator,
  putGroupsOrderDesc,
  GroupsController.putGroupsOrder,
);

export default router;
