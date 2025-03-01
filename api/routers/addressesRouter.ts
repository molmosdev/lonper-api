import { Hono } from "hono";
import AddressesController from "@controllers/addressesController.ts";
import jwtValidator from "@middlewares/jwtValidator.ts";
import {
  deleteAddressDescription,
  getAddressesDescription,
  postAddressDescription,
  putAddressDescription,
} from "../openapi/descriptions/addressesDescriptions.ts";

const router = new Hono();

router.get(
  "/getAddresses",
  jwtValidator,
  getAddressesDescription,
  AddressesController.getAddresses,
);

router.post(
  "/postAddress",
  jwtValidator,
  postAddressDescription,
  AddressesController.postAddress,
);

router.put(
  "/putAddress",
  jwtValidator,
  putAddressDescription,
  AddressesController.putAddress,
);

router.delete(
  "/deleteAddress",
  jwtValidator,
  deleteAddressDescription,
  AddressesController.deleteAddress,
);

export default router;
