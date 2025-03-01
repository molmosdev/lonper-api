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

// Get addresses route
router.get(
  "/getAddresses",
  jwtValidation,
  getAddressesDescription,
  AddressesController.getAddresses,
);

// Add address route
router.post(
  "/postAddress",
  jwtValidation,
  postAddressDescription,
  AddressesController.postAddress,
);

// Update address route
router.put(
  "/putAddress",
  jwtValidation,
  putAddressDescription,
  AddressesController.putAddress,
);

// Delete address route
router.delete(
  "/deleteAddress",
  jwtValidation,
  deleteAddressDescription,
  AddressesController.deleteAddress,
);

export default router;
