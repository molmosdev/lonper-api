import { Hono } from "hono";
import AddressesController from "@controllers/addressesController.ts";
import jwtValidation from "@middlewares/jwtValidation.ts";

const router = new Hono();

router.get("/getAddresses", jwtValidation, AddressesController.getAddresses);
router.post("/postAddress", jwtValidation, AddressesController.postAddress);
router.put("/putAddress", jwtValidation, AddressesController.putAddress);
router.delete(
  "/deleteAddress",
  jwtValidation,
  AddressesController.deleteAddress
);

export default router;
