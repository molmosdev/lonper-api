import { Context, Hono } from "hono";
import { userMiddleware } from "../middlewares/user.middleware";
import {
  postFieldDesc,
  putFieldDesc,
  putFieldsOrderDesc,
  deleteFieldDesc,
  putFieldConfigsDesc,
  createConfigDesc,
  deleteConfigDesc,
  linkFieldConfigToAnAwningDesc,
  unlinkFieldConfigFromAnAwningDesc,
  linkFieldConfigToAllAwningsDesc,
  unlinkFieldConfigFromAllAwningsDesc,
  getAwningsByFieldIdDesc,
} from "../openapi/descriptions/fieldsDescriptions";
import { IAwning, IField } from "@lonper/types";
import Case from "../utils/case";

const app = new Hono();

app.post("/", userMiddleware, postFieldDesc, async (c: Context) => {
  const supabase = c.get("supabase");

  try {
    const { name, description, saveOnRequest, groupId, delfosId } =
      await c.req.json();

    const { data: fields, error: fetchError } = await supabase
      .from("FIELDS")
      .select("ID")
      .eq("GROUP_ID", groupId);

    if (fetchError) {
      throw fetchError;
    }

    const newOrderIndex = fields.length > 0 ? fields.length + 1 : 0;

    const { data, error } = await supabase.from("FIELDS").insert([
      {
        NAME: name,
        DESCRIPTION: description,
        ORDER: newOrderIndex,
        GROUP_ID: groupId,
        SAVE_ON_REQUEST: saveOnRequest,
        DELFOS_ID: delfosId,
      },
    ]);

    if (error) {
      console.error("Error while creating field:", error);
      return c.json({ error: "Error while creating field." }, 400);
    }

    console.log("Field created successfully");
    return c.json(data, 201);
  } catch (error) {
    console.error("Internal server error while creating field:", error);
    return c.json(
      { error: "Internal server error while creating field." },
      500
    );
  }
});

app.put("/:id", userMiddleware, putFieldDesc, async (c: Context) => {
  const supabase = c.get("supabase");
  const id = c.req.param("id");

  try {
    const { name, description, saveOnRequest } = await c.req.json();

    const { data, error } = await supabase
      .from("FIELDS")
      .update({
        NAME: name,
        DESCRIPTION: description,
        SAVE_ON_REQUEST: saveOnRequest,
      })
      .eq("ID", id);

    if (error) {
      console.error("Error while updating field:", error);
      return c.json({ error: "Error while updating field." }, 400);
    }

    console.log("Field updated successfully");
    return c.json(data, 200);
  } catch (error) {
    console.error("Internal server error while updating field:", error);
    return c.json(
      { error: "Internal server error while updating field." },
      500
    );
  }
});

app.put("/order", userMiddleware, putFieldsOrderDesc, async (c: Context) => {
  const supabase = c.get("supabase");

  try {
    const { previousIndex, currentIndex, groupId } = await c.req.json();

    const { data: groupFields, error: fetchError } = await supabase
      .from("FIELDS")
      .select("*")
      .eq("GROUP_ID", groupId)
      .order("ORDER", { ascending: true });

    if (fetchError) {
      throw fetchError;
    }

    const formattedGroupFields = Case.deepConvertKeys(
      groupFields,
      Case.toCamelCase
    );

    if (
      previousIndex < 0 ||
      previousIndex >= formattedGroupFields.length ||
      currentIndex < 0 ||
      currentIndex >= formattedGroupFields.length
    ) {
      return c.json({ error: "Indices out of range." }, 400);
    }

    const [movingField] = formattedGroupFields.splice(previousIndex, 1);
    formattedGroupFields.splice(currentIndex, 0, movingField);

    const updatedGroupFields = formattedGroupFields.map(
      (groupField: IField, index: number) => ({
        ...groupField,
        order: index,
      })
    );

    const { error: updateError } = await supabase
      .from("FIELDS")
      .upsert(Case.deepConvertKeys(updatedGroupFields, Case.toUpperSnakeCase), {
        onConflict: "ID",
      });

    if (updateError) {
      throw updateError;
    }

    console.log("Fields order updated successfully");
    return c.json({ message: "Fields order updated successfully" }, 200);
  } catch (error) {
    console.error("Internal server error while updating fields order:", error);
    return c.json(
      { error: "Internal server error while updating fields order." },
      500
    );
  }
});

