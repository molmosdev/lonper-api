import { Hono } from "hono";
import AddressesController from "@controllers/addressesController.ts";
import jwtValidator from "@middlewares/jwtValidator.ts";
import {
  deleteAddressDesc,
  getAddressesDesc,
  postAddressDesc,
  putAddressDesc,
} from "@openapi/descriptions/addressesDescriptions.ts";

const router = new Hono();

router.get(
  "/getAddresses",
  jwtValidator,
  getAddressesDesc,
  AddressesController.getAddresses,
);

router.post(
  "/postAddress",
  jwtValidator,
  postAddressDesc,
  AddressesController.postAddress,
);

router.put(
  "/putAddress",
  jwtValidator,
  putAddressDesc,
  AddressesController.putAddress,
);

router.delete(
  "/deleteAddress",
  jwtValidator,
  deleteAddressDesc,
  AddressesController.deleteAddress,
);

export default router;
