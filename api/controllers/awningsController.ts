// deno-lint-ignore-file no-explicit-any
import { Context } from "hono";
import config from "@config";
import Case from "@utils/case.ts";
import { IAwning, IAwningPrice } from "@lonper/types";

class AwningsController {
  /**
   * Get all awnings.
   * @param c - Hono context object.
   * @returns JSON response with the awnings data or an error message.
   */
  static async getAwnings(c: Context) {
    try {
      const { data, error } = await config.database
        .from("AWNINGS")
        .select(
          "*, AWNINGS_MODELS(FAMILY_CODE, FAMILY_DESC, SUBFAMILY_CODE, SUBFAMILY_DESC)",
        );

      if (error) {
        console.error("Internal server error while getting awnings:", error);
        return c.json(
          { error: "Internal server error while getting awnings." },
          400,
        );
      }

      const awnings: IAwning[] = data.map((item: any) => {
        const familyCode = item["AWNINGS_MODELS"]
          ? item["AWNINGS_MODELS"]["FAMILY_CODE"]
          : null;
        const familyDesc = item["AWNINGS_MODELS"]
          ? item["AWNINGS_MODELS"]["FAMILY_DESC"]
          : null;
        const subfamilyCode = item["AWNINGS_MODELS"]
          ? item["AWNINGS_MODELS"]["SUBFAMILY_CODE"]
          : null;
        const subfamilyDesc = item["AWNINGS_MODELS"]
          ? item["AWNINGS_MODELS"]["SUBFAMILY_DESC"]
          : null;
        const { AWNINGS_MODELS: _AWNINGS_MODELS, ...rest } = item;
        const data = {
          ...rest,
          FAMILY_CODE: familyCode,
          FAMILY_DESC: familyDesc,
          SUBFAMILY_CODE: subfamilyCode,
          SUBFAMILY_DESC: subfamilyDesc,
        };
        return Case.deepConvertKeys(data, Case.toCamelCase);
      });

      return c.json(awnings, 200);
    } catch (error) {
      console.error("Internal server error:", error);
      return c.json(
        { error: "Internal server error while getting awnings." },
        500,
      );
    }
  }

  /**
   * Get a specific awning by ID.
   * @param c - Hono context object.
   * @returns JSON response with the awning data or an error message.
   */
  static async getAwning(c: Context) {
    const id = c.req.param("id");
    try {
      const { data, error } = await config.database
        .from("AWNINGS")
        .select("*, AWNINGS_MODELS(FAMILY_CODE)")
        .eq("ID", id);

      if (error) {
        console.error("Internal server error:", error);
        return c.json(
          { error: "Internal server error while getting awning." },
          400,
        );
      }

      if (data.length > 0) {
        const familyCode = data[0]["AWNINGS_MODELS"]["FAMILY_CODE"];
        const { AWNINGS_MODELS: _AWNINGS_MODELS, ...rest } = data[0];
        rest["FAMILY_CODE"] = familyCode;

        const awning: IAwning = Case.deepConvertKeys(rest, Case.toCamelCase);

        return c.json(awning, 200);
      } else {
        return c.json({ error: "Awning not found." }, 404);
      }
    } catch (error) {
      console.error("Internal server error:", error);
      return c.json(
        { error: "Internal server error while getting awning." },
        500,
      );
    }
  }

  /**
   * Create a new awning.
   * @param c - Hono context object.
   * @returns JSON response with the created awning data or an error message.
   */
  static async postAwning(c: Context) {
    try {
      const { id, value, awningModelId } = await c.req.json();
      const { data, error } = await config.database.from("AWNINGS").insert([
        {
          ID: id,
          VALUE: value,
          AWNING_MODEL_ID: awningModelId,
        },
      ]);

      if (error) {
        console.error("Internal server error:", error);
        return c.json(
          { error: "Internal server error while inserting awning." },
          400,
        );
      }

      return c.json(Case.deepConvertKeys(data, Case.toCamelCase));
    } catch (error) {
      console.error("Internal server error:", error);
      return c.json(
        { error: "Internal server error while inserting awning." },
        400,
      );
    }
  }

  /**
   * Update an existing awning.
   * @param c - Hono context object.
   * @returns JSON response with the updated awning data or an error message.
   */
  static async putAwning(c: Context) {
    try {
      const { id, value, awningModelId } = await c.req.json();
      const { data, error } = await config.database
        .from("AWNINGS")
        .update({
          VALUE: value,
          AWNING_MODEL_ID: awningModelId,
        })
        .eq("ID", id);

      if (error) {
        console.error("Internal server error:", error);
        return c.json(
          { error: "Internal server error while updating awning." },
          400,
        );
      }

      return c.json(Case.deepConvertKeys(data, Case.toCamelCase));
    } catch (error) {
      console.error("Internal server error:", error);
      return c.json(
        { error: "Internal server error while updating awning." },
        400,
      );
    }
  }

