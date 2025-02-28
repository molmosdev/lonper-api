import express from "npm:express@4.18.2";
import config from "@api/config.ts";
import Case from "@utils/case.ts";
import { IRequestAddress } from "@lonper/types";

class AddressesController {
  /**
   * Handle the POST request to add a new address.
   * @param req - The Express request object.
   * @param res - The Express response object.
   * @returns A JSON response indicating success or failure.
   */
  static async postAddress(req: express.Request, res: express.Response) {
    const email = req.user.email;
    const newAddress: IRequestAddress = req.body.address;
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
        return res.status(400).json({
          error: "Internal server error while publishing the address.",
        });
      }
      console.log(`Address successfully updated for '${email}'.`);
      return res
        .status(200)
        .json({ message: "Address published successfully." });
    } catch (error) {
      console.error("error", error);
      return res
        .status(500)
        .json({ error: "Internal server error while publishing the address." });
    }
  }

  /**
   * Handle the GET request to retrieve addresses.
   * @param req - The Express request object.
   * @param res - The Express response object.
   * @returns A JSON response with the addresses or an error message.
   */
  static async getAddresses(req: express.Request, res: express.Response) {
    const email = req.user.email;
    try {
      const { data: addresses, error } = await config.database
        .from("ADDRESSES")
        .select("*")
        .eq("CLIENT_EMAIL", email);
      if (error) {
        console.error("error", error);
        return res.status(400).json({
          error: "Internal server error while getting the addresses.",
        });
      }
      return res
        .status(200)
        .json(Case.deepConvertKeys(addresses, Case.toCamelCase));
    } catch (error) {
      console.error("error", error);
      return res.status(500).json({
        error: "Error interno del servidor al obtener las direcciones.",
      });
    }
  }

  /**
   * Handle the PUT request to update an address.
   * @param req - The Express request object.
   * @param res - The Express response object.
   * @returns A JSON response indicating success or failure.
   */
  static async putAddress(req: express.Request, res: express.Response) {
    const updatedAddress: IRequestAddress = req.body.address;
    const { id } = updatedAddress;
    try {
      const { error } = await config.database
        .from("ADDRESSES")
        .update(Case.deepConvertKeys(updatedAddress, Case.toUpperSnakeCase))
        .eq("ID", id);
      if (error) {
        console.error("error", error);
        return res
          .status(400)
          .json({ error: "Internal server error while updating the address." });
      }
      console.log(`Address successfully updated for '${id}' id.`);
      return res.status(200).json({ message: "Address successfully updated." });
    } catch (error) {
      console.error("error", error);
      return res
        .status(500)
        .json({ error: "Internal server error while updating the address." });
    }
  }

  /**
   * Handle the DELETE request to remove an address.
   * @param req - The Express request object.
   * @param res - The Express response object.
   * @returns A JSON response indicating success or failure.
   */
  static async deleteAddress(req: express.Request, res: express.Response) {
    const id: string = req.body["addressId"];
    try {
      const { data, error } = await config.database
        .from("ADDRESSES")
        .delete()
        .eq("ID", id);
      if (error) {
        console.error("error", error);
        return res
          .status(400)
          .json({ error: "Internal server error while deleting the address." });
      }
      if (data === null) {
        return res
          .status(200)
          .json({ message: "Address successfully deleted." });
      } else {
        return res.status(404).json({ error: "Address not found." });
      }
    } catch (error) {
      console.error("error", error);
      return res
        .status(500)
        .json({ error: "Internal server error while deleting the address." });
    }
  }
}

export default AddressesController;
