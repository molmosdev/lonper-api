import { Hono } from "hono";
import AddressesController from "@controllers/addressesController.ts";

const router = new Hono();

router.get("/getAddresses", AddressesController.getAddresses);
router.post("/postAddress", AddressesController.postAddress);
router.put("/putAddress", AddressesController.putAddress);
router.delete("/deleteAddress", AddressesController.deleteAddress);

export default router;
