import { Context, Hono } from "hono";
import { IRequestAddress, User } from "@lonper/types";
import {
  getAddressesDesc,
  postAddressDesc,
} from "../openapi/descriptions/addressesDescriptions";
import { userMiddleware } from "../middlewares/user.middleware";
import { clientMetadataMiddleware } from "../middlewares/client-metadata.middleware";
import { DelfosClient } from "../services/delfos-client.service";
import { delfosMiddleware } from "../middlewares/delfos-middleware";

const app = new Hono();
const delfosClient = new DelfosClient();

app.get(
  "/",
  userMiddleware,
  clientMetadataMiddleware,
  delfosMiddleware,
  getAddressesDesc,
  async (c: Context) => {
    const clientMetadata = c.get("clientMetadata");
    const clientNumber = clientMetadata?.commercialData?.clientNumber;
    try {
      app.use();
      const addresses = await delfosClient.fetchFromDelfos<any[]>(
        `clientes/${clientNumber}/direcciones`,
        {},
        c
      );
      const formattedAddresses: IRequestAddress[] = addresses.map(
        (address) => ({
          addressId: Number(address.DIRECCION),
          streetAndNumber: address.DIR_COMPLETA,
          addressComplement: address.DIRECCION_2 || undefined,
          phone1: address.DIR_TELEFONO01 || "",
          phone2: address.DIR_TELEFONO02 || undefined,
          alternative: address.LOCALIDAD == "99999999" ? true : false,
        })
      );

      return c.json(formattedAddresses);
    } catch (error) {
      console.error("Error fetching addresses:", error);
      return c.json(
        { error: "Internal server error while getting the addresses." },
        500
      );
    }
  }
);

app.post(
  "/",
  userMiddleware,
  clientMetadataMiddleware,
  delfosMiddleware,
  postAddressDesc,
  async (c: Context) => {
    const clientMetadata = c.get("clientMetadata");
    const clientNumber = clientMetadata?.commercialData?.clientNumber;
    if (!clientNumber) {
      return c.json({ error: "Client number not found" }, 400);
    }
    try {
      const body = await c.req.json();
      // Llama a /clientes/{id}/direcciones en Delfos con el body recibido
      const result = await delfosClient.fetchFromDelfos<any>(
        `clientes/${clientNumber}/direcciones`,
        {
          method: "POST",
          body: JSON.stringify({
            direccion: body.addressId,
            dir_nombre: body.streetAndNumber,
            dir_nombre2: body.addressComplement,
            telefono1: body.phone1,
            telefono2: body.phone2,
          }),
        },
        c
      );
      return c.json(result, 201);
    } catch (error) {
      console.error("Error posting address:", error);
      return c.json(
        { error: "Internal server error while posting the address." },
        500
      );
    }
  }
);

export default app;
