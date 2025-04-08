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
  getFieldsConfigsIdsActiveForAnAwningDesc,
  linkFieldConfigToAnAwningDesc,
  unlinkFieldConfigToAnAwningDesc,
  linkFieldConfigForAllAwningsDesc,
  unlinkFieldConfigForAllAwningsDesc,
} from "../openapi/descriptions/fieldsDescriptions";
import { IField } from "@lonper/types";
import Case from "../utils/case";

const app = new Hono();

app.post("/postField", userMiddleware, postFieldDesc, async (c: Context) => {
  const supabase = c.get("supabase");

  try {
    const { name, description, saveOnRequest, groupId } = await c.req.json();

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

app.put("/putField", userMiddleware, putFieldDesc, async (c: Context) => {
  const supabase = c.get("supabase");

  try {
    const { id, name, description, saveOnRequest } = await c.req.json();

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

app.put(
  "/putFieldsOrder",
  userMiddleware,
  putFieldsOrderDesc,
  async (c: Context) => {
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
        .upsert(
          Case.deepConvertKeys(updatedGroupFields, Case.toUpperSnakeCase),
          { onConflict: "ID" }
        );

      if (updateError) {
        throw updateError;
      }

      console.log("Fields order updated successfully");
      return c.json({ message: "Fields order updated successfully" }, 200);
    } catch (error) {
      console.error(
        "Internal server error while updating fields order:",
        error
      );
      return c.json(
        { error: "Internal server error while updating fields order." },
        500
      );
    }
  }
);

app.delete(
  "/deleteField",
  userMiddleware,
  deleteFieldDesc,
  async (c: Context) => {
    const supabase = c.get("supabase");

    try {
      const { id } = await c.req.json();

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
  }
);

app.put(
  "/putFieldConfigs",
  userMiddleware,
  putFieldConfigsDesc,
  async (c: Context) => {
    const supabase = c.get("supabase");

    try {
      const { id, configs } = await c.req.json();

      const formattedConfigs = Case.deepConvertKeys(
        configs,
        Case.toUpperSnakeCase
      );

      const { data: currentConfigIds, error: fetchError } = await supabase
        .from("FIELDS_SUBCONFIGS")
        .select("ID")
        .eq("FIELD_CONFIG_ID", id);

      if (fetchError) {
        console.error("Error while fetching field config IDs:", fetchError);
        return c.json({ error: "Error while fetching field config IDs." }, 400);
      }

      const currentConfigIdSet = new Set(
        currentConfigIds.map((config) => config.ID)
      );
      const formattedConfigIdSet = new Set(
        formattedConfigs.map((config: { ID: string }) => config.ID)
      );

      const newConfigs = formattedConfigs.filter(
        (config: { ID: string }) => !currentConfigIdSet.has(config.ID)
      );
      const deletedConfigs = Array.from(currentConfigIdSet).filter(
        (id) => !formattedConfigIdSet.has(id)
      );
      const updatedConfigs = formattedConfigs.filter((config: { ID: string }) =>
        currentConfigIdSet.has(config.ID)
      );

      // Insert new configs
      for (const newConfig of newConfigs) {
        const { error: insertError } = await supabase
          .from("FIELDS_SUBCONFIGS")
          .insert({
            FIELD_CONFIG_ID: id,
            DATA_UNIT: newConfig.DATA_UNIT,
            DB_SELECT: newConfig.DB_SELECT,
            HOVER_TEXT: newConfig.HOVER_TEXT,
            ID: newConfig.ID,
            LINKED_ACTIVE: newConfig.LINKED_ACTIVE,
            LINKED_SAME_DEFAULT_UNTOUCHED:
              newConfig.LINKED_SAME_DEFAULT_UNTOUCHED,
            LINKED_SAME_ON_VALIDATE: newConfig.LINKED_SAME_ON_VALIDATE,
            POPUP: newConfig.POPUP,
            SELECT: newConfig.SELECT,
            SHOW_NAME: newConfig.SHOW_NAME,
            REQUIRED: newConfig.REQUIRED,
            SIZE: newConfig.SIZE,
            TYPE: newConfig.TYPE,
            VALUE: newConfig.VALUE,
          });

        if (insertError) {
          console.error("Error while inserting field config:", insertError);
          return c.json({ error: "Error while inserting field config." }, 400);
        }
      }

      // Update existing configs
      for (const updatedConfig of updatedConfigs) {
        const { error: updateError } = await supabase
          .from("FIELDS_SUBCONFIGS")
          .update({
            DATA_UNIT: updatedConfig.DATA_UNIT,
            DB_SELECT: updatedConfig.DB_SELECT,
            HOVER_TEXT: updatedConfig.HOVER_TEXT,
            LINKED_ACTIVE: updatedConfig.LINKED_ACTIVE,
            LINKED_SAME_DEFAULT_UNTOUCHED:
              updatedConfig.LINKED_SAME_DEFAULT_UNTOUCHED,
            LINKED_SAME_ON_VALIDATE: updatedConfig.LINKED_SAME_ON_VALIDATE,
            POPUP: updatedConfig.POPUP,
            SELECT: updatedConfig.SELECT,
            SHOW_NAME: updatedConfig.SHOW_NAME,
            REQUIRED: updatedConfig.REQUIRED,
            SIZE: updatedConfig.SIZE,
            TYPE: updatedConfig.TYPE,
            VALUE: updatedConfig.VALUE,
          })
          .eq("ID", updatedConfig.ID);

        if (updateError) {
          console.error("Error while updating field config:", updateError);
          return c.json({ error: "Error while updating field config." }, 400);
        }
      }

      // Delete removed configs
      for (const id of deletedConfigs) {
        const { error: deleteError } = await supabase
          .from("FIELDS_SUBCONFIGS")
          .delete()
          .eq("ID", id);

        if (deleteError) {
          console.error("Error while deleting field config:", deleteError);
          return c.json({ error: "Error while deleting field config." }, 400);
        }
      }

      console.log("Field configs updated successfully");
      return c.json({ message: "Field configs updated successfully" }, 200);
    } catch (error) {
      console.error(
        "Internal server error while updating field configs:",
        error
      );
      return c.json(
        { error: "Internal server error while updating field configs." },
        500
      );
    }
  }
);

app.post(
  "/createConfig",
  userMiddleware,
  createConfigDesc,
  async (c: Context) => {
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
  }
);

app.delete(
  "/deleteConfig",
  userMiddleware,
  deleteConfigDesc,
  async (c: Context) => {
    const supabase = c.get("supabase");

    try {
      const { id } = await c.req.json();

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

app.get(
  "/getFieldsConfigsIdsActiveForAnAwning/:awningId",
  userMiddleware,
  getFieldsConfigsIdsActiveForAnAwningDesc,
  async (c: Context) => {
    const supabase = c.get("supabase");
    const awningId = c.req.param("awningId");

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

app.post(
  "/linkFieldConfigToAnAwning",
  userMiddleware,
  linkFieldConfigToAnAwningDesc,
  async (c: Context) => {
    const supabase = c.get("supabase");

    try {
      const { fieldsIdsToUnlink, fieldIdToLink, awningId } = await c.req.json();

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

app.post(
  "/unlinkFieldConfigToAnAwning",
  userMiddleware,
  unlinkFieldConfigToAnAwningDesc,
  async (c: Context) => {
    const supabase = c.get("supabase");

    try {
      const { fieldIdToUnlink, awningId } = await c.req.json();

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

app.post(
  "/linkFieldConfigForAllAwnings",
  userMiddleware,
  linkFieldConfigForAllAwningsDesc,
  async (c: Context) => {
    const supabase = c.get("supabase");

    try {
      const { fieldConfigId } = await c.req.json();

      const { data: AWNINGS, error: awningsError } = await supabase
        .from("AWNINGS")
        .select("ID");

      if (awningsError) {
        console.error("Error getting awnings:", awningsError);
        return c.json({ error: "Error getting awnings." }, 400);
      }

      const insertPromises = AWNINGS.map(async (AWNING) => {
        const { data: existingField, error: existingFieldError } =
          await supabase
            .from("AWNINGS_FIELDS_CONFIGS")
            .select("ID")
            .match({ FIELD_CONFIG_ID: fieldConfigId, AWNING_ID: AWNING["ID"] });

        if (existingFieldError) {
          console.error(
            `Error checking existing field for awning ${AWNING["ID"]}:`,
            existingFieldError
          );
          return;
        }

        if (existingField.length > 0) {
          return;
        }

        const { error } = await supabase
          .from("AWNINGS_FIELDS_CONFIGS")
          .insert({ FIELD_CONFIG_ID: fieldConfigId, AWNING_ID: AWNING["ID"] });

        if (error) {
          console.error(
            `Error linking field to awning ${AWNING["ID"]}:`,
            error
          );
        }
      });

      await Promise.all(insertPromises);

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

app.post(
  "/unlinkFieldConfigForAllAwnings",
  userMiddleware,
  unlinkFieldConfigForAllAwningsDesc,
  async (c: Context) => {
    const supabase = c.get("supabase");

    try {
      const { fieldConfigId } = await c.req.json();

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

export default app;