app.delete("/:id", userMiddleware, deleteFieldDesc, async (c: Context) => {
  const supabase = c.get("supabase");
  const id = c.req.param("id");

  try {
    const { error } = await supabase.from("FIELDS").delete().eq("ID", id);

    if (error) {
      console.error("Error while deleting field:", error);
      return c.json({ error: "Error while deleting field." }, 400);
    }

    console.log("Field deleted successfully");
    return c.json({ message: "Field deleted successfully" }, 200);
  } catch (error) {
    console.error("Internal server error while deleting field:", error);
    return c.json(
      { error: "Internal server error while deleting field." },
      500
    );
  }
});

app.put(
  "/subconfigs/:id",
  userMiddleware,
  putFieldConfigsDesc,
  async (c: Context) => {
    const supabase = c.get("supabase");
    const fieldConfigId = c.req.param("id");

    try {
      const subconfigs = await c.req.json();

      const formattedSubconfigs = Case.deepConvertKeys(
        subconfigs,
        Case.toUpperSnakeCase
      );

      const { data: currentSubconfigIds, error: fetchError } = await supabase
        .from("FIELDS_SUBCONFIGS")
        .select("ID")
        .eq("FIELD_CONFIG_ID", fieldConfigId);

      if (fetchError) {
        console.error("Error while fetching field subconfig IDs:", fetchError);
        return c.json(
          { error: "Error while fetching field subconfig IDs." },
          400
        );
      }

      const currentSubconfigIdSet = new Set(
        currentSubconfigIds.map((config) => config.ID)
      );
      const formattedSubconfigIdSet = new Set(
        formattedSubconfigs.map((config: { ID: string }) => config.ID)
      );

      const newSubconfigs = formattedSubconfigs.filter(
        (config: { ID: string }) => !currentSubconfigIdSet.has(config.ID)
      );
      const deletedSubconfigs = Array.from(currentSubconfigIdSet).filter(
        (id) => !formattedSubconfigIdSet.has(id)
      );
      const updatedSubconfigs = formattedSubconfigs.filter(
        (config: { ID: string }) => currentSubconfigIdSet.has(config.ID)
      );

      for (const newSubconfig of newSubconfigs) {
        const { error: insertError } = await supabase
          .from("FIELDS_SUBCONFIGS")
          .insert({
            FIELD_CONFIG_ID: fieldConfigId,
            DATA_UNIT: newSubconfig.DATA_UNIT,
            DB_SELECT: newSubconfig.DB_SELECT,
            HOVER_TEXT: newSubconfig.HOVER_TEXT,
            ID: newSubconfig.ID,
            LINKED_ACTIVE: newSubconfig.LINKED_ACTIVE,
            LINKED_SAME_DEFAULT_UNTOUCHED:
              newSubconfig.LINKED_SAME_DEFAULT_UNTOUCHED,
            LINKED_SAME_ON_VALIDATE: newSubconfig.LINKED_SAME_ON_VALIDATE,
            POPUP: newSubconfig.POPUP,
            SELECT: newSubconfig.SELECT,
            SHOW_NAME: newSubconfig.SHOW_NAME,
            REQUIRED: newSubconfig.REQUIRED,
            SIZE: newSubconfig.SIZE,
            TYPE: newSubconfig.TYPE,
            VALUE: newSubconfig.VALUE,
          });

        if (insertError) {
          console.error("Error while inserting field subconfig:", insertError);
          return c.json(
            { error: "Error while inserting field subconfig." },
            400
          );
        }
      }

      for (const updatedSubconfig of updatedSubconfigs) {
        const { error: updateError } = await supabase
          .from("FIELDS_SUBCONFIGS")
          .update({
            DATA_UNIT: updatedSubconfig.DATA_UNIT,
            DB_SELECT: updatedSubconfig.DB_SELECT,
            HOVER_TEXT: updatedSubconfig.HOVER_TEXT,
            LINKED_ACTIVE: updatedSubconfig.LINKED_ACTIVE,
            LINKED_SAME_DEFAULT_UNTOUCHED:
              updatedSubconfig.LINKED_SAME_DEFAULT_UNTOUCHED,
            LINKED_SAME_ON_VALIDATE: updatedSubconfig.LINKED_SAME_ON_VALIDATE,
            POPUP: updatedSubconfig.POPUP,
            SELECT: updatedSubconfig.SELECT,
            SHOW_NAME: updatedSubconfig.SHOW_NAME,
            REQUIRED: updatedSubconfig.REQUIRED,
            SIZE: updatedSubconfig.SIZE,
            TYPE: updatedSubconfig.TYPE,
            VALUE: updatedSubconfig.VALUE,
          })
          .eq("ID", updatedSubconfig.ID);

        if (updateError) {
          console.error("Error while updating field subconfig:", updateError);
          return c.json(
            { error: "Error while updating field subconfig." },
            400
          );
        }
      }

      for (const id of deletedSubconfigs) {
        const { error: deleteError } = await supabase
          .from("FIELDS_SUBCONFIGS")
          .delete()
          .eq("ID", id);

        if (deleteError) {
          console.error("Error while deleting field subconfig:", deleteError);
          return c.json(
            { error: "Error while deleting field subconfig." },
            400
          );
        }
      }

      console.log("Field subconfigs updated successfully");
      return c.json({ message: "Field subconfigs updated successfully" }, 200);
    } catch (error) {
      console.error(
        "Internal server error while updating field subconfigs:",
        error
      );
      return c.json(
        { error: "Internal server error while updating field subconfigs." },
        500
      );
    }
  }
);

