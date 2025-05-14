import { Context, Hono } from "hono";
import { IRequestAddress, User } from "@lonper/types";
import {
  getAddressesDesc,
  postAddressDesc,
} from "../openapi/descriptions/addressesDescriptions";
import { userMiddleware } from "../middlewares/user.middleware";
import { DelfosClient } from "../services/delfos-client.service";

const app = new Hono();
const delfosClient = new DelfosClient();

app.get("/", userMiddleware, getAddressesDesc, async (c: Context) => {
  const user: User = c.get("user");
  const clientNumber = user.user_metadata?.commercialData?.clientNumber;
  if (!clientNumber) {
    return c.json({ error: "Client number not found" }, 400);
  }
  try {
    app.use();
    const addresses = await delfosClient.fetchFromDelfos<any[]>(
      `clientes/${clientNumber}/direcciones`,
      {},
      c
    );
    return c.json(addresses);
  } catch (error) {
    console.error("Error fetching addresses:", error);
    return c.json(
      { error: "Internal server error while getting the addresses." },
      500
    );
  }
});

app.post("/", userMiddleware, postAddressDesc, async (c: Context) => {
  const user: User = c.get("user");
  const clientNumber = user.user_metadata?.commercialData?.clientNumber;
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
        body: JSON.stringify(body),
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
});

export default app;
