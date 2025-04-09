import { Context, Hono } from "hono";
import { userMiddleware } from "../middlewares/user.middleware";
import {
  getAwningsDesc,
  getAwningDesc,
  postAwningDesc,
  putAwningDesc,
  deleteAwningDesc,
  duplicateAwningFieldsDesc,
  getAwningPriceDesc,
  getGroupsForAnAwningDesc,
  getFieldsConfigsIdsActiveForAnAwningDesc,
} from "../openapi/descriptions/awningsDescriptions";
import { IAwning, IAwningPrice, IField, IGroup } from "@lonper/types";
import Case from "../utils/case";

const app = new Hono();

app.get("/price", userMiddleware, getAwningPriceDesc, async (c: Context) => {
  const supabase = c.get("supabase");
  const {
    model,
    line: lineParam,
    exit: exitParam,
    tarp,
    ral,
    familyCode,
  } = c.req.query();

  try {
    const line = parseInt(lineParam);
    const exit = parseInt(exitParam);

    if (isNaN(line) || isNaN(exit)) {
      return c.json({ error: "Invalid line or exit parameter." }, 400);
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

    const { data: articleData, error: articleError } = await supabase
      .from("ARTICLES")
      .select("LON_RATE")
      .eq("ARTICLE", tarp);

    if (articleError) {
      console.error("Error while getting article data:", articleError);
      return c.json({ error: "Error while getting article data." }, 500);
    }

    const lonTarp = articleData[0]?.["LON_RATE"]?.trim();

    if (!lonTarp) {
      return c.json(Case.deepConvertKeys([], Case.toCamelCase), 200);
    }

    const { data: awningData, error: awningError } = await supabase.rpc(
      "get_closest_awning",
      {
        _model: model,
        _tarp: lonTarp,
        _line: line,
        _exit: exit,
      }
    );

    if (awningError) {
      console.error("Error while getting awning data:", awningError);
      return c.json({ error: "Error while getting awning data." }, 500);
    }

    if (awningData.length === 0) {
      return c.json(Case.deepConvertKeys([], Case.toCamelCase), 200);
    }

    const awningPrice: IAwningPrice = Case.deepConvertKeys(
      awningData[0],
      Case.toCamelCase
    );

    if (awningPrice && awningPrice.rate === 1) {
      awningPrice.rate = 0;
    }

    const { data: surchargeData, error: surchargeError } = await supabase
      .from("COLOR_SURCHAGES")
      .select("SURCHAGE_PERCENTAGE")
      .eq("MODEL_CODE", model)
      .eq("COLOR_DESCRIPTION", ral);

    if (surchargeError) {
      console.error("Error while getting surcharge data:", surchargeError);
      return c.json({ error: "Error while getting surcharge data." }, 500);
    }

    if (
      surchargeData.length > 0 &&
      surchargeData[0]["SURCHAGE_PERCENTAGE"] !== 0
    ) {
      const surcharge = surchargeData[0]["SURCHAGE_PERCENTAGE"];

      if (lonTarp === "A") {
        awningPrice.rate += awningPrice.rate * (surcharge / 100);
      } else {
        const { data: awningDataA, error: awningErrorA } = await supabase.rpc(
          "get_awningPrice_awning",
          {
            _model: model,
            _tarp: "A",
            _line: line,
            _exit: exit,
          }
        );

        if (awningErrorA) {
          console.error("Error while getting awning data:", awningErrorA);
          return c.json({ error: "Error while getting awning data." }, 500);
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
        await supabase
          .from("CLIENTS_FAMILY_DTO")
          .select("DTO_1, DTO_2, DTO_3")
          .eq("CLIENT_CODE", clientNumber)
          .eq("FAMILY_CODE", familyCode);

      if (clientsFamilyDtoError) {
        console.error(
          "Error while getting clients family dto data:",
          clientsFamilyDtoError
        );
        return c.json(
          { error: "Error while getting clients family dto data." },
          500
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
      { error: "Internal server error while getting awning price." },
      500
    );
  }
});

app.get("/", userMiddleware, getAwningsDesc, async (c: Context) => {
  const supabase = c.get("supabase");

  try {
    const { data, error } = await supabase
      .from("AWNINGS")
      .select(
        "*, AWNINGS_MODELS(FAMILY_CODE, FAMILY_DESC, SUBFAMILY_CODE, SUBFAMILY_DESC)"
      );

    if (error) {
      console.error("Internal server error while getting awnings:", error);
      return c.json(
        { error: "Internal server error while getting awnings." },
        400
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
      500
    );
  }
});

app.get("/:id", userMiddleware, getAwningDesc, async (c: Context) => {
  const supabase = c.get("supabase");
  const id = c.req.param("id");

  try {
    const { data, error } = await supabase
      .from("AWNINGS")
      .select("*, AWNINGS_MODELS(FAMILY_CODE)")
      .eq("ID", id);

    if (error) {
      console.error("Internal server error:", error);
      return c.json(
        { error: "Internal server error while getting awning." },
        400
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
      500
    );
  }
});

app.post("/", userMiddleware, postAwningDesc, async (c: Context) => {
  const supabase = c.get("supabase");

  try {
    const { id, value, awningModelId } = await c.req.json();
    const { data, error } = await supabase.from("AWNINGS").insert([
      {
        ID: id,
        VALUE: value,
        AWNING_MODEL_ID: awningModelId,
      },
    ]);

    if (error) {
      console.error("Internal server error:", error);
      return c.json(
        { error: "Internal server error while creating awning." },
        400
      );
    }

    return c.json(Case.deepConvertKeys(data, Case.toCamelCase), 200);
  } catch (error) {
    console.error("Internal server error:", error);
    return c.json(
      { error: "Internal server error while creating awning." },
      400
    );
  }
});

app.put("/:id", userMiddleware, putAwningDesc, async (c: Context) => {
  const supabase = c.get("supabase");
  const id = c.req.param("id");

  try {
    const { value, awningModelId } = await c.req.json();
    const { data, error } = await supabase
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
        400
      );
    }

    return c.json(Case.deepConvertKeys(data, Case.toCamelCase), 200);
  } catch (error) {
    console.error("Internal server error:", error);
    return c.json(
      { error: "Internal server error while updating awning." },
      400
    );
  }
});

app.delete("/:id", userMiddleware, deleteAwningDesc, async (c: Context) => {
  const supabase = c.get("supabase");
  const id = c.req.param("id");

  try {
    const { error } = await supabase.from("AWNINGS").delete().match({ ID: id });

    if (error) {
      console.error("Internal server error while deleting awning:", error);
      return c.json(
        { error: "Internal server error while deleting awning." },
        500
      );
    }

    return c.json({ message: "Awning deleted successfully." }, 200);
  } catch (error) {
    console.error("Internal server error:", error);
    return c.json(
      { error: "Internal server error while deleting awning." },
      500
    );
  }
});

app.post(
  "/:id/duplicate",
  userMiddleware,
  duplicateAwningFieldsDesc,
  async (c: Context) => {
    const supabase = c.get("supabase");
    const id = c.req.param("id");
    const { newId } = await c.req.json();

    if (!newId) {
      return c.json({ error: "newId is required." }, 400);
    }

    try {
      const { data: awningFields, error } = await supabase
        .from("AWNINGS_FIELDS_CONFIGS")
        .select("*")
        .eq("AWNING_ID", id);

      if (error) {
        console.error(
          "Internal server error while fetching awning fields:",
          error
        );
        return c.json(
          { error: "Internal server error while fetching awning fields." },
          500
        );
      }

      if (!awningFields || awningFields.length === 0) {
        return c.json(
          { error: "No fields found for the specified awning ID." },
          404
        );
      }

      const newAwningFields = awningFields.map(({ ID: _ID, ...FIELD }) => ({
        ...FIELD,
        AWNING_ID: newId,
      }));

      const { error: insertError } = await supabase
        .from("AWNINGS_FIELDS_CONFIGS")
        .insert(newAwningFields);

      if (insertError) {
        console.error(
          "Internal server error while inserting duplicated awning fields:",
          insertError
        );
        return c.json(
          {
            error:
              "Internal server error while inserting duplicated awning fields.",
          },
          500
        );
      }

      return c.json({ message: "Fields duplicated successfully." }, 200);
    } catch (error) {
      console.error(
        "Internal server error while duplicating awning fields:",
        error
      );
      return c.json(
        { error: "Internal server error while duplicating awning fields." },
        500
      );
    }
  }
);

app.get(
  "/:id/groups",
  userMiddleware,
  getGroupsForAnAwningDesc,
  async (c: Context) => {
    const supabase = c.get("supabase");
    const awningId = c.req.param("id");

    try {
      const { data: fieldConfigIdsData, error: fieldConfigIdsError } =
        await supabase
          .from("AWNINGS_FIELDS_CONFIGS")
          .select("FIELD_CONFIG_ID")
          .eq("AWNING_ID", awningId);

      if (fieldConfigIdsError) {
        console.error(
          "Error getting active fields for awning:",
          fieldConfigIdsError
        );
        return c.json(
          { error: "Error getting active fields for awning." },
          400
        );
      }

      const fieldConfigIds = fieldConfigIdsData.map(
        (item) => item.FIELD_CONFIG_ID
      );

      const { data, error } = await supabase
        .from("GROUPS")
        .select(`*, FIELDS(*, FIELDS_CONFIGS(*, FIELDS_SUBCONFIGS(*)))`)
        .order("ORDER");

      if (error) {
        console.error("Error getting groups:", error);
        return c.json({ error: "Error getting groups." }, 400);
      }

      const groups: IGroup[] = Case.deepConvertKeys(data, Case.toCamelCase);

      const filteredGroups: IGroup[] = groups.map((group) => {
        const filteredFields = group.fields
          .map((field: IField) => {
            const filteredConfigs = field.fieldsConfigs.filter((config) =>
              fieldConfigIds.includes(config.id)
            );
            return filteredConfigs.length > 0
              ? { ...field, fieldsConfigs: filteredConfigs }
              : null;
          })
          .filter((field) => field !== null);

        return { ...group, fields: filteredFields };
      });

      filteredGroups.forEach((group) => {
        if (group.fields) {
          group.fields.sort((a, b) => a.order - b.order);
        }
      });

      return c.json(filteredGroups, 200);
    } catch (error) {
      console.error("Internal server error while getting groups:", error);
      return c.json(
        { error: "Internal server error while getting groups." },
        500
      );
    }
  }
);

app.get(
  "/:id/active-fields-configs-ids",
  userMiddleware,
  getFieldsConfigsIdsActiveForAnAwningDesc,
  async (c: Context) => {
    const supabase = c.get("supabase");
    const awningId = c.req.param("id");

    try {
      const { data, error } = await supabase
        .from("AWNINGS_FIELDS_CONFIGS")
        .select("FIELD_CONFIG_ID")
        .eq("AWNING_ID", awningId);

      const formattedData = Case.deepConvertKeys(
        (data ?? []).map((item) => item["FIELD_CONFIG_ID"]),
        Case.toCamelCase
      );

      if (error) {
        console.error("Error while getting active fields for awning:", error);
        return c.json(
          { error: "Error while getting active fields for awning." },
          400
        );
      }

      console.log("Active fields retrieved successfully");
      return c.json(formattedData, 200);
    } catch (error) {
      console.error(
        "Internal server error while getting active fields:",
        error
      );
      return c.json(
        { error: "Internal server error while getting active fields." },
        500
      );
    }
  }
);

export default app;