app.post("/configs", userMiddleware, createConfigDesc, async (c: Context) => {
  const supabase = c.get("supabase");

  try {
    const { id } = await c.req.json();

    const { data, error } = await supabase
      .from("FIELDS_CONFIGS")
      .insert({ FIELD_ID: id });

    if (error) {
      console.error("Error while creating config:", error);
      return c.json({ error: "Error while creating config." }, 400);
    }

    console.log("Config created successfully");
    return c.json(data, 201);
  } catch (error) {
    console.error("Internal server error while creating config:", error);
    return c.json(
      { error: "Internal server error while creating config." },
      500
    );
  }
});

app.delete(
  "/configs/:id",
  userMiddleware,
  deleteConfigDesc,
  async (c: Context) => {
    const supabase = c.get("supabase");
    const id = c.req.param("id");

    try {
      const { error } = await supabase
        .from("FIELDS_CONFIGS")
        .delete()
        .eq("ID", id);

      if (error) {
        console.error("Error while deleting config:", error);
        return c.json({ error: "Error while deleting config." }, 400);
      }

      console.log("Config deleted successfully");
      return c.json({ message: "Config deleted successfully" }, 200);
    } catch (error) {
      console.error("Internal server error while deleting config:", error);
      return c.json(
        { error: "Internal server error while deleting config." },
        500
      );
    }
  }
);

app.put(
  "/configs/:id/link/:awningId",
  userMiddleware,
  linkFieldConfigToAnAwningDesc,
  async (c: Context) => {
    const supabase = c.get("supabase");
    const fieldIdToLink = c.req.param("id");
    const awningId = c.req.param("awningId");
    const fieldsIdsToUnlink = await c.req.json();

    try {
      const deletePromises = fieldsIdsToUnlink.map(async (fieldId: string) => {
        const { error } = await supabase
          .from("AWNINGS_FIELDS_CONFIGS")
          .delete()
          .match({ FIELD_CONFIG_ID: fieldId, AWNING_ID: awningId });

        if (error) {
          console.error(`Error unlinking field config ${fieldId}:`, error);
        }
      });

      await Promise.all(deletePromises);

      const { error } = await supabase
        .from("AWNINGS_FIELDS_CONFIGS")
        .insert({ FIELD_CONFIG_ID: fieldIdToLink, AWNING_ID: awningId });

      if (error) {
        console.error("Error linking field config:", error);
        return c.json({ error: "Error linking field config to awning." }, 400);
      }

      console.log("Field config linked successfully");
      return c.json({ message: "Field config linked successfully" }, 200);
    } catch (error) {
      console.error("Internal server error while linking field config:", error);
      return c.json(
        { error: "Internal server error while linking field config." },
        500
      );
    }
  }
);

app.put(
  "/configs/:id/unlink/:awningId",
  userMiddleware,
  unlinkFieldConfigFromAnAwningDesc,
  async (c: Context) => {
    const supabase = c.get("supabase");
    const fieldIdToUnlink = c.req.param("id");
    const awningId = c.req.param("awningId");

    try {
      const { error } = await supabase
        .from("AWNINGS_FIELDS_CONFIGS")
        .delete()
        .match({ FIELD_CONFIG_ID: fieldIdToUnlink, AWNING_ID: awningId });

      if (error) {
        console.error("Error unlinking field config:", error);
        return c.json(
          { error: "Error unlinking field config from awning." },
          400
        );
      }

      console.log("Field config unlinked successfully");
      return c.json({ message: "Field config unlinked successfully" }, 200);
    } catch (error) {
      console.error(
        "Internal server error while unlinking field config:",
        error
      );
      return c.json(
        { error: "Internal server error while unlinking field config." },
        500
      );
    }
  }
);