  /**
   * Delete an awning.
   * @param c - Hono context object.
   * @returns JSON response with a success message or an error message.
   */
  static async deleteAwning(c: Context) {
    try {
      const id = c.req.param("id");
      const { error } = await config.database
        .from("AWNINGS")
        .delete()
        .match({ ID: id });

      if (error) {
        console.error("Internal server error:", error);
        return c.json(
          { error: "Internal server error while deleting awning." },
          400,
        );
      }

      return c.json({ message: "Awning deleted successfully." }, 200);
    } catch (error) {
      console.error("Internal server error:", error);
      return c.json(
        { error: "Internal server error while deleting awning." },
        400,
      );
    }
  }

  /**
   * Duplicate awning fields.
   * @param c - Hono context object.
   * @returns JSON response with a success message or an error message.
   */
  static async duplicateAwningFields(c: Context) {
    try {
      const { duplicateId, newAwningId } = await c.req.json();
      const { data: awningFields, error } = await config.database
        .from("AWNINGS_FIELDS_CONFIGS")
        .select("*")
        .eq("AWNING_ID", duplicateId);

      if (error) {
        console.error(
          "Internal server error while duplicating awning fields:",
          error,
        );
        return c.json(
          { error: "Internal server error while duplicating awning fields." },
          400,
        );
      }

      if (awningFields.length > 0) {
        const newAwningFields = awningFields.map(({ ID: _ID, ...FIELD }) => ({
          ...FIELD,
          AWNING_ID: newAwningId,
        }));

        const { data, error: insertError } = await config.database
          .from("AWNINGS_FIELDS_CONFIGS")
          .insert(newAwningFields);

        if (insertError) {
          console.error(
            "Internal server error while inserting duplicated awning fields:",
            insertError,
          );
          return c.json(
            {
              error:
                "Internal server error while inserting duplicated awning fields.",
            },
            400,
          );
        }

        console.log("Duplicated awning fields successfully:", data);
      }

      return c.json({ message: "Fields duplicated successfully." }, 200);
    } catch (error) {
      console.error(
        "Internal server error while duplicating awning fields:",
        error,
      );
      return c.json(
        { error: "Internal server error while duplicating awning fields." },
        500,
      );
    }
  }

  /**
   * Get awnings by field ID.
   * @param c - Hono context object.
   * @returns JSON response with the awnings data or an error message.
   */
  static async getAwningsByFieldId(c: Context) {
    try {
      const fieldId = c.req.param("fieldId");
      const { data, error } = await config.database
        .from("AWNINGS_FIELDS_CONFIGS")
        .select("AWNINGS(*)")
        .eq("FIELD_ID", fieldId);

      if (error) {
        console.error(
          "Internal server error while getting awnings by field id:",
          error,
        );
        return c.json(
          { error: "Internal server error while getting awnings by field id." },
          400,
        );
      }

      const uniqueAwningsData = Array.from(
        new Set(data.map((item: any) => item["AWNINGS"]["ID"])),
      )
        .map((id) => data.find((item: any) => item["AWNINGS"]["ID"] === id))
        .map((item: any) => ({
          ID: item["AWNINGS"]["ID"],
          AWNING_MODEL_ID: item["AWNINGS"]["AWNING_MODEL_ID"],
          value: item["AWNINGS"]["VALUE"],
        }));

      const awnings: IAwning[] = Case.deepConvertKeys(
        uniqueAwningsData,
        Case.toCamelCase,
      );

      return c.json(awnings, 200);
    } catch (error) {
      console.error(
        "Internal server error while getting awnings by field id:",
        error,
      );
      return c.json(
        { error: "Internal server error while getting awnings by field id." },
        500,
      );
    }
  }

