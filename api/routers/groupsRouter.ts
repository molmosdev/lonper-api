import { Hono } from "hono";
import GroupsController from "@controllers/groupsController.ts";
import jwtValidator from "@middlewares/jwtValidator.ts";
import {
  deleteGroupDescription,
  getGroupsDescription,
  getGroupsForAnAwningDescription,
  postGroupDescription,
  putGroupDescription,
  putGroupsOrderDescription,
} from "@openapi/groupsDescriptions.ts";

const router = new Hono();

router.get(
  "/getGroups",
  jwtValidator,
  getGroupsDescription,
  GroupsController.getGroups,
);

router.get(
  "/getGroupsForAnAwning/:awningId",
  jwtValidator,
  getGroupsForAnAwningDescription,
  GroupsController.getGroupsForAnAwning,
);

router.post(
  "/postGroup",
  jwtValidator,
  postGroupDescription,
  GroupsController.postGroup,
);

router.put(
  "/putGroup",
  jwtValidator,
  putGroupDescription,
  GroupsController.putGroup,
);

router.delete(
  "/deleteGroup",
  jwtValidator,
  deleteGroupDescription,
  GroupsController.deleteGroup,
);

router.put(
  "/putGroupsOrder",
  jwtValidator,
  putGroupsOrderDescription,
  GroupsController.putGroupsOrder,
);

export default router;
