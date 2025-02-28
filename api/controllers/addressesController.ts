import { Context } from "hono";
import config from "@config";
import Case from "@utils/case.ts";
import { IRequestAddress } from "@lonper/types";

class AddressesController {
  /**
   * Handle the POST request to add a new address.
   * @param c - The Hono context object.
   * @returns A JSON response indicating success or failure.
   */
  static async postAddress(c: Context) {
    const email = c.req.header("user-email");
    const newAddress: IRequestAddress = await c.req.json();
    const { city, country, postalCode, province, streetAndNumber } = newAddress;

    try {
      const { error } = await config.database.from("ADDRESSES").insert([
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
      return c.json({ message: "Address published successfully." }, 200);
    } catch (error) {
      console.error("error", error);
      return c.json(
        { error: "Internal server error while publishing the address." },
        500
      );
    }
  }

  /**
   * Handle the GET request to retrieve addresses.
   * @param c - The Hono context object.
   * @returns A JSON response with the addresses or an error message.
   */
  static async getAddresses(c: Context) {
    const email = c.req.header("user-email");

    try {
      const { data: addresses, error } = await config.database
        .from("ADDRESSES")
        .select("*")
        .eq("CLIENT_EMAIL", email);
      if (error) {
        console.error("error", error);
        return c.json(
          { error: "Internal server error while getting the addresses." },
          400
        );
      }
      return c.json(Case.deepConvertKeys(addresses, Case.toCamelCase), 200);
    } catch (error) {
      console.error("error", error);
      return c.json(
        { error: "Error interno del servidor al obtener las direcciones." },
        500
      );
    }
  }

  /**
   * Handle the PUT request to update an address.
   * @param c - The Hono context object.
   * @returns A JSON response indicating success or failure.
   */
  static async putAddress(c: Context) {
    const updatedAddress: IRequestAddress = await c.req.json();
    const { id } = updatedAddress;

    try {
      const { error } = await config.database
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
  }

  /**
   * Handle the DELETE request to remove an address.
   * @param c - The Hono context object.
   * @returns A JSON response indicating success or failure.
   */
  static async deleteAddress(c: Context) {
    const { addressId: id } = await c.req.json();

    try {
      const { data, error } = await config.database
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
}

export default AddressesController;
