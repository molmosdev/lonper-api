import { Hono } from "hono";
import AddressesController from "@controllers/addressesController.ts";
import jwtValidation from "@middlewares/jwtValidation.ts";
import {
  deleteAddressDescription,
  getAddressesDescription,
  postAddressDescription,
  putAddressDescription,
} from "@openapi/addressesDescriptions.ts";

const router = new Hono();

router.get(
  "/getAddresses",
  jwtValidation,
  getAddressesDescription,
  AddressesController.getAddresses,
);

router.post(
  "/postAddress",
  jwtValidation,
  postAddressDescription,
  AddressesController.postAddress,
);

router.put(
  "/putAddress",
  jwtValidation,
  putAddressDescription,
  AddressesController.putAddress,
);

router.delete(
  "/deleteAddress",
  jwtValidation,
  deleteAddressDescription,
  AddressesController.deleteAddress,
);

export default router;
