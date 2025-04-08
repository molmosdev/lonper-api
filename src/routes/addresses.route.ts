import { Context, Hono } from "hono";
import { userMiddleware } from "../middlewares/user.middleware";
import {
  getAddressesDesc,
  postAddressDesc,
  putAddressDesc,
  deleteAddressDesc,
} from "../openapi/descriptions/addressesDescriptions";
import { IRequestAddress, User } from "@lonper/types";
import Case from "../utils/case";

const app = new Hono();

app.get(
  "/getAddresses",
  userMiddleware,
  getAddressesDesc,
  async (c: Context) => {
    const user: User = c.get("user");
    const supabase = c.get("supabase");

    try {
      const { data, error } = await supabase
        .from("ADDRESSES")
        .select("*")
        .eq("CLIENT_EMAIL", user.email);
      if (error) {
        console.error("error", error);
        return c.json(
          { error: "Internal server error while getting the addresses." },
          400
        );
      }
      const addresses: IRequestAddress[] =
        Case.deepConvertKeys(data, Case.toCamelCase) || [];

      return c.json(addresses, 200);
    } catch (error) {
      console.error("error", error);
      return c.json(
        { error: "Internal server error while getting the addresses." },
        500
      );
    }
  }
);

app.post(
  "/postAddress",
  userMiddleware,
  postAddressDesc,
  async (c: Context) => {
    const email = c.req.header("user-email");
    const newAddress: IRequestAddress = await c.req.json();
    const { city, country, postalCode, province, streetAndNumber } = newAddress;
    const supabase = c.get("supabase");

    try {
      const { error } = await supabase.from("ADDRESSES").insert([
        {
          CITY: city,
          COUNTRY: country,
          POSTAL_CODE: postalCode,
          PROVINCE: province,
          STREET_AND_NUMBER: streetAndNumber,
          CLIENT_EMAIL: email,
        },
      ]);
      if (error) {
        console.error("error", error);
        return c.json(
          { error: "Internal server error while publishing the address." },
          400
        );
      }
      console.log(`Address successfully updated for '${email}'.`);
      return c.json({ message: "Address created successfully." }, 200);
    } catch (error) {
      console.error("error", error);
      return c.json(
        { error: "Internal server error while publishing the address." },
        500
      );
    }
  }
);

app.put("/putAddress", userMiddleware, putAddressDesc, async (c: Context) => {
  const updatedAddress: IRequestAddress = await c.req.json();
  const { id } = updatedAddress;
  const supabase = c.get("supabase");

  try {
    const { error } = await supabase
      .from("ADDRESSES")
      .update(Case.deepConvertKeys(updatedAddress, Case.toUpperSnakeCase))
      .eq("ID", id);
    if (error) {
      console.error("error", error);
      return c.json(
        { error: "Internal server error while updating the address." },
        400
      );
    }
    console.log(`Address successfully updated for '${id}' id.`);
    return c.json({ message: "Address successfully updated." }, 200);
  } catch (error) {
    console.error("error", error);
    return c.json(
      { error: "Internal server error while updating the address." },
      500
    );
  }
});

app.delete(
  "/deleteAddress",
  userMiddleware,
  deleteAddressDesc,
  async (c: Context) => {
    const { addressId: id } = await c.req.json();
    const supabase = c.get("supabase");

    try {
      const { data, error } = await supabase
        .from("ADDRESSES")
        .delete()
        .eq("ID", id);
      if (error) {
        console.error("error", error);
        return c.json(
          { error: "Internal server error while deleting the address." },
          400
        );
      }
      if (data === null) {
        return c.json({ message: "Address successfully deleted." }, 200);
      } else {
        return c.json({ error: "Address not found." }, 404);
      }
    } catch (error) {
      console.error("error", error);
      return c.json(
        { error: "Internal server error while deleting the address." },
        500
      );
    }
  }
);

export default app;