app.put(
  "/configs/:id/link-to-all-awnings",
  userMiddleware,
  linkFieldConfigToAllAwningsDesc,
  async (c: Context) => {
    const supabase = c.get("supabase");
    const fieldConfigId = c.req.param("id");

    try {
      const { data: awnings, error: awningsError } = await supabase
        .from("AWNINGS")
        .select("ID");

      if (awningsError) {
        console.error("Error getting awnings:", awningsError);
        return c.json({ error: "Error getting awnings." }, 400);
      }

      const { data: existingLinks, error: existingError } = await supabase
        .from("AWNINGS_FIELDS_CONFIGS")
        .select("AWNING_ID")
        .eq("FIELD_CONFIG_ID", fieldConfigId);

      if (existingError) {
        console.error("Error getting existing links:", existingError);
        return c.json({ error: "Error getting existing links." }, 400);
      }

      const existingAwningsIds = existingLinks.map((link) => link.AWNING_ID);

      const newEntries = awnings
        .filter((awning) => !existingAwningsIds.includes(awning.ID))
        .map((awning) => ({
          FIELD_CONFIG_ID: fieldConfigId,
          AWNING_ID: awning.ID,
        }));

      if (newEntries.length > 0) {
        const { error } = await supabase
          .from("AWNINGS_FIELDS_CONFIGS")
          .insert(newEntries);

        if (error) {
          console.error("Error inserting new links:", error);
          return c.json({ error: "Error linking field to awnings." }, 400);
        }
      }

      console.log("Field config linked to all awnings successfully");
      return c.json(
        { message: "Field config linked to all awnings successfully" },
        200
      );
    } catch (error) {
      console.error(
        "Internal server error while linking to all awnings:",
        error
      );
      return c.json(
        { error: "Internal server error while linking to all awnings." },
        500
      );
    }
  }
);

app.put(
  "/configs/:id/unlink-from-all-awnings",
  userMiddleware,
  unlinkFieldConfigFromAllAwningsDesc,
  async (c: Context) => {
    const supabase = c.get("supabase");
    const fieldConfigId = c.req.param("id");

    try {
      const { error } = await supabase
        .from("AWNINGS_FIELDS_CONFIGS")
        .delete()
        .match({ FIELD_CONFIG_ID: fieldConfigId });

      if (error) {
        console.error("Error unlinking from all awnings:", error);
        return c.json({ error: "Error unlinking from all awnings." }, 400);
      }

      console.log("Field config unlinked from all awnings successfully");
      return c.json(
        { message: "Field config unlinked from all awnings successfully" },
        200
      );
    } catch (error) {
      console.error(
        "Internal server error while unlinking from all awnings:",
        error
      );
      return c.json(
        { error: "Internal server error while unlinking from all awnings." },
        500
      );
    }
  }
);

app.get(
  "/:id/awnings",
  userMiddleware,
  getAwningsByFieldIdDesc,
  async (c: Context) => {
    const supabase = c.get("supabase");
    const fieldId = c.req.param("id");

    try {
      const { data, error } = await supabase
        .from("AWNINGS_FIELDS_CONFIGS")
        .select("AWNINGS(*)")
        .eq("FIELD_ID", fieldId);

      if (error) {
        console.error(
          "Internal server error while getting awnings by field id:",
          error
        );
        return c.json(
          { error: "Internal server error while getting awnings by field id." },
          500
        );
      }

      const uniqueAwningsData = Array.from(
        new Set(data.map((item: any) => item["AWNINGS"]["ID"]))
      )
        .map((id) => data.find((item: any) => item["AWNINGS"]["ID"] === id))
        .map((item: any) => ({
          ID: item["AWNINGS"]["ID"],
          AWNING_MODEL_ID: item["AWNINGS"]["AWNING_MODEL_ID"],
          value: item["AWNINGS"]["VALUE"],
        }));

      const awnings: IAwning[] = Case.deepConvertKeys(
        uniqueAwningsData,
        Case.toCamelCase
      );

      return c.json(awnings, 200);
    } catch (error) {
      console.error(
        "Internal server error while getting awnings by field id:",
        error
      );
      return c.json(
        { error: "Internal server error while getting awnings by field id." },
        500
      );
    }
  }
);

export default app;