  /**
   * Get awning price.
   * @param c - Hono context object.
   * @returns JSON response with the awning price data or an error message.
   */
  static async getAwningPrice(c: Context) {
    try {
      const {
        model,
        line: lineParam,
        exit: exitParam,
        tarp,
        ral,
        familyCode,
      } = c.req.param();
      const line = parseInt(lineParam);
      const exit = parseInt(exitParam);

      if (isNaN(line) || isNaN(exit)) {
        return c.json({ error: "Invalid line or exit parameter" }, 400);
      }

      const user = c.get("user");
      const commercialData = user.user_metadata?.commercialData || {};
      const {
        commercialDiscount1 = 0,
        commercialDiscount2 = 0,
        commercialDiscount3 = 0,
        clientNumber,
      } = commercialData;

      if (!tarp) {
        return c.json(Case.deepConvertKeys([], Case.toCamelCase), 200);
      }

      const { data: articleData, error: articleError } = await config.database
        .from("ARTICLES")
        .select("LON_RATE")
        .eq("ARTICLE", tarp);

      if (articleError) {
        console.error("Error while getting article data:", articleError);
        return c.json({ error: "Error while getting article data" }, 500);
      }

      const lonTarp = articleData[0]?.["LON_RATE"]?.trim();

      if (!lonTarp) {
        return c.json(Case.deepConvertKeys([], Case.toCamelCase), 200);
      }

      const { data: awningData, error: awningError } = await config.database
        .rpc("get_closest_awning", {
          _model: model,
          _tarp: lonTarp,
          _line: line,
          _exit: exit,
        });

      if (awningError) {
        console.error("Error while getting awning data:", awningError);
        return c.json({ error: "Error while getting awning data" }, 500);
      }

      if (awningData.length === 0) {
        return c.json(Case.deepConvertKeys([], Case.toCamelCase), 200);
      }

      const awningPrice: IAwningPrice = Case.deepConvertKeys(
        awningData[0],
        Case.toCamelCase,
      );

      if (awningPrice && awningPrice.rate === 1) {
        awningPrice.rate = 0;
      }

      const { data: surchargeData, error: surchargeError } = await config
        .database
        .from("COLOR_SURCHAGES")
        .select("SURCHAGE_PERCENTAGE")
        .eq("MODEL_CODE", model)
        .eq("COLOR_DESCRIPTION", ral);

      if (surchargeError) {
        console.error("Error while getting surcharge data:", surchargeError);
        return c.json({ error: "Error while getting surcharge data" }, 500);
      }

      if (
        surchargeData.length > 0 &&
        surchargeData[0]["SURCHAGE_PERCENTAGE"] !== 0
      ) {
        const surcharge = surchargeData[0]["SURCHAGE_PERCENTAGE"];

        if (lonTarp === "A") {
          awningPrice.rate += awningPrice.rate * (surcharge / 100);
        } else {
          const { data: awningDataA, error: awningErrorA } = await config
            .database.rpc("get_awningPrice_awning", {
              _model: model,
              _tarp: "A",
              _line: line,
              _exit: exit,
            });

          if (awningErrorA) {
            console.error("Error while getting awning data:", awningErrorA);
            return c.json({ error: "Error while getting awning data" }, 500);
          }

          if (awningDataA.length > 0) {
            const awningPriceA = awningDataA[0];
            awningPrice.rate += awningPriceA.rate * (surcharge / 100);
          }
        }
      }

      const rate = awningPrice.rate;
      let dto1 = 0;
      let dto2 = 0;
      let dto3 = 0;

      if (clientNumber) {
        const { data: clientsFamilyDtoData, error: clientsFamilyDtoError } =
          await config.database
            .from("CLIENTS_FAMILY_DTO")
            .select("DTO_1, DTO_2, DTO_3")
            .eq("CLIENT_CODE", clientNumber)
            .eq("FAMILY_CODE", familyCode);

        if (clientsFamilyDtoError) {
          console.error(
            "Error while getting clients family dto data:",
            clientsFamilyDtoError,
          );
          return c.json(
            { error: "Error while getting clients family dto data" },
            500,
          );
        }

        if (clientsFamilyDtoData.length > 0) {
          const { DTO_1, DTO_2, DTO_3 } = clientsFamilyDtoData[0];

          dto1 = DTO_1;
          dto2 = DTO_2;
          dto3 = DTO_3;

          if (DTO_1 !== 0) {
            awningPrice.rate -= awningPrice.rate * (DTO_1 / 100);
          }

          if (DTO_2 !== 0) {
            awningPrice.rate -= awningPrice.rate * (DTO_2 / 100);
          }

          if (DTO_3 !== 0) {
            awningPrice.rate -= awningPrice.rate * (DTO_3 / 100);
          }
        } else {
          dto1 = commercialDiscount1;
          dto2 = commercialDiscount2;
          dto3 = commercialDiscount3;

          if (commercialDiscount1 !== 0) {
            awningPrice.rate -= awningPrice.rate * (commercialDiscount1 / 100);
          }

          if (commercialDiscount2 !== 0) {
            awningPrice.rate -= awningPrice.rate * (commercialDiscount2 / 100);
          }

          if (commercialDiscount3 !== 0) {
            awningPrice.rate -= awningPrice.rate * (commercialDiscount3 / 100);
          }
        }
      } else {
        dto1 = commercialDiscount1;
        dto2 = commercialDiscount2;
        dto3 = commercialDiscount3;

        if (commercialDiscount1 !== 0) {
          awningPrice.rate -= awningPrice.rate * (commercialDiscount1 / 100);
        }

        if (commercialDiscount2 !== 0) {
          awningPrice.rate -= awningPrice.rate * (commercialDiscount2 / 100);
        }

        if (commercialDiscount3 !== 0) {
          awningPrice.rate -= awningPrice.rate * (commercialDiscount3 / 100);
        }
      }

      awningPrice.rateBeforeDiscount = rate;
      awningPrice.dto1 = dto1;
      awningPrice.dto2 = dto2;
      awningPrice.dto3 = dto3;

      return c.json(awningPrice, 200);
    } catch (error) {
      console.error("Internal server error:", error);
      return c.json(
        { error: "Internal server error while getting awning price" },
        500,
      );
    }
  }
}

export default AwningsController;
